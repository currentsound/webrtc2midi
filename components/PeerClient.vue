<template>
    <div class="pure-form">
        {{ status }}
        <div class="group" v-if="status !== 'connected'">
            <input v-model="remotePeerId" type="text" />
            <button class="pure-button" @click="connect">Connect</button>
        </div>
    </div>
</template>
<style scoped>
.pure-form {
    background-color: #333;
    color: white;
    padding: 10px;
}
input {
    background-color: #333;
    color: white;
    border: 1px solid black;
    box-shadow: none !important;
    border-radius: 0px !important;
}
input:focus {
    border-color: yellow !important;
}
.pure-button {
    background-color: yellow;
    color: black;
    border-radius: 0px !important;
}
</style>
<script setup>
import { ref } from "vue";
import { createPeerClient, status } from "../utils/createPeerClient";

const emit = defineEmits(['client'])
const remotePeerId = ref(localStorage.PEER_ID || "");

async function connect() {
    await createPeerClient(remotePeerId.value);
}

</script>