<template>
    <div class="slider container" @click="setValue($event)" @mousemove="setValue($event)" @touchmove="setValue($event)">
        <div class="value" :style="style">{{ Number(value).toFixed(2) }}</div>
    </div>
</template>
<style scoped>
.container {
    width: 100%;
    height: 100%;
    position: relative;
    user-select: none;
    overflow: hidden;
    background-color: black;
}

.value {
    pointer-events: none;
    width: 100%;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    color: black;
    font-weight: bold;
    line-height: 2em;
    background-color: yellow;
}
</style>
<script setup>
import { computed, defineEmits, ref } from "vue";
const props = defineProps({
    value: {
        type: Number,
        default: 0.0
    },
    min: {
        type: Number,
        default: 0.0
    },
    max: {
        type: Number,
        default: 1.0
    },
    color: {
        type: String,
        default: "yellow"
    }
});
const emit = defineEmits(["update:value"]);

const i = ref(props.value);

const style = computed(() => {
    return {
        height: Math.round((props.value - props.min) / props.max * 100) + '%',
        'background-color': props.color || 'yellow'
    }
});

function setValue(event) {
    if (event instanceof MouseEvent && event.buttons === 0) return;
    const h = event.target.clientHeight;
    const y = event.touches ? (event.touches[0].clientY - event.target.offsetTop) : event.offsetY;
    i.value = Math.max(props.min, Math.min((1 - (y / h) - props.min) * props.max, props.max));
    emit('update:value', i.value);
}
</script>