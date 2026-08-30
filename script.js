const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");
const navbar = document.querySelector(".navbar");
const revealItems = document.querySelectorAll(".section, .event-card, .feature, .venue-card, .menu-item, .gallery-grid img");

if (menuToggle && navLinks) {
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    menuToggle.setAttribute("aria-expanded", "false");

    menuToggle.addEventListener("click", () => {
        navLinks.classList.toggle("active");
        menuToggle.setAttribute(
            "aria-expanded",
            navLinks.classList.contains("active") ? "true" : "false"
        );
    });

    document.querySelectorAll(".nav-links a").forEach(link => {
        link.addEventListener("click", () => {
            navLinks.classList.remove("active");
            menuToggle.setAttribute("aria-expanded", "false");
        });
    });
}

if (revealItems.length && "IntersectionObserver" in window) {
    revealItems.forEach(item => item.classList.add("reveal"));

    const revealObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    revealItems.forEach(item => revealObserver.observe(item));
} else {
    revealItems.forEach(item => item.classList.add("visible"));
}

if (navbar) {
    window.addEventListener("scroll", () => {
        navbar.style.boxShadow = window.scrollY > 50
            ? "0 10px 30px rgba(67, 39, 32, 0.12)"
            : "none";
    });
}

document.querySelectorAll(".booking-form").forEach(form => {
    form.addEventListener("submit", event => {
        event.preventDefault();
        alert("Thank you! Your booking request has been received.");
        form.reset();
    });
});

function initHeritageScene() {
    const canvas = document.querySelector("#heritage-scene");

    if (!canvas || !window.THREE) {
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, window.innerWidth / window.innerHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const group = new THREE.Group();

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.set(0, 0.7, 8);

    const brass = new THREE.MeshStandardMaterial({
        color: 0xd7a13b,
        metalness: 0.72,
        roughness: 0.26
    });
    const burgundy = new THREE.MeshStandardMaterial({
        color: 0x7b2d3d,
        metalness: 0.18,
        roughness: 0.42
    });
    const wood = new THREE.MeshStandardMaterial({
        color: 0x6d412a,
        metalness: 0.08,
        roughness: 0.55
    });
    const glass = new THREE.MeshPhysicalMaterial({
        color: 0xfff2c7,
        transparent: true,
        opacity: 0.36,
        metalness: 0.02,
        roughness: 0.08,
        transmission: 0.35
    });

    const sign = new THREE.Mesh(new THREE.BoxGeometry(3.7, 1.6, 0.22), wood);
    const trimTop = new THREE.Mesh(new THREE.BoxGeometry(4.1, 0.14, 0.3), brass);
    const trimBottom = trimTop.clone();
    const crest = new THREE.Mesh(new THREE.TorusGeometry(0.56, 0.055, 16, 72), brass);
    const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.28, 0.72, 36), glass);
    const handle = new THREE.Mesh(new THREE.TorusGeometry(0.23, 0.035, 12, 36), brass);
    const leftChain = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 12), brass);
    const rightChain = leftChain.clone();
    const topBar = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 4.4, 16), brass);

    trimTop.position.y = 0.86;
    trimBottom.position.y = -0.86;
    crest.position.set(0, 0.08, 0.18);
    mug.position.set(0, -0.03, 0.23);
    handle.position.set(0.34, -0.02, 0.23);
    handle.rotation.y = Math.PI / 2;
    handle.scale.set(0.8, 1.08, 1);
    leftChain.position.set(-1.55, 1.58, 0);
    rightChain.position.set(1.55, 1.58, 0);
    topBar.position.set(0, 2.25, 0);
    topBar.rotation.z = Math.PI / 2;

    group.add(sign, trimTop, trimBottom, crest, mug, handle, leftChain, rightChain, topBar);

    for (let i = 0; i < 18; i += 1) {
        const spark = new THREE.Mesh(new THREE.SphereGeometry(0.025 + Math.random() * 0.035, 12, 12), brass);
        spark.position.set((Math.random() - 0.5) * 8, (Math.random() - 0.2) * 4, (Math.random() - 0.5) * 2);
        spark.userData.speed = 0.004 + Math.random() * 0.01;
        group.add(spark);
    }

    group.position.set(window.innerWidth > 760 ? 2.45 : 0, window.innerWidth > 760 ? -0.08 : 0.45, 0);
    group.rotation.y = -0.28;
    scene.add(group);

    scene.add(new THREE.AmbientLight(0xfff0d8, 0.88));
    const keyLight = new THREE.PointLight(0xffd389, 1.6, 14);
    keyLight.position.set(3, 3.5, 4);
    scene.add(keyLight);

    const resize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        group.position.x = window.innerWidth > 760 ? 2.45 : 0;
        group.position.y = window.innerWidth > 760 ? -0.08 : 0.45;
        group.scale.setScalar(window.innerWidth > 760 ? 1 : 0.72);
    };

    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
        requestAnimationFrame(animate);
        const time = performance.now() * 0.001;
        group.rotation.y = -0.28 + Math.sin(time * 0.8) * 0.18;
        group.rotation.x = Math.sin(time * 0.65) * 0.05;
        sign.position.y = Math.sin(time * 1.2) * 0.035;

        group.children.forEach(child => {
            if (child.userData.speed) {
                child.position.y += child.userData.speed;
                child.rotation.y += 0.01;
                if (child.position.y > 3.2) {
                    child.position.y = -2.2;
                }
            }
        });

        renderer.render(scene, camera);
    };

    animate();
}

window.addEventListener("load", initHeritageScene);
