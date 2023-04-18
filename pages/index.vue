<template>
  <div class="app pure-form">
    <h2><a href="https://github.com/markmarijnissen/webrtc2midi" target="_blank">WebRTC to MIDI</a></h2>
    <div v-if="!peerInitialized">
      <div class="config panel">
        <strong>My Device ID</strong>
        <input type="text" v-model="newPeerId" class="pure-input full" :placeholder="peerId" />
        <strong>MIDI input</strong>
        <select v-model="midiInput">
          <option :value="null"></option>
          <option v-for="d in midiInputs" :value="d.id" :key="d.id">{{ d.name }}</option>
        </select>
        <strong>MIDI output</strong>
        <select v-model="midiOutput">
          <option :value="null"></option>
          <option v-for="d in midiOutputs" :value="d.id" :key="d.id">{{ d.name }}</option>
        </select>
      </div>
      <button class="pure-button pure-button-primary" @click.prevent="start" :disabled="!midiInput && !midiOutput ? true : null">Start WebRTC to MIDI</button>
    </div>
    <div v-else>
      <div class="config">
        <span>My Device ID</span>
        <strong>{{ peerId }}</strong>
        <span><span class="box" :class="{ on: inputActivity }"></span> MIDI input</span>
        <strong>{{ midiInput || '---' }}</strong>
        <span><span class="box" :class="{ on: outputActivity }"></span> MIDI output</span>
        <strong> {{ midiOutput || '---' }}</strong>
      </div>
      <div class="pure-menu pure-menu-horizontal">
        <ul class="pure-menu-list">
          <li class="pure-menu-item" :class="{ 'pure-menu-selected': view === 'connections' }">
            <span class="pure-menu-link" @click.prevent="view = 'connections'">Connections</span>
          </li>
          <!-- <li class="pure-menu-item" :class="{ 'pure-menu-selected': view === 'qr' }">
                    <span class="pure-menu-link" @click.prevent="view = 'qr'">QR code</span>
                </li> -->
        </ul>
      </div>
      <div class="panel">
        <div class="group">
          <input type="text" v-model="remotePeerId" placeholder="remote device id" />
          <button class="pure-button pure-button-primary" @click.prevent="connect">Connect</button>
        </div>
        <ul>
          <li v-for="i in connections">{{ i }} <a href="#" class="red" @click.prevent="disconnect(i)">disconnect</a></li>
        </ul>
      </div>
      <label><input type="checkbox" v-model="showMessages"> Show messages</label>
      <div class="logs" v-if="showMessages">
        <div v-for="log in logs" :class="log.src">{{ log.msg }}</div>
      </div>
    </div>
</div></template>
<script setup>
import qs from "qs";
import dayjs from "dayjs";
import _ from "lodash";
import { ref, onUnmounted } from "vue";
import { PEER_INIT, PEER_CONNECTION, MIDI_IN, MIDI_OUT, events } from "../utils/events";
import { initPeer, getPeerID, connect as peerConnect, disconnect } from "../utils/peer";
import { getInputs, getOutputs, openInput, openOutput} from "../utils/midi";

const query = qs.parse(location.search, { ignoreQueryPrefix: true });
const peerInitialized = ref(false);
const peerId = ref(getPeerID());
const newPeerId = ref(peerId.value);

const showEditPeerId = ref(false);
const view = ref('connections');
const remotePeerId = ref("");

const midiInput = ref(query.input || localStorage.MIDI_INPUT);
const midiOutput = ref(query.output || localStorage.MIDI_OUTPUT);
if (midiInput.value === 'null') midiInput.value = null;
if (midiOutput.value === 'null') midiOutput.value = null;


const midiInputs = ref([]);
const midiOutputs = ref([]);

const showMessages = ref(false);
const connections = ref([]);

const onPeerInit = val => {
  peerInitialized.value = true;
  peerId.value = val;
  newPeerId.value = val;
  showEditPeerId.value = false;
};
events.on(PEER_INIT, onPeerInit);
onUnmounted(() => events.off(PEER_INIT, onPeerInit));

const onConnection = value => {
  connections.value = value;
}
events.on(PEER_CONNECTION, onConnection);
onUnmounted(() => events.off(PEER_CONNECTION, onConnection));

// logs
const inputActivity = ref(false);
const outputActivity = ref(false);

const turnOffInputActivity = _.debounce(() => inputActivity.value = false, 200);
const turnOffOutputActivity = _.debounce(() => outputActivity.value = false, 200);

const logs = ref([]);
const onMidiInput = msg => {
  inputActivity.value = true;
  turnOffInputActivity();
  msg = `in : ${dayjs().format("HH:mm:ss.SSS")} ${msg.toString()}`;
  logs.value.push({
    src: 'midi-in',
    msg
  });
  logs.value.splice(0, logs.value.length - 20);
  console.log(msg);
}
events.on(MIDI_IN, onMidiInput);
onUnmounted(() => events.off(MIDI_IN, onMidiInput));

const onMidiOutput = msg => {
  outputActivity.value = true;
  turnOffOutputActivity();
  msg = `out: ${dayjs().format("HH:mm:ss.SSS")} ${msg.toString()}`
  logs.value.push({
    src: 'midi-out',
    msg
  });
  logs.value.splice(0, logs.value.length - 20);
  console.log(msg);
}
events.on(MIDI_OUT, onMidiOutput);
onUnmounted(() => events.off(MIDI_OUT, onMidiOutput));


getInputs().then(value => midiInputs.value = value);
getOutputs().then(value => midiOutputs.value = value);

function start() {
  initPeer(newPeerId.value);
  showEditPeerId.value = false;
  openInput(midiInput.value);
  openOutput(midiOutput.value);
  localStorage.MIDI_INPUT = midiInput.value;
  localStorage.MIDI_OUTPUT = midiOutput.value;
}

function connect() {
  peerConnect(remotePeerId.value);
  remotePeerId.value = '';
}

</script>
<style scoped>
.app {
  margin: 10px;
}

.box {
  display: inline-block;
  width: 1em;
  height: 1em;
  border: 1px solid #333;
  background-color: #eee;
}
.box.on {
  background-color: blue;
}

.config {
  display: grid;
  gap: 10px;
  grid-template-columns: fit-content(400px) auto;
  margin-bottom: 10px;
}
.config.panel strong {
  line-height: 2em;
}

.red {
  color: red;
}

.logs {
  background-color: #333;
  color: white;
  font-family: 'Courier New', Courier, monospace;
  padding: 10px;
  font-size: 14px;
  height: 23em;
}
.logs .midi-in {
  color: cyan;
}
.logs .midi-out {
  color: yellow;
}

</style>
