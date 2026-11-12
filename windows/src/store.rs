// Local, on-disk state for the Windows app — the Rust port of the Electron
// desktop app's store.js. Nothing leaves the PC. Holds the skin assigned to
// each card and the previous record, so every change can be undone.

use std::fs;
use std::path::PathBuf;
use std::time::{SystemTime, UNIX_EPOCH};

use serde_json::{Value, json};

pub fn data_dir() -> PathBuf {
    let base = std::env::var("APPDATA")
        .or_else(|_| std::env::var("LOCALAPPDATA"))
        .unwrap_or_else(|_| r"C:\Users\Default\AppData\Roaming".to_string());
    PathBuf::from(base).join("Veyro")
}

pub fn skins_dir() -> PathBuf {
    data_dir().join("skins")
}

pub fn originals_dir() -> PathBuf {
    data_dir().join("originals")
}

fn state_path() -> PathBuf {
    data_dir().join("veyro-state.json")
}

fn ensure() {
    for d in [data_dir(), skins_dir(), originals_dir()] {
        let _ = fs::create_dir_all(&d);
    }
}

pub fn safe(s: &str) -> String {
    let cleaned: String = s
        .chars()
        .map(|c| if c.is_ascii_alphanumeric() || c == '_' || c == '-' { c } else { '_' })
        .collect();
    cleaned.chars().take(64).collect()
}

fn now_millis() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|d| d.as_millis() as u64)
        .unwrap_or(0)
}

pub fn read() -> Value {
    ensure();
    match fs::read_to_string(state_path()) {
        Ok(text) => serde_json::from_str(&text).unwrap_or_else(|_| default_state()),
        Err(_) => default_state(),
    }
}

fn default_state() -> Value {
    json!({ "cards": {}, "history": {} })
}

pub fn write(state: &Value) {
    ensure();
    if let Ok(text) = serde_json::to_string_pretty(state) {
        let _ = fs::write(state_path(), text);
    }
}

pub fn skin_path(card_id: &str) -> PathBuf {
    skins_dir().join(format!("{}.png", safe(card_id)))
}

/// Persist a rendered skin PNG for a card. Returns the card record.
pub fn save_skin(
    card_id: &str,
    png: &[u8],
    label: &str,
    design_id: Option<&str>,
    design_name: &str,
    source: &str,
) -> Value {
    ensure();
    let file = skin_path(card_id);
    let _ = fs::write(&file, png);

    let mut state = read();
    // First time this card is skinned, remember what was there so undo is real.
    let prev = state["cards"].get(card_id).cloned();
    if let Some(prev) = &prev {
        let has_skin = prev.get("skinPath").map(|v| !v.is_null()).unwrap_or(false);
        let has_history = state["history"].get(card_id).is_some();
        if has_skin && !has_history {
            state["history"][card_id] = prev.clone();
        }
    }

    let record = json!({
        "skinPath": file.to_string_lossy(),
        "label": label,
        "designId": design_id,
        "designName": if design_name.is_empty() { "Custom" } else { design_name },
        "source": source,
        "appliedToPhone": false,
        "updatedAt": now_millis(),
    });
    state["cards"][card_id] = record.clone();
    write(&state);
    record
}

pub fn mark_applied(card_ids: &[String]) {
    let mut state = read();
    for id in card_ids {
        if let Some(card) = state["cards"].get_mut(id) {
            card["appliedToPhone"] = json!(true);
        }
    }
    write(&state);
}

/// Undo one card: drop its current skin, restoring the previous record.
/// Returns the current (possibly null) card record.
pub fn undo(card_id: &str) -> Value {
    let mut state = read();
    let prev = state["history"].get(card_id).cloned();
    let result;
    if let Some(prev) = prev {
        let mut restored = prev;
        restored["appliedToPhone"] = json!(false);
        restored["updatedAt"] = json!(now_millis());
        state["cards"][card_id] = restored.clone();
        if let Some(obj) = state["history"].as_object_mut() {
            obj.remove(card_id);
        }
        result = restored;
    } else {
        if let Some(obj) = state["cards"].as_object_mut() {
            obj.remove(card_id);
        }
        result = Value::Null;
    }
    write(&state);
    result
}

/// Pending cards to flash: those with a skin PNG on disk not yet applied.
pub fn pending_cards() -> Vec<(String, PathBuf)> {
    let state = read();
    let mut out = Vec::new();
    if let Some(cards) = state["cards"].as_object() {
        for (id, rec) in cards {
            let applied = rec.get("appliedToPhone").and_then(|v| v.as_bool()).unwrap_or(false);
            let skin = rec.get("skinPath").and_then(|v| v.as_str());
            if let Some(skin) = skin {
                let p = PathBuf::from(skin);
                if !applied && p.is_file() {
                    out.push((id.clone(), p));
                }
            }
        }
    }
    out
}
