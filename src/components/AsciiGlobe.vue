<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import earth from "../assets/earth-light.jpg";
import { surfaceAt } from "../globe.js";

const canvas = ref(null);
const paused = ref(false);
let rotation = -0.18,
  frame,
  observer,
  motion,
  image,
  context,
  pixels,
  visible = true,
  previous = 0,
  dragX = null;
const size = 640,
  radius = 254,
  textureWidth = 720,
  textureHeight = 360;

function draw() {
  if (!context) return;
  context.clearRect(0, 0, size, size);
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "9px monospace";
  for (let y = -radius; y <= radius; y += 7) {
    for (let x = -radius; x <= radius; x += 6) {
      const point = surfaceAt(x / radius, y / radius, rotation);
      if (!point) continue;
      let land = false;
      if (pixels) {
        const u = Math.min(
          textureWidth - 1,
          Math.floor(point.u * textureWidth),
        );
        const v = Math.min(
          textureHeight - 1,
          Math.floor(point.v * textureHeight),
        );
        const i = (v * textureWidth + u) * 4;
        land = pixels[i] > pixels[i + 2] * 0.65;
      }
      const grid =
        Math.abs(Math.sin(point.longitude * 12)) < 0.055 ||
        Math.abs(Math.sin(point.latitude * 12)) < 0.055;
      if (!land && !grid && (Math.round(x / 6) + Math.round(y / 7)) % 3 !== 0)
        continue;
      context.fillStyle = land
        ? `rgba(96,245,221,${0.3 + point.depth * 0.65})`
        : `rgba(83,166,164,${grid ? 0.38 : 0.15})`;
      context.fillText(
        land ? (point.depth > 0.7 ? "+" : ":") : ".",
        size / 2 + x,
        size / 2 + y,
      );
    }
  }
  context.strokeStyle = "rgba(99,223,207,0.20)";
  context.lineWidth = 1;
  context.beginPath();
  context.arc(320, 320, radius + 5, 0, Math.PI * 2);
  context.stroke();
  // Graz is a geographic reference, not a live participation feed.
  const lat = (47.07 * Math.PI) / 180,
    lon = (15.44 * Math.PI) / 180 + rotation;
  const depth = Math.cos(lat) * Math.cos(lon);
  if (depth > 0) {
    const x = 320 + radius * Math.cos(lat) * Math.sin(lon),
      y = 320 - radius * Math.sin(lat);
    context.fillStyle = "#ff65b5";
    context.beginPath();
    context.arc(x, y, 4, 0, Math.PI * 2);
    context.fill();
    context.strokeStyle = "#ff65b5";
    context.beginPath();
    context.arc(x, y, 10, 0, Math.PI * 2);
    context.stroke();
    context.font = "11px monospace";
    context.textAlign = "left";
    context.fillText("GRAZ, AT", x + 18, y);
  }
}
function animate(time) {
  if (time - previous > 80) {
    if (!paused.value && visible && !document.hidden && dragX === null) {
      rotation += 0.003;
      draw();
    }
    previous = time;
  }
  frame = requestAnimationFrame(animate);
}
function turn(amount) {
  rotation += amount;
  draw();
}
function drag(event) {
  if (dragX === null) return;
  turn((event.clientX - dragX) * 0.008);
  dragX = event.clientX;
}
function startDrag(event) {
  dragX = event.clientX;
  event.target.setPointerCapture(event.pointerId);
}
function stopDrag() {
  dragX = null;
}
function motionChanged() {
  paused.value = motion.matches;
}
onMounted(() => {
  context = canvas.value.getContext("2d");
  motion = window.matchMedia("(prefers-reduced-motion: reduce)");
  motionChanged();
  motion.addEventListener("change", motionChanged);
  draw();
  image = new Image();
  image.onload = () => {
    const texture = document.createElement("canvas");
    texture.width = textureWidth;
    texture.height = textureHeight;
    const ctx = texture.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(image, 0, 0, textureWidth, textureHeight);
    pixels = ctx.getImageData(0, 0, textureWidth, textureHeight).data;
    draw();
  };
  image.src = earth;
  observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
  });
  observer.observe(canvas.value);
  frame = requestAnimationFrame(animate);
});
onUnmounted(() => {
  cancelAnimationFrame(frame);
  observer?.disconnect();
  motion?.removeEventListener("change", motionChanged);
  if (image) image.onload = null;
});
</script>

<template>
  <figure class="globe-figure">
    <div class="globe-label">
      <span class="crosshair">+</span> 
    </div>
    <div class="globe-stage">
      <div class="orbit orbit-one" aria-hidden="true"></div>
      <div class="orbit orbit-two" aria-hidden="true"></div>
      <canvas
        ref="canvas"
        :width="size"
        :height="size"
        role="img"
        aria-label="Rotating ASCII Earth with Graz marked in pink. Use the controls below to rotate or pause."
        @pointerdown="startDrag"
        @pointermove="drag"
        @pointerup="stopDrag"
        @pointercancel="stopDrag"
        @lostpointercapture="stopDrag"
      ></canvas>
      <span class="globe-coordinate">47.07° N<br />15.44° E</span>
    </div>
    <figcaption>
      <span>ONE PLANET. MANY PERSPECTIVES.</span>
      <div class="globe-controls">
        <button aria-label="Rotate globe left" @click="turn(-0.25)">←</button
        ><button :aria-pressed="paused" @click="paused = !paused">
          {{ paused ? "Play" : "Pause" }}</button
        ><button aria-label="Rotate globe right" @click="turn(0.25)">→</button>
      </div>
    </figcaption>
  </figure>
</template>
