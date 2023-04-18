<template>
    <div>
        <peer-client></peer-client>
        <div class="grid">
            <button class="button" :class="{ down: b.down }" 
            v-for="(b,i) in buttons" 
            @click.prevent="down(b)"
            ></button>
        </div>
    </div>
</template>
<style scoped>
.grid {
    display: grid;
    gap: 10px;
    margin: 10px;
    width: calc(min(100vh, 100vw) - 40px);
    height: calc(min(100vh, 100vw) - 40px);
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(4, 1fr);
}
.button {
    border: 1px solid black;
    background-color: #eee;
}
.down {
    background-color: #333;
}
</style>
<script setup>
import { ref } from "vue";
import { send } from "../utils/createPeerClient";
import JZZ from "jzz";

const buttons = ref([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(i => ({ note: 48 + i, down: false })))


function down(btn) {
    btn.down = !btn.down
    send([ ...JZZ.MIDI.control(0, btn.note, btn.down ? 127 : 0)])
}
</script>