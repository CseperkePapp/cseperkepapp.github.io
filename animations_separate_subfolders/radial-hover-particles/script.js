const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
resizeCanvas();

// --- Configuration ---
const PARTICLE_COUNT = 800;
const MOUSE_INTERACTION_RADIUS = 150;
const COLORS = ['#FFD700', '#FFA500', '#ADD8E6', '#FFFFFF', '#F0E68C', '#DAA520'];

let particlesArray = [];
const mouse = { x: null, y: null };

window.addEventListener('mousemove', (event) => { mouse.x = event.x; mouse.y = event.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });
window.addEventListener('resize', () => { resizeCanvas(); init(); });

class Particle {
    constructor(x, y, directionX, directionY, size, color) {
        this.x = x; this.y = y; this.directionX = directionX; this.directionY = directionY; this.size = size; this.color = color;
        this.baseX = this.x; this.speed = Math.random() * 0.5 + 0.1; this.waveFactor = Math.random() * 2 + 1;
    }

    draw() {
        ctx.beginPath(); ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.shadowBlur = 10; ctx.shadowColor = this.color; ctx.fillStyle = this.color; ctx.fill(); ctx.closePath();
    }

    update() {
        ctx.shadowBlur = 0;
        if (this.x > canvas.width + this.size) this.x = -this.size;
        if (this.x < -this.size) this.x = canvas.width + this.size;
        if (this.y > canvas.height + this.size) this.y = -this.size;
        if (this.y < -this.size) this.y = canvas.height + this.size;

        if (mouse.x !== null && mouse.y !== null) {
            let dx = mouse.x - this.x; let dy = mouse.y - this.y; let distance = Math.sqrt(dx*dx + dy*dy);
            if (distance < MOUSE_INTERACTION_RADIUS) { this.x -= dx/10; this.y -= dy/10; } else { this.moveParticle(); }
        } else { this.moveParticle(); }

        this.draw();
    }

    moveParticle() { this.x += this.directionX * this.speed; this.y += (this.directionY + Math.sin(this.x * 0.01) * this.waveFactor) * this.speed; }
}

function init() { particlesArray = []; for (let i=0;i<PARTICLE_COUNT;i++){ let size = Math.random()*2 + 0.5; let x = Math.random()*canvas.width; let y = Math.random()*canvas.height; let directionX = (Math.random()-0.5)*1.5; let directionY = (Math.random()-0.5)*1.5; let color = COLORS[Math.floor(Math.random()*COLORS.length)]; particlesArray.push(new Particle(x,y,directionX,directionY,size,color)); }}

function animate() { ctx.fillStyle = 'rgba(0, 2, 26, 0.1)'; ctx.fillRect(0,0,canvas.width,canvas.height); for (let i=0;i<particlesArray.length;i++){ particlesArray[i].update(); } requestAnimationFrame(animate); }

init(); animate();