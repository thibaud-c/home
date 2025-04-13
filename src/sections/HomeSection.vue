<script setup>
import { onMounted, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useSectionData } from '../composables/useSectionData';

// Default profile data
const defaultData = {
  name: "Your Name",
  title: "Your Title",
  colorAccent: "#3498db",
  subtitle: "Your Subtitle",
  description: "Your description goes here.",
  socialLinks: []
};

// Use the composable to load section data
const { data: profileData, loading, error } = useSectionData('home', defaultData);
console.log(profileData.value);
// Three.js variables
let scene, camera, renderer, globe, controls;
let animationFrameId = null;
let feedbackEmojis = []; // Array to store emoji objects
let lastEmojiTime = 0; // Track when the last emoji was created
let handleResize; // Define handleResize at component scope

// Initialize Three.js globe
const initGlobe = () => {
  const container = document.getElementById('globe-container');
  if (!container) {
    console.error('Globe container not found');
    return;
  }
  
  // Scene setup
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.z = 2;
  
  // Add lighting for metallic effect - much more diffuse lighting setup
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9); // Increased for more overall ambient light
  scene.add(ambientLight);
  
  // Use multiple weaker directional lights instead of one strong one
  const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.3); 
  directionalLight1.position.set(5, 3, 5);
  scene.add(directionalLight1);
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight2.position.set(-5, 3, 5);
  scene.add(directionalLight2);
  
  const directionalLight3 = new THREE.DirectionalLight(0xffffff, 0.2);
  directionalLight3.position.set(0, -5, 5);
  scene.add(directionalLight3);
  
  // Add very soft point lights with large distance and high decay
  const pointLight1 = new THREE.PointLight(0xffffff, 0.2);
  pointLight1.position.set(-5, 3, -5);
  pointLight1.distance = 15;
  pointLight1.decay = 2.0;
  scene.add(pointLight1);
  
  const pointLight2 = new THREE.PointLight(0xffffff, 0.15);
  pointLight2.position.set(3, -5, 3);
  pointLight2.distance = 15;
  pointLight2.decay = 2.0;
  scene.add(pointLight2);
  
  // Add a hemisphere light for more natural ambient lighting
  const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.6);
  scene.add(hemisphereLight);
  
  // Create a simple environment map for reflections
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(128);
  const cubeCamera = new THREE.CubeCamera(0.1, 1000, cubeRenderTarget);
  scene.add(cubeCamera);
  
  // Renderer setup
  renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.innerHTML = ''; // Clear container first
  container.appendChild(renderer.domElement);
  
  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.rotateSpeed = 0.5;
  controls.enableZoom = false;
  
  // Create a basic globe immediately to ensure something is visible
  createBasicGlobe();
  
  // Then try to load texture
  const textureLoader = new THREE.TextureLoader();
  
  // Import the texture directly to ensure it's included in the build
  const earthTextureUrl = './src/assets/earth-light.jpg';
  
  console.log(`Attempting to load texture from imported asset: ${earthTextureUrl}`);
  
  // Try to load the texture with the correct path
  textureLoader.load(earthTextureUrl, 
    (texture) => {
      // If texture loads successfully, replace the basic globe
      scene.remove(globe);
      createGlobeWithTexture(texture);
      console.log('Loaded texture successfully');
    },
    (progressEvent) => {
      console.log(`Loading texture progress: ${progressEvent}`);
    },
    (error) => {
      console.error('Failed to load texture:', error);
      // Fallback to relative path
      textureLoader.load('./assets/earth-light.jpg', 
        (texture) => {
          scene.remove(globe);
          createGlobeWithTexture(texture);
          console.log('Loaded texture from fallback path');
        },
        undefined,
        (fallbackError) => {
          console.error('All texture loading attempts failed:', fallbackError);
          // Keep the basic globe as fallback
        }
      );
    }
  );
  
  // Start animation immediately
  animate();
  
  // Function to create globe with texture
  function createGlobeWithTexture(texture) {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      metalness: 0.5,  // Reduced from 0.7 for less concentrated highlights
      roughness: 0.5,  // Increased from 0.3 for more diffuse reflections
      emissive: new THREE.Color(0x2233ff).multiplyScalar(0.1),  // Reduced emissive intensity
      emissiveMap: texture,
      envMapIntensity: 1.0  // Reduced from 1.5 for less intense reflections
    });
    
    globe = new THREE.Mesh(geometry, material);
    
    // Rotate the globe to show more of Europe
    globe.rotation.y = Math.PI; // Start with Europe facing forward
    globe.rotation.x = 0.1; // Tilt slightly to show more of northern Europe
    
    // Remove the call to addAustriaPin()
    
    scene.add(globe);
    console.log('Globe created with texture');
  }
  
  // Function to create feedback emojis
  function createFeedbackEmoji() {
    // Random coordinates on the globe
    const lat = Math.random() * 180 - 90; // -90 to 90
    const lon = Math.random() * 360 - 180; // -180 to 180
    
    // Convert to 3D coordinates on the sphere
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    
    const radius = 1.025; // Just slightly above surface
    const x = -Math.sin(phi) * Math.cos(theta) * radius;
    const y = Math.cos(phi) * radius;
    const z = Math.sin(phi) * Math.sin(theta) * radius;
    
    // Create emoji sprite
    const emojiTypes = ['😀', '👍', '❤️', '🤬', '👏', '💡', '💩', '👎', '🌈'];
    const emojiText = emojiTypes[Math.floor(Math.random() * emojiTypes.length)];
    
    // Create canvas for emoji
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const context = canvas.getContext('2d');
    context.font = '48px Arial';
    context.fillStyle = 'white';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(emojiText, 32, 32);
    
    // Create texture from canvas
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ 
      map: texture,
      transparent: true,
      opacity: 1
    });
    
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(0.1, 0.1, 0.1);
    
    // Calculate the direction from center to surface point
    const direction = new THREE.Vector3(x, y, z).normalize();
    
    // Store animation data
    sprite.userData = {
      creationTime: Date.now(),
      lifespan: 2000 + Math.random() * 2000, // 2-4 seconds
      initialScale: 0.02,
      maxScale: 0.05,
      direction: direction,
      initialPosition: new THREE.Vector3(x, y, z),
      phi: phi,
      theta: theta,
      radius: radius
    };
    
    // Add the sprite to the globe instead of the scene
    // This will make it follow the globe's rotation
    sprite.position.set(x, y, z);
    globe.add(sprite);
    feedbackEmojis.push(sprite);
  }
  
  
  
  // Animation loop with improved positioning
  function animate() {
    animationFrameId = requestAnimationFrame(animate);
    
    if (globe) {
      // Basic rotation - very slow
      globe.rotation.y += 0.001;
      
      // Center the globe in its container
      globe.position.x = 0.5;
      globe.position.y = 0;
      globe.position.z = 0;
      
      // Randomly create new emojis
      const currentTime = Date.now();
      if (currentTime - lastEmojiTime > 100 && Math.random() < 0.5) {
        createFeedbackEmoji();
        lastEmojiTime = currentTime;
      }
      
      // Animate existing emojis
      for (let i = feedbackEmojis.length - 1; i >= 0; i--) {
        const emoji = feedbackEmojis[i];
        const age = currentTime - emoji.userData.creationTime;
        
        if (age > emoji.userData.lifespan) {
          // Remove old emojis
          globe.remove(emoji);
          feedbackEmojis.splice(i, 1);
        } else {
          // Animation phase (0 to 1)
          const phase = age / emoji.userData.lifespan;
          
          // Scale up quickly, then float away and fade out
          let scale, opacity;
          
          if (phase < 0.2) {
            // Pop in
            scale = emoji.userData.initialScale + (emoji.userData.maxScale - emoji.userData.initialScale) * (phase / 0.2);
            opacity = phase / 0.2;
          } else if (phase < 0.8) {
            // Hold
            scale = emoji.userData.maxScale;
            opacity = 1;
          } else {
            // Fade out and float away
            scale = emoji.userData.maxScale;
            opacity = 1 - ((phase - 0.8) / 0.2);
          }
          
          // Apply scale and opacity
          emoji.scale.set(scale, scale, scale);
          emoji.material.opacity = opacity;
          
          // Float outward from the globe surface
          const floatDistance = 0.05 * phase;
          const newRadius = emoji.userData.radius + floatDistance;
          
          // Calculate new position based on original phi/theta but increasing radius
          const phi = emoji.userData.phi;
          const theta = emoji.userData.theta;
          
          const x = -Math.sin(phi) * Math.cos(theta) * newRadius;
          const y = Math.cos(phi) * newRadius;
          const z = Math.sin(phi) * Math.sin(theta) * newRadius;
          
          emoji.position.set(x, y, z);
        }
      }
    }
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  // Function to create basic globe as fallback
  function createBasicGlobe() {
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshStandardMaterial({
      color: new THREE.Color(profileData.value.colorAccent || '#3498db'),
      metalness: 0.9,  // Increased from 0.8 for more metallic appearance
      roughness: 0.1,  // Decreased from 0.2 for more reflective surface
      wireframe: false,
      envMapIntensity: 1.8  // Added environment map intensity
    });
    
    globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    console.log('Basic globe created');
  }
  
  // Removed unused Austria pin function
  
  // Define and attach window resize handler
  handleResize = () => {
    const container = document.getElementById('globe-container');
    if (!container || !camera || !renderer) return;
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
  };
  window.addEventListener('resize', handleResize);
};

