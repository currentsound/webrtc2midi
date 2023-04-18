import Peer from "peerjs";
import { ref } from "vue";

let peer = null;
let conn = null;

export const status = ref("not initialized");
export const send = function send(...args) {
    if (conn) {
        conn.send(...args);
    } else {
        console.warn('client not initialized');
    }

}

export const createPeerClient = function createPeerClient(remotePeerId = 'AbletonController1') {
    if (conn) conn.close();
    if (peer) peer.disconnect();
    return new Promise((resolve, reject) => {
        peer = new Peer();
        peer.on('open', id => {
            console.log('device id =', id);
            conn = peer.connect(remotePeerId, { serialization: "none" });
            conn.on('open', () => {
                status.value = 'connected';
            });
            conn.on('close', () => {
                status.value = 'closed';
            });
            conn.on('error', err => {
                console.error(err);
                status.value = 'error';
            });
            resolve();
        });
        peer.on('error', reject);
    })
}

export default createPeerClient;

