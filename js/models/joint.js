// Joint (punto físico)
class Joint {
    constructor(x, y, options = {}) {
        this.x = x;
        this.y = y;
        this.oldX = x;
        this.oldY = y;
        this.velocityX = 0;
        this.velocityY = 0;
        this.accelerationX = 0;
        this.accelerationY = 0;
        this.mass = options.mass || CONFIG.DEFAULT_JOINT.MASS;
        this.fixed = options.fixed || CONFIG.DEFAULT_JOINT.FIXED;
        this.collidesWithGround = false;
        this.radius = options.radius || (this.mass * 5); 
        this.color = options.color || CONFIG.DEFAULT_JOINT.COLOR;
        this.id = options.id || `joint_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    update(dt) {
        if (this.fixed) return;

        // Guardar la posición anterior
        this.oldX = this.x;
        this.oldY = this.y;
        
        // Aplicar aceleración
        this.velocityX += this.accelerationX * dt;
        this.velocityY += this.accelerationY * dt;
        
        // Aplicar gravedad
        this.velocityY += CONFIG.GRAVITY * dt;
        
        // Aplicar fricción
        if (this.collidesWithGround) {
            this.velocityX *= CONFIG.GROUND_FRICTION;
            this.velocityX *= CONFIG.GROUND_DRAG;
        } else {
            this.velocityX *= CONFIG.AIR_FRICTION;
            this.velocityY *= CONFIG.AIR_FRICTION;
        }
        
        // Actualizar posición
        this.x += this.velocityX * dt;
        this.y += this.velocityY * dt;
        
        // Reiniciar aceleración
        this.accelerationX = 0;
        this.accelerationY = 0;
        
        // Detectar colisión con el suelo
        this.collidesWithGround = false;
        if (this.y > groundHeight - this.radius) {
            this.collidesWithGround = true;
            this.y = groundHeight - this.radius;
            this.velocityY = -this.velocityY * CONFIG.ELASTICITY;
        }
        
        // Detectar colisión con los bordes
        if (this.x < this.radius) {
            this.x = this.radius;
            this.velocityX = -this.velocityX * CONFIG.ELASTICITY;
        } else if (this.x > canvas.width - this.radius) {
            this.x = canvas.width - this.radius;
            this.velocityX = -this.velocityX * CONFIG.ELASTICITY;
        }
    }
    
    applyForce(fx, fy) {
        if (this.fixed) return;
        this.accelerationX += fx / this.mass;
        this.accelerationY += fy / this.mass;
    }
    
    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }
    
    isPointInside(px, py) {
        const dx = this.x - px;
        const dy = this.y - py;
        return Math.sqrt(dx * dx + dy * dy) <= this.radius;
    }
}