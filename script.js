// Three.js Setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
const renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById('canvas'),
    antialias: true,
    alpha: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x050812, 0.1);

camera.position.z = 100;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight1 = new THREE.PointLight(0x00ffff, 2);
pointLight1.position.set(100, 100, 100);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00ff88, 1.5);
pointLight2.position.set(-100, -100, 50);
scene.add(pointLight2);

// Create rotating cubes
const cubes = [];
const colors = [0x00ffff, 0x00ff88, 0xff00ff, 0xffff00, 0xff0088];

for (let i = 0; i < 5; i++) {
    const geometry = new THREE.BoxGeometry(15, 15, 15);
    const material = new THREE.MeshPhongMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.5,
        shininess: 100
    });
    const cube = new THREE.Mesh(geometry, material);
    
    const angle = (i / 5) * Math.PI * 2;
    cube.position.x = Math.cos(angle) * 60;
    cube.position.y = Math.sin(angle) * 60;
    
    cube.userData = {
        angle: angle,
        distance: 60,
        rotationSpeed: 0.01 + Math.random() * 0.01,
        orbitSpeed: 0.001 + Math.random() * 0.001
    };
    
    scene.add(cube);
    cubes.push(cube);
}

// Particle System
const particleGeometry = new THREE.BufferGeometry();
const particleCount = 2000;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 400;
    positions[i + 1] = (Math.random() - 0.5) * 400;
    positions[i + 2] = (Math.random() - 0.5) * 400;
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
    color: 0x00ffff,
    size: 1,
    transparent: true,
    opacity: 0.6
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// Mouse tracking
const mouse = new THREE.Vector2();
window.addEventListener('mousemove', (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Navigation
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const sectionId = link.getAttribute('data-section');
        showSection(sectionId);
    });
});

function showSection(sectionId) {
    sections.forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
}

// Helper function to scroll to section
window.scrollToSection = function(sectionId) {
    showSection(sectionId);
};

// Show home section by default
showSection('home');

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Update cubes
    cubes.forEach((cube, index) => {
        // Rotation
        cube.rotation.x += cube.userData.rotationSpeed;
        cube.rotation.y += cube.userData.rotationSpeed;
        
        // Orbital motion
        cube.userData.angle += cube.userData.orbitSpeed;
        cube.position.x = Math.cos(cube.userData.angle) * cube.userData.distance;
        cube.position.y = Math.sin(cube.userData.angle) * cube.userData.distance;
        
        // Add some vertical oscillation
        cube.position.z = Math.sin(cube.userData.angle * 0.5) * 30;
    });
    
    // Rotate particles
    particles.rotation.x += 0.0002;
    particles.rotation.y += 0.0003;
    
    // Camera movement based on mouse
    camera.position.x += (mouse.x * 50 - camera.position.x) * 0.05;
    camera.position.y += (mouse.y * 50 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);
    
    renderer.render(scene, camera);
}

animate();

// Smooth scroll behavior for better UX
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
        const activeSection = document.querySelector('.section.active');
        const nextSection = activeSection.nextElementSibling;
        if (nextSection && nextSection.classList.contains('section')) {
            showSection(nextSection.id);
        }
    } else if (e.key === 'ArrowLeft') {
        const activeSection = document.querySelector('.section.active');
        const prevSection = activeSection.previousElementSibling;
        if (prevSection && prevSection.classList.contains('section')) {
            showSection(prevSection.id);
        }
    }
});

console.log('🌌 3D Portfolio loaded! Use arrow keys or click navigation to explore.');
