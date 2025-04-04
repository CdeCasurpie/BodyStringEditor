// Rule base class (clase base para todas las reglas)
class Rule {
    constructor(options = {}) {
        this.id = options.id || `rule_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    solve() {
        // Método a implementar en subclases
        console.warn("Método solve() no implementado en la regla base");
    }
    
    draw(ctx) {
        // Método a implementar en subclases
        console.warn("Método draw() no implementado en la regla base");
    }
}

// DistanceRule (restricción de distancia mediante resorte)
class DistanceRule extends Rule {
    constructor(jointA, jointB, options = {}) {
        super(options);
        this.jointA = jointA;
        this.jointB = jointB;
        this.length = options.length || CONFIG.DEFAULT_DISTANCE.LENGTH;
        this.stiffness = options.stiffness || CONFIG.DEFAULT_DISTANCE.STIFFNESS;
        this.damping = options.damping || CONFIG.DEFAULT_DISTANCE.DAMPING;
        this.color = options.color || CONFIG.DEFAULT_DISTANCE.COLOR;
        this.lineWidth = options.lineWidth || 2;
        this.drawAsSpring = options.drawAsSpring !== undefined ? options.drawAsSpring : CONFIG.DEFAULT_DISTANCE.DRAW_AS_SPRING;
    }
    
    solve() {
        // Calcular vector entre los puntos
        const dx = this.jointB.x - this.jointA.x;
        const dy = this.jointB.y - this.jointA.y;
        
        // Calcular distancia actual
        const currentDistance = Math.sqrt(dx * dx + dy * dy);
        
        if (currentDistance === 0) return; // Evitar división por cero
        
        // Calcular la velocidad relativa para amortiguación
        const dvx = this.jointB.velocityX - this.jointA.velocityX;
        const dvy = this.jointB.velocityY - this.jointA.velocityY;
        
        // Calcular fuerza utilizando la Ley de Hooke: F = -k(x - x₀)
        const extension = currentDistance - this.length;
        
        // Calcular la dirección normalizada
        const nx = dx / currentDistance;
        const ny = dy / currentDistance;
        
        // Calcular amortiguación basada en la velocidad relativa
        const dotProduct = nx * dvx + ny * dvy;
        const dampingForce = this.damping * dotProduct;
        
        // Fuerza total = fuerza del resorte + amortiguación
        const totalForce = this.stiffness * extension + dampingForce;
        
        // Aplicar fuerzas en direcciones opuestas a los puntos
        const forceX = nx * totalForce;
        const forceY = ny * totalForce;
        
        if (!this.jointA.fixed) {
            this.jointA.applyForce(forceX, forceY);
        }
        
        if (!this.jointB.fixed) {
            this.jointB.applyForce(-forceX, -forceY);
        }
    }
    
    draw(ctx) {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.lineWidth;
        
        if (this.drawAsSpring) {
            // Dibujar como resorte zigzag
            const segments = 10;
            // Amplitud proporcional a la compresión/extensión del resorte
            const extension = Math.abs(this.length - 
                            Math.sqrt((this.jointB.x - this.jointA.x)**2 + 
                            (this.jointB.y - this.jointA.y)**2));
            const amplitude = 5 * Math.min(1, extension / this.length);
            
            ctx.beginPath();
            ctx.moveTo(this.jointA.x, this.jointA.y);
            
            // Vector dirección
            const dx = this.jointB.x - this.jointA.x;
            const dy = this.jointB.y - this.jointA.y;
            const len = Math.sqrt(dx*dx + dy*dy);
            
            if (len === 0) return; // Evitar división por cero
            
            // Vector perpendicular normalizado
            const px = -dy / len;
            const py = dx / len;
            
            // Dibujar zigzag
            for (let i = 1; i <= segments; i++) {
                const t = i / segments;
                const x = this.jointA.x + dx * t;
                const y = this.jointA.y + dy * t;
                
                // Alternar dirección del zigzag
                const offset = (i % 2 === 0 ? 1 : -1) * amplitude;
                
                ctx.lineTo(x + px * offset, y + py * offset);
            }
            
            ctx.lineTo(this.jointB.x, this.jointB.y);
            ctx.stroke();
        } else {
            // Dibujar como línea simple
            ctx.beginPath();
            ctx.moveTo(this.jointA.x, this.jointA.y);
            ctx.lineTo(this.jointB.x, this.jointB.y);
            ctx.stroke();
        }
    }
}