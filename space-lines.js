const canvas = document.getElementById("space-lines");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

const mouse = { x: null, y: null };
window.addEventListener("mousemove", e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class LineParticle {
    constructor() {
        this.reset();
        this.connections = [];
    }

    reset() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;

        this.length = 30 + Math.random() * 70;

        this.speed = 0.1 + Math.random() * 0.3;
        this.vy = this.speed;
        this.vx = (Math.random() - 0.5) * 0.2;

        this.angle = Math.random() * Math.PI * 2;
        this.rotationSpeed = (Math.random() - 0.5) * 0.002;

        this.floatOffset = Math.random() * 1000;

        this.connections = [];
    }

    getEndpoints() {
        const x1 = this.x;
        const y1 = this.y;

        const x2 = this.x - Math.sin(this.angle) * this.length;
        const y2 = this.y - Math.cos(this.angle) * this.length;

        return [
            { x: x1, y: y1 },
            { x: x2, y: y2 }
        ];
    }

    update() {
        this.vy += 0.0005;

        this.x += Math.sin((Date.now() + this.floatOffset) * 0.001) * 0.2;

        this.angle += this.rotationSpeed;

        this.x += this.vx;
        this.y += this.vy;

        if (mouse.x !== null) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 180) {
                const force = (180 - dist) / 180;
                this.x += dx * force * 0.15;
                this.y += dy * force * 0.15;

                this.connections = [];
            }
        }

        if (this.y - this.length > h) {
            this.reset();
            this.y = -this.length;
        }
    }

    draw() {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.strokeStyle = "rgba(255,255,255,0.8)";
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -this.length);
        ctx.stroke();

        ctx.fillStyle = "white";
        ctx.beginPath();
        ctx.arc(0, 0, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(0, -this.length, 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

const particles = [];
for (let i = 0; i < 140; i++) particles.push(new LineParticle());

function detectConnections() {
    const threshold = 25;

    particles.forEach(p => p.connections = []);

    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        const e1 = p1.getEndpoints();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const e2 = p2.getEndpoints();

            for (let a of e1) {
                for (let b of e2) {
                    const dx = a.x - b.x;
                    const dy = a.y - b.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < threshold) {
                        p1.connections.push({ x: b.x, y: b.y });
                        p2.connections.push({ x: a.x, y: a.y });
                    }
                }
            }
        }
    }
}

function drawConnections() {
    ctx.strokeStyle = "rgba(255,255,255,0.4)";
    ctx.lineWidth = 1;

    particles.forEach(p => {
        const e = p.getEndpoints();

        p.connections.forEach(c => {
            ctx.beginPath();
            ctx.moveTo(e[0].x, e[0].y);
            ctx.lineTo(c.x, c.y);
            ctx.stroke();
        });
    });
}

function animate() {
    ctx.clearRect(0, 0, w, h);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    detectConnections();
    drawConnections();

    requestAnimationFrame(animate);
}
animate();