onMounted(() => {
  // Initialize globe after a short delay to ensure DOM is ready
  setTimeout(initGlobe, 300);
});


onUnmounted(() => {
  // Clean up Three.js resources
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
  if (renderer) {
    renderer.dispose();
  }
  if (controls) {
    controls.dispose();
  }
  if (handleResize) {
    window.removeEventListener('resize', handleResize);
  }
});
</script>

<template>
  <!-- Remove DarkModeToggle component -->
  
  <div class="home-section">
    <!-- Globe container - positioned for better design -->
    <div id="globe-container" class="absolute top-20 right-0 w-3/5 h-screen z-0"></div>
    
    <!-- Content - more minimalist layout -->
    <div class="relative z-20 w-1/2 py-12 px-8 ml-8 flex flex-col justify-center h-screen pt-20">
      <div v-if="loading" class="loading">Loading...</div>
      <div v-else-if="error" class="error">{{ error }}</div>
      <div v-else class="profile-content">
        <h1 class="text-3xl md:text-4xl font-light mb-3 tracking-wide" :style="{ color: profileData.colorAccent }">
          {{ profileData.name }}
        </h1>
        <h2 class="text-lg md:text-xl font-light mb-4 opacity-80">{{ profileData.position }}</h2>
        <p class="text-base mb-4 opacity-70 font-light">{{ profileData.location }} {{ profileData.flags }}</p>
        
        <!-- Social Links - minimalist design -->
        <div v-if="profileData.socialLinks && profileData.socialLinks.length > 0" class="mt-10">
          <div class="social-links flex flex-wrap gap-4">
            <a v-for="link in profileData.socialLinks" :key="link.platform" 
               :href="link.url" target="_blank" rel="noopener noreferrer"
               class="social-link py-1 transition-all hover:opacity-100"
               :style="{ 
                 color: profileData.colorAccent,
                 opacity: '0.7',
                 borderBottom: '1px solid ' + profileData.colorAccent + '50'
               }">
              {{ link.platform }}
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Removed redundant global styles that are already in style.css -->


<style scoped>
.home-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.profile-content {
  position: relative;
  z-index: 20;
  max-width: 90%;
}

#globe-container {
  pointer-events: none;
  z-index: 0;
}

.social-link {
  font-weight: 300;
  letter-spacing: 0.05em;
  font-size: 0.95rem;
}

@media (max-width: 768px) {
  .home-section > div:nth-child(2) {
    width: 100%;
    margin-left: 0;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
  }
  
  #globe-container {
    opacity: 0.4;
    width: 100%;
  }
}
</style>