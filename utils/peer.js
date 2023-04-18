import JZZ from "jzz";
import Peer from "peerjs";
import qs from "qs";
import { MIDI_OUT, MIDI_IN, PEER_CONNECTION, PEER_INIT, events } from "./events";

const connections = {};
const query = qs.parse(location.search, { ignoreQueryPrefix: true });
let PEER_ID = query.peerId || localStorage.PEER_ID || `${1e7 + Math.round(Math.random() * 1e8)}`;
let peer = null;

console.log(qs.parse(localStorage.href));

export const initPeer = (peerId) => {
    if (peer !== null) {
        disconnect(true);
        peer.disconnect();
    }
    PEER_ID = peerId || PEER_ID;
    localStorage.PEER_ID = PEER_ID;
    
    peer = new Peer(PEER_ID);
    peer.on("connection", onConnectionCreated);
    console.log("Available for peer connections on: " + PEER_ID);
    events.emit(PEER_INIT, PEER_ID);
    return peer;
}

export const getPeerID = () => PEER_ID

export const connect = (instanceId, peerId) => {
    disconnect(instanceId);
    if (peer === null) initPeer();
    if (!peerId) peerId = instanceId;
    const conn = peer.connect(peerId, { serialization: 'none'});
    console.log("connecting with: ", peerId);
    if (conn) {
        conn.instanceId = instanceId;
        return onConnectionCreated(conn);
    }
    throw new Error("No Peer Connection");
}

export const disconnect = (instanceId) => {
    Object.values(connections)
        .filter(conn => instanceId === true || conn.instanceId === instanceId)
        .forEach(conn => {
            conn.close();
            delete connections[conn.peer];
        });
}

const onConnectionCreated = conn => new Promise((resolve, reject) => {
    conn.on("open", () => {
        console.log("connected to peer:" + conn.peer);
        connections[conn.peer] = conn;
        events.emit(PEER_CONNECTION, Object.values(connections).map(conn => conn.peer), conn);

        // WebRTC -> MIDI
        conn.on('data', (msg) => {
            console.log('[peer] MIDI_OUTPUT.emit:', typeof msg, msg);
            msg = JZZ.MIDI(msg.split(','));
            events.emit(MIDI_OUT, msg);
        });

        // MIDI -> WebRTC
        const sendMidiToPeer = (msg) => {
            msg = [...msg];
            // console.log('[peer] MIDI_INPUT.listener:', msg)
            conn.send(msg);
        }
        events.on(MIDI_IN, sendMidiToPeer);

        // Clean up
        conn.on('close', () => {
            console.log("disconnected from: " + conn.peer);
            events.off(MIDI_IN, sendMidiToPeer);
            delete connections[conn.peer];
            events.emit(PEER_CONNECTION, Object.values(connections).map(conn => conn.peer), conn);
        });

        resolve(conn);
    });
    conn.on("error", reject);
});