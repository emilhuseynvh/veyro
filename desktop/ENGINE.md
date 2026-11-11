# The Veyro device engine

Veyro is split into two parts on purpose.

**Veyro (this app)** does everything that is safe and portable: the interface,
the design gallery, cropping an image to the card raster, saving each card's
original artwork, and undo. It never contains code that writes to a phone.

**The engine** is a separate executable that performs the one step Veyro will
not do itself: writing the chosen artwork into the Wallet cache on a connected
iPhone. You supply and configure it. Click **Engine…** in the title bar and
pick the executable. Without an engine Veyro cannot reach a phone at all: it
shows the "Connect your iPhone" guide and writes nothing. There is no demo or
preview mode and no fake cards.

## Why it is separate

Changing Wallet artwork on a non-jailbroken iPhone relies on an iOS sync
exploit. That exploit is maintained by the open-source
[AirCard](https://github.com/Mak5er/AirCard) project (MIT) and its upstream
`airlift`. Veyro deliberately does not bundle or reimplement it. Keeping the
device-write behind a replaceable engine means Veyro ships only a front end,
and you decide what runs against your own device.

## The contract

The engine is any executable that answers three subcommands and prints one line
of JSON to stdout.

```
engine list-devices
  → {"devices":[{"udid":"...","name":"iPhone","version":"iOS 18.5","product":"iPhone16,2"}]}

engine scan --udid <UDID>
  → {"cards":[{"id":"<card-id>","label":"Everyday debit"}]}

engine apply --manifest <path-to-json>
  → {"ok":true,"applied":["<card-id>", ...]}
```

The manifest Veyro writes for `apply`:

```json
{
  "udid": "00008110-00XXXXXXXXXXXXXX",
  "items": [
    { "cardId": "<card-id>", "png": "/absolute/path/to/skin.png" }
  ]
}
```

Each `png` is a ready 1536×969 image. The engine only has to deliver it to the
named card on the device. Anything the engine cannot do should be reported with
`{"ok":false}` so Veyro can tell you.

## A reference engine

A thin wrapper that maps these three subcommands onto a local AirCard checkout
is the intended way to run live. Veyro does not include it. Point the **Engine…**
picker at your own wrapper once AirCard is installed and working on your Mac.

Requirements for live use come from AirCard, not Veyro: a Mac with Apple's
Command Line Tools, an iPhone on a supported iOS version, connected and trusted.
