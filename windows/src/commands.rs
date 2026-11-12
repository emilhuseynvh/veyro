// Tauri command layer: exposes the existing Rust device engine to the web UI
// using the exact `window.veyro` contract the renderer expects.

use std::sync::Arc;
use std::sync::Mutex;
use std::sync::atomic::{AtomicBool, Ordering};

use base64::Engine as _;
use serde_json::{Value, json};
use tauri::{AppHandle, Emitter, State};

use crate::flasher::{self, WalletArt};
use crate::image_skin;
use crate::scanner;
use crate::{device, store};

/// Holds the stop flag for the currently running syslog scan thread.
#[derive(Default)]
pub struct ScanState {
    stop: Mutex<Option<Arc<AtomicBool>>>,
}

impl ScanState {
    fn stop_previous(&self) {
        if let Ok(mut guard) = self.stop.lock() {
            if let Some(flag) = guard.take() {
                flag.store(true, Ordering::Relaxed);
            }
        }
    }

    fn set(&self, flag: Arc<AtomicBool>) {
        if let Ok(mut guard) = self.stop.lock() {
            *guard = Some(flag);
        }
    }
}

#[tauri::command]
pub fn engine_status() -> Value {
    json!({ "mode": "live", "backend": "veyro", "platform": "windows" })
}

#[tauri::command]
pub fn state_get() -> Value {
    let state = store::read();
    let history_keys: Vec<String> = state["history"]
        .as_object()
        .map(|o| o.keys().cloned().collect())
        .unwrap_or_default();
    json!({
        "cards": state["cards"].clone(),
        "history": history_keys,
    })
}

#[tauri::command]
pub async fn list_devices() -> Value {
    let result = tauri::async_runtime::spawn_blocking(|| device::list_connected_devices()).await;
    match result {
        Ok(Ok(devices)) => {
            let list: Vec<Value> = devices
                .into_iter()
                .map(|d| {
                    json!({
                        "udid": d.udid,
                        "name": d.name,
                        "version": format!("iOS {}", d.ios_version),
                        "product": d.product_type,
                        "connected": true,
                        "airliftCompatible": true,
                    })
                })
                .collect();
            json!({ "ok": true, "devices": list, "error": Value::Null })
        }
        Ok(Err(e)) => json!({ "ok": false, "devices": [], "error": format!("{e:#}") }),
        Err(e) => json!({ "ok": false, "devices": [], "error": format!("{e}") }),
    }
}

#[tauri::command]
pub fn scan(app: AppHandle, state: State<'_, ScanState>, udid: Option<String>) -> Value {
    // Stop any previous scan, start a fresh one.
    state.stop_previous();
    let stop_flag = Arc::new(AtomicBool::new(false));
    state.set(Arc::clone(&stop_flag));

    let udid_owned = udid.clone();
    let app_for_thread = app.clone();
    std::thread::spawn(move || {
        let on_card = |hash: String, name: String| {
            let label = if name.is_empty() {
                format!("Card ({}…)", &hash[..hash.len().min(8)])
            } else {
                name
            };
            let _ = app_for_thread.emit("card-detected", json!({ "id": hash, "label": label }));
        };
        let _ = scanner::scan_syslog_for_cards(
            udid_owned.as_deref(),
            stop_flag,
            on_card,
            |_log| {},
        );
    });

    // Return cards we already know about so the UI has something immediately.
    let cards: Vec<Value> = scanner::load_saved_cards()
        .into_iter()
        .map(|c| {
            let label = if c.name.is_empty() {
                format!("Card ({}…)", &c.hash[..c.hash.len().min(8)])
            } else {
                c.name
            };
            json!({ "id": c.hash, "label": label })
        })
        .collect();

    json!({ "ok": true, "cards": cards, "error": Value::Null })
}

#[tauri::command]
pub fn add_manual_card(card_id: String, label: Option<String>) -> Value {
    scanner::add_or_update_card(&card_id, label.as_deref().unwrap_or(""));
    json!({ "ok": true })
}

#[tauri::command]
pub fn apply_design(
    card_id: String,
    png: Vec<u8>,
    design_id: Option<String>,
    design_name: Option<String>,
    label: Option<String>,
) -> Value {
    let record = store::save_skin(
        &card_id,
        &png,
        label.as_deref().unwrap_or(""),
        design_id.as_deref(),
        design_name.as_deref().unwrap_or("Custom"),
        "design",
    );
    json!({ "card": record })
}

