import * as THREE from 'three';

// --- THREE.JS SCENE ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
container.appendChild(renderer.domElement);

// Objects
const geometry = new THREE.IcosahedronGeometry(10, 2);
const material = new THREE.MeshPhongMaterial({
    color: 0x9d4edd,
    wireframe: true,
    emissive: 0x5a189a,
    emissiveIntensity: 0.6
});
const torusKnot = new THREE.Mesh(geometry, material);
// torusKnot.position.x = 15;
scene.add(torusKnot);

// Particles
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 5000;
const posArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 100;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
const particlesMaterial = new THREE.PointsMaterial({
    size: 0.05,
    color: 0xc77dff,
    transparent: true,
    opacity: 0.5
});
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particlesMesh);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xff00c8, 100);
pointLight.position.set(2, 3, 4);
scene.add(pointLight);

camera.position.z = 30;

// Mouse Interaction
let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth - 0.5) * 2;
    mouseY = -(event.clientY / window.innerHeight - 0.5) * 2;
});

// Animation Loop
const animate = () => {
    requestAnimationFrame(animate);

    torusKnot.rotation.x += 0.005;
    torusKnot.rotation.y += 0.005;

    // Smooth camera movement
    camera.position.x += (mouseX * 10 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 10 - camera.position.y) * 0.05;
    camera.lookAt(scene.position);

    particlesMesh.rotation.y += 0.001;

    renderer.render(scene, camera);
};

animate();

// Resizing
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- REVEAL ANIMATIONS ---
const revealElements = document.querySelectorAll('[data-reveal]');

const revealOnScroll = () => {
    revealElements.forEach(el => {
        const elementTop = el.getBoundingClientRect().top;
        const revealPoint = 150;

        if (elementTop < window.innerHeight - revealPoint) {
            el.classList.add('reveal-visible');
        }
    });
};

window.addEventListener('scroll', revealOnScroll);
revealOnScroll(); // Trigger once on load

// --- SPREADSHEET BACKEND INTEGRATION ---
// API URL: https://script.google.com/macros/s/AKfycbxaxTTk9doZprmjq5taNwVsaCeTcZYtfA28LO-lrvPFITaSbP3Mb4f0s8vuKwPW9Rjb_A/exec
const fetchPortfolioData = async () => {
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbxaxTTk9doZprmjq5taNwVsaCeTcZYtfA28LO-lrvPFITaSbP3Mb4f0s8vuKwPW9Rjb_A/exec');
        const data = await response.json();
        console.log("Fetched data from Google Sheets:", data);
        // You would then dynamically update the DOM with the 'data' object
    } catch (err) {
        console.error("Error fetching data:", err);
    }
};

fetchPortfolioData();

// Contact Form Handler
const contactForm = document.getElementById('contactForm');
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxaxTTk9doZprmjq5taNwVsaCeTcZYtfA28LO-lrvPFITaSbP3Mb4f0s8vuKwPW9Rjb_A/exec';

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const submitBtn = contactForm.querySelector('button');
        const originalBtnText = submitBtn.innerText;
        submitBtn.innerText = 'Sending...';
        submitBtn.disabled = true;

        const formData = new FormData(contactForm);
        const params = new URLSearchParams();
        for (const pair of formData) {
            params.append(pair[0], pair[1]);
        }

        try {
            // Note: GAS CORS can be tricky with JSON POST, using URLSearchParams often works better for simple forms
            await fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Crucial for GAS Web Apps if not handling preflight
                body: params
            });

            alert('Thank you, Faheem! Your message has been sent successfully.');
            contactForm.reset();
        } catch (err) {
            console.error('Form submission error:', err);
            alert('There was an error sending your message. Please try again or use the WhatsApp link.');
        } finally {
            submitBtn.innerText = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

// Mobile Menu Toggle
const mobileMenuBtn = document.getElementById('mobile-menu');
const navLinks = document.querySelector('.nav-links');

if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');

        // Animate Links
        const links = document.querySelectorAll('.nav-links li');
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Hamburger Animation
        mobileMenuBtn.classList.toggle('toggle');
    });
}
