fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
    document.getElementById("navbar-container").innerHTML = data;
    });

fetch("footer.html")
    .then(res => res.text())
    .then(data => {
    document.getElementById("footer-container").innerHTML = data;
    });

    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll(".orbit-card");
    const radius = 250; // Adjust how far out cards start
    const centerX = 0;
    const centerY = 0;

    cards.forEach((card, i) => {
        const angle = (i / cards.length) * Math.PI * 2;
        const startX = Math.cos(angle) * radius;
        const startY = Math.sin(angle) * radius;

        gsap.fromTo(card,
        { x: startX, y: startY, opacity: 0, scale: 0.8 },
        {
            x: centerX,
            y: centerY,
            opacity: 1,
            scale: 1,
            duration: 1.2,
            ease: "back.out(1.7)",
            delay: i * 0.1,
            scrollTrigger: {
            trigger: "#who-should-attend",
            start: "top 80%",
            }
        }
        );
    });

document.addEventListener('DOMContentLoaded', () => {
    // NAVBAR LOAD + FADE IN
    fetch("navbar.html")
    .then(res => res.text())
    .then(data => {
        const navbar = document.getElementById("navbar-container");
        navbar.innerHTML = data;
        navbar.classList.add('visible');
    });

    // FOOTER LOAD
    fetch("footer.html")
    .then(res => res.text())
    .then(data => {
        document.getElementById("footer-container").innerHTML = data;
    });

    // FADE-IN-ON-SCROLL
    const faders = document.querySelectorAll('.fade-in-up');
    const appearOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        appearOnScroll.unobserve(entry.target);
        }
    });
    }, { threshold: 0.1 });

    faders.forEach(fader => {
    appearOnScroll.observe(fader);
    });

    // FADE-IN ON LOAD
    document.querySelectorAll('.fade-in-on-load').forEach(el => {
    setTimeout(() => el.classList.add('visible'), 100);
    });

    // FILTERING LOGIC
    const panelSection = document.getElementById('advisory-panel');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const cards = document.querySelectorAll('.panel-card');

    if (panelSection) {
    // Maintain min-height
    panelSection.style.minHeight = panelSection.offsetHeight + 'px';

    // Show all cards by default
    cards.forEach(card => card.classList.add('active'));

    // Filter buttons logic
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
        const filter = button.getAttribute('data-country');

        cards.forEach(card => {
            const cardCountry = card.getAttribute('data-country');
            if (filter === 'all' || cardCountry === filter) {
            card.classList.add('active');
            } else {
            card.classList.remove('active');
            }
        });

        // Update the neuron background
        const palette = flagColors[filter] || flagColors.DEFAULT;
        const nodeCount = getNodeCountForScreen();
        clearCanvas('neuronCanvas-2'); // optional cleanup
        setupNeuronCanvas('neuronCanvas-2', Math.floor(nodeCount * 0.7), palette, 'rgba(220,220,220,0.3)');
        });
    });
    }
    
    // NEURON PAINTING

    // Reusable canvas at the top level
    let activeCanvas = null;

    // Destroy old canvas animation (if needed)
    function clearCanvas(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    }

    function setupNeuronCanvas(canvasId, nodeCount, palette, lineColor = 'rgba(255,255,255,0.1)') {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext('2d');
    let width, height;

    const nodes = [];

    function resizeCanvas() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    for (let i = 0; i < nodeCount; i++) {
        nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        baseRadius: 5 + Math.random() * 1.2,
        pulseSpeed: 0.5 + Math.random() * 0.9,
        color: palette[Math.floor(Math.random() * palette.length)]
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);

        // Connect nodes
        for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 2;
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
            }
        }
        }

        // Draw nodes
        nodes.forEach(node => {
        const pulse = Math.sin(Date.now() * 0.002 * node.pulseSpeed) * 1.5;
        const radius = node.baseRadius + pulse;

        node.x += node.dx;
        node.y += node.dy;

        if (node.x <= 0 || node.x >= width) node.dx *= -1;
        if (node.y <= 0 || node.y >= height) node.dy *= -1;

        ctx.beginPath();
        ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    draw();
    }

    function getNodeCountForScreen() {
    const width = window.innerWidth;

    if (width >= 1200) return 300;         // Large screens
    if (width >= 992) return 200;          // Medium screens
    if (width >= 768) return 120;          // Tablets
    if (width >= 576) return 60;           // Small phones
    return 30;                             // Extra small (iPhone SE, etc)
    }

    // Country-to-color map (same as earlier)
    const flagColors = {
    SINGAPORE: ['rgba(255, 0, 0, 0.4)', 'rgba(200, 200, 200, 0.8)'],
    FRANCE: ['rgba(0, 85, 164, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(239, 65, 53, 0.4)'],
    USA: ['rgba(60, 59, 110, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(178, 34, 52, 0.4)'],
    MALAYSIA: ['rgba(1, 0, 102, 0.4)', 'rgba(255, 204, 0, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(204, 0, 0, 0.4)'],
    ISRAEL: ['rgba(0, 56, 184, 0.4)', 'rgba(200, 200, 200, 0.8)'],
    SPAIN: ['rgba(170, 21, 27, 0.4)', 'rgba(241, 191, 0, 0.4)'],
    FINLAND: ['rgba(0, 47, 108, 0.6)', 'rgba(200, 200, 200, 0.8)'],
    TAIWAN: ['rgba(0, 0, 149, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(255, 0, 0, 0.4)'],
    HONG_KONG: ['rgba(222, 41, 16, 0.4)', 'rgba(200, 200, 200, 0.8)'],
    NEW_ZEALAND: ['rgba(0, 36, 125, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(204, 20, 43, 0.4)'],
    KOREA: ['rgba(0, 52, 120, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(198, 12, 48, 0.4)', 'rgba(0, 0, 0, 0.3)'],
    CHINA: ['rgba(222, 41, 16, 0.4)', 'rgba(255, 222, 0, 0.4)'],
    AUSTRALIA: ['rgba(0, 0, 139, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(255, 0, 0, 0.4)'],
    THAILAND: ['rgba(165, 25, 49, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(45, 42, 74, 0.4)'],
    PHILIPPINES: ['rgba(0, 56, 168, 0.4)', 'rgba(200, 200, 200, 0.8)', 'rgba(255, 0, 0, 0.4)', 'rgba(255, 215, 0, 0.4)'],
    INDONESIA: ['rgba(255, 0, 0, 0.4)', 'rgba(200, 200, 200, 0.8)'],
    DEFAULT: ['rgba(200, 200, 200, 0.8)']
    };

    // Initialize both
    const nodeCount = getNodeCountForScreen();
    setupNeuronCanvas('neuronCanvas', nodeCount, flagColors.DEFAULT, 'rgba(255,255,255,0.1)');
    setupNeuronCanvas('neuronCanvas-2', Math.floor(nodeCount * 0.7), flagColors.DEFAULT, 'rgba(220,220,220,0.3)');


});