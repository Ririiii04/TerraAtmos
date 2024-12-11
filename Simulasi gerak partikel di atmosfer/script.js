let particleSystem;
let particleCount = 1000; // Default jumlah partikel
let velocities; // Menyimpan kecepatan partikel

// Inisialisasi scene, camera, dan renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Fungsi untuk membuat partikel
function createParticles(count) {
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    velocities = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 200; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 200; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z

        // Kecepatan awal yang lebih realistis
        velocities[i * 3] = (Math.random() - 0.5) * 0.1; // vx
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.1; // vy
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.1; // vz
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return particles;
}

// Fungsi untuk memperbarui posisi partikel menggunakan metode Euler
function updateParticles(deltaTime) {
    const positions = particleSystem.geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        const index = i * 3;

        // Metode Euler
        positions[index] += velocities[index] * deltaTime; // x
        positions[index + 1] += velocities[index + 1] * deltaTime; // y
        positions[index + 2] += velocities[index + 2] * deltaTime; // z

        // Simulasi gravitasi
        velocities[index + 1] -= 0.01; // Gravitasi ke bawah

        // Batasan untuk partikel agar tetap dalam area tertentu
        if (positions[index] > 100 || positions[index] < -100) velocities[index] *= -1;
        if (positions[index + 1] > 100 || positions[index + 1] < -100) velocities[index + 1] *= -1;
        if (positions[index + 2] > 100 || positions[index + 2] < -100) velocities[index + 2] *= -1;
    }

    particleSystem.geometry.attributes.position.needsUpdate = true;
}

// Fungsi untuk memulai simulasi
function startSimulation() {
    particleCount = parseInt(document.getElementById('particleCount').value);
    const particles = createParticles(particleCount);
    if (particleSystem) {
        scene.remove(particleSystem); // Hapus partikel sebelumnya jika ada
    }
    particleSystem = new THREE.Points(particles, new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 }));
    scene.add(particleSystem);
}

// Posisi kamera
camera.position.z = 100;

// Animasi
function animate() {
    requestAnimationFrame(animate);
    const deltaTime = 0.01; // Waktu antar frame
    updateParticles(deltaTime);
    renderer.render(scene, camera);
}

// Event listener untuk tombol mulai
document.getElementById('startButton').addEventListener('click', startSimulation);

// Memulai animasi
animate();