// Extracted JS from rising-info-snippets.html
class FloatingSection {
    constructor(element) {
        this.element = element;
        this.isPaused = false;
        this.isAnimating = false;
        this.duration = 20;
        this.delay = 0;
        
        this.init();
    }

    init() {
        const index = parseInt(this.element.id.replace('section', '')) - 1;
        const positions = ['30%', '40%', '50%', '60%', '70%'];
        const delays = [0, 3, 6, 9, 12];
        
        this.element.style.left = positions[index];
        this.element.style.transform = 'translateY(150vh)';
        this.delay = delays[index];
        
        this.assignRandomLayer();
        this.element.addEventListener('click', () => this.togglePause());
        
        setTimeout(() => this.startAnimation(), this.delay * 1000);
    }

    assignRandomLayer() {
        const layers = ['back', 'middle-back', 'middle', 'middle-front', 'front'];
        const randomIndex = Math.floor(Math.random() * layers.length);
        const selectedLayer = layers[randomIndex];
        
        this.element.classList.remove(...layers);
        this.element.classList.add(selectedLayer);
        
        // Proper speed differences for parallax effect
        const speedRanges = {
            'back': Math.random() * 6 + 35,
            'middle-back': Math.random() * 4 + 28,
            'middle': Math.random() * 4 + 22,
            'middle-front': Math.random() * 4 + 16,
            'front': Math.random() * 4 + 12
        };
        
        this.duration = speedRanges[selectedLayer];
    }

    togglePause() {
        this.element.classList.add('clicked');
        setTimeout(() => this.element.classList.remove('clicked'), 200);

        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }

    pause() {
        this.isPaused = true;
        this.element.classList.add('paused');
        this.element.style.animationPlayState = 'paused';
    }

    resume() {
        this.isPaused = false;
        this.element.classList.remove('paused');
        this.element.style.animationPlayState = 'running';
    }

    startAnimation() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.element.style.animation = `floatUp ${this.duration}s linear`;
        
        this.element.addEventListener('animationend', () => {
            if (!this.isPaused) {
                this.isAnimating = false;
                setTimeout(() => this.restartAnimation(), 1000 + Math.random() * 2000);
            }
        }, { once: true });
    }

    restartAnimation() {
        if (this.isPaused) return;
        
        this.assignRandomLayer();
        this.element.style.animation = 'none';
        this.element.offsetHeight;
        this.startAnimation();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    [1,2,3,4,5].forEach(i => new FloatingSection(document.getElementById(`section${i}`)));
});
