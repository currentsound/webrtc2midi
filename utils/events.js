import EventEmitter from "eventemitter3";

if (!window.WebRTC2MIDI) {
    window.WebRTC2MIDI = new EventEmitter();
}

export const MIDI_OUT = "midi-out";
export const MIDI_IN = "midi-in";
export const PEER_CONNECTION = "peer-connection";
export const PEER_INIT = "peer-init";

export const events = window.WebRTC2MIDI;

export default events;