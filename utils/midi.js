import JZZ from "jzz";
import { MIDI_IN, MIDI_OUT, events } from "./events";

window.JZZ = JZZ;
let midiInput = null;
let midiOutput = null;

const wait = ms => new Promise(resolve => setTimeout(resolve, ms));

const getInfo = async () => {
    let deviceCount = 0, i = 0, info = null;
    while (deviceCount === 0 && i < 100) {
        info = await JZZ().refresh().info();
        i++;
        deviceCount = info.inputs.length + info.outputs.length;
        if (deviceCount === 0) await wait(100);
    };
    return info;
}

export const getInputs = async () => {
    return (await getInfo()).inputs;
}

export const getOutputs = async () => {
    return (await getInfo()).outputs;
}

export const openInput = async (name) => {
    if (midiInput) {
        console.log('disconnect MIDI input: '+name);
        midiInput.disconnect();
        midiInput.close();
        midiInput = null;
    }
    if (name && name !== 'null') {
        console.log('connect MIDI input: ' + name);
        midiInput = await JZZ().openMidiIn(name);
        // MIDI -> WebRTC
        midiInput.connect(msg => {
            // console.log('[midi] MIDI_INPUT.emit:', msg);
            events.emit(MIDI_IN, msg);
        });
    }
    return midiInput;
}

export const openOutput = async (name) => {
    if (midiOutput) {
        console.log('disconnect MIDI output: '+name);
        midiOutput.disconnect();
        midiOutput.close();
        midiOutput = null;
    }
    if (name && name !== "null") {
        console.log('connect MIDI output: ' + name);
        midiOutput = await JZZ().openMidiOut(name);
    }
    return midiOutput;
}

// WebRTC -> MIDI
events.on(MIDI_OUT, msg => {
    if (midiOutput) {
        // console.log('[midi] MIDI_OUTPUT.listener:', msg);
        midiOutput.send(msg)
    } else {
        console.warn('[midi] MIDI_OUTPUT.listener: no midi output device', msg);
    }
});

export default { getInputs, getOutputs, openInput, openOutput };