#[tauri::command]
pub fn apply_upload(
    card_id: String,
    png: Vec<u8>,
    name: Option<String>,
    label: Option<String>,
) -> Value {
    let design_name = name
        .as_deref()
        .map(|n| n.rsplit_once('.').map(|(base, _)| base).unwrap_or(n).to_string())
        .unwrap_or_else(|| "Your image".to_string());
    let record = store::save_skin(
        &card_id,
        &png,
        label.as_deref().unwrap_or(""),
        None,
        &design_name,
        "upload",
    );
    json!({ "card": record })
}

#[tauri::command]
pub async fn undo_card(card_id: String, udid: Option<String>) -> Value {
    let record = store::undo(&card_id);

    // Revert on the phone too, when we have a saved original for this card.
    if let Some(udid) = udid {
        let card_for_task = card_id.clone();
        let _ = tauri::async_runtime::spawn_blocking(move || {
            if flasher::original_backup_exists(&udid, &card_for_task) {
                let _ = flasher::restore_original_artwork(
                    &udid,
                    &card_for_task,
                    |_, _, _| {},
                    |_| {},
                );
            }
        })
        .await;
    }

    json!({ "card": record })
}

#[tauri::command]
pub async fn push_to_phone(app: AppHandle, udid: String) -> Value {
    let pending = store::pending_cards();
    if pending.is_empty() {
        return json!({ "ok": true, "applied": [], "failed": [], "nothing": true });
    }

    let result = tauri::async_runtime::spawn_blocking(move || {
        let total = pending.len();
        let mut applied: Vec<String> = Vec::new();
        let mut failed: Vec<String> = Vec::new();
        let mut last_error: Option<String> = None;

        for (idx, (card_id, skin_path)) in pending.iter().enumerate() {
            let png_3x = match std::fs::read(skin_path) {
                Ok(b) => b,
                Err(e) => {
                    failed.push(card_id.clone());
                    last_error = Some(format!("Could not read saved skin: {e}"));
                    continue;
                }
            };
            let png_2x = match image_skin::png_2x_from_3x(&png_3x) {
                Ok(b) => b,
                Err(e) => {
                    failed.push(card_id.clone());
                    last_error = Some(format!("Could not build @2x image: {e:#}"));
                    continue;
                }
            };
            let art = WalletArt::Png { png_3x, png_2x };

            let app_progress = app.clone();
            let done = idx;
            let flash_res = flasher::flash_wallet_skin(
                &udid,
                card_id,
                &art,
                |step, step_total, _msg| {
                    let frac = if step_total > 0 {
                        (step as f64 / step_total as f64).clamp(0.0, 1.0)
                    } else {
                        0.0
                    };
                    let percent = (((done as f64 + frac) / total as f64) * 100.0).round() as i64;
                    let _ = app_progress.emit(
                        "apply-progress",
                        json!({ "percent": percent, "cardId": card_id }),
                    );
                },
                |_log| {},
            );

            match flash_res {
                Ok(()) => applied.push(card_id.clone()),
                Err(e) => {
                    failed.push(card_id.clone());
                    last_error = Some(format!("{e:#}"));
                }
            }

            let percent = (((idx + 1) as f64 / total as f64) * 100.0).round() as i64;
            let _ = app.emit("apply-progress", json!({ "percent": percent, "cardId": card_id }));
        }

        (applied, failed, last_error)
    })
    .await;

    let (applied, failed, last_error) = match result {
        Ok(v) => v,
        Err(e) => return json!({ "ok": false, "applied": [], "failed": [], "error": format!("{e}") }),
    };

    if !applied.is_empty() {
        store::mark_applied(&applied);
    }

    let ok = !applied.is_empty() && failed.is_empty();
    json!({
        "ok": ok,
        "applied": applied,
        "failed": failed,
        "error": if ok { Value::Null } else {
            json!(last_error.unwrap_or_else(|| "Could not write all cards to iPhone.".to_string()))
        },
    })
}

#[tauri::command]
pub fn skin_url(card_id: String) -> Option<String> {
    // Prefer the skin the user applied; fall back to a saved original if present.
    let skin = store::skin_path(&card_id);
    let bytes = if skin.is_file() {
        std::fs::read(&skin).ok()
    } else {
        let orig = store::originals_dir().join(format!("{}.png", store::safe(&card_id)));
        if orig.is_file() { std::fs::read(&orig).ok() } else { None }
    }?;
    let b64 = base64::engine::general_purpose::STANDARD.encode(&bytes);
    Some(format!("data:image/png;base64,{b64}"))
}

#[tauri::command]
pub fn open_external(url: String) -> Value {
    if url.starts_with("http://") || url.starts_with("https://") {
        // Launch the default browser without a console window.
        let _ = std::process::Command::new("cmd")
            .args(["/C", "start", "", &url])
            .spawn();
    }
    json!({ "ok": true })
}
