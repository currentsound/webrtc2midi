<template>
    <div>
        <peer-client></peer-client>
        <div class="grid">
            <slider class="slider" v-for="i in [0,1,2,3,4,5,6,7]" :value="val[i]" @update:value="setValue(i, $event)"></slider>
        </div>
    </div>
</template>
<style>
body {
    background: #333;
}
.slider {
    min-height: 200px;
    min-width: 50px;
}
.grid {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 20px;
}
</style>
<script setup>
import { ref } from "vue";
import { send } from "../utils/createPeerClient";

const val = ref([0,0,0,0,0,0,0,0]);

function setValue(i, value) {
    val.value[i] = value;
    send([176, 48 + i, Math.round(value * 127)])
}

</script>