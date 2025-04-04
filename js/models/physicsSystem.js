class PhysicsSystem {
    constructor() {
        this.joints = [];
        this.rules = [];
        this.selectedJoint = null;
        this.isDragging = false;
        this.lastTime = 0;
        this.FPS = CONFIG.FPS;
        this.frameInterval = 1000 / this.FPS;
        this.lastMouseX = 0;
        this.lastMouseY = 0;
        
        // Configurar eventos de interacción
        this.setupInteraction();
    }
    
    addJoint(joint) {
        this.joints.push(joint);
        return joint;
    }
    
    addRule(rule) {
        this.rules.push(rule);
        return rule;
    }
    
    removeJoint(jointToRemove) {
        // Eliminar reglas que contienen este joint
        this.rules = this.rules.filter(rule => {
            if (rule instanceof DistanceRule) {
                return rule.jointA !== jointToRemove && rule.jointB !== jointToRemove;
            }
            return true;
        });
        
        // Eliminar el joint
        this.joints = this.joints.filter(joint => joint !== jointToRemove);
    }
    
    removeRule(ruleToRemove) {
        this.rules = this.rules.filter(rule => rule !== ruleToRemove);
    }
    
    update(dt) {
        // Actualizar todos los joints
        for (const joint of this.joints) {
            joint.update(dt);
        }
        
        // Aplicar todas las reglas
        const iterations = 10; // Más iteraciones = más estabilidad
        for (let i = 0; i < iterations; i++) {
            for (const rule of this.rules) {
                rule.solve();
            }
        }
    }
    
    draw(ctx) {
        // Limpiar canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar fondo
        ctx.fillStyle = '#222';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Dibujar suelo
        ctx.fillStyle = '#444';
        ctx.fillRect(0, groundHeight, canvas.width, canvas.height - groundHeight);
        
        // Línea de suelo
        ctx.strokeStyle = '#777';
        ctx.setLineDash([5, 10]);
        ctx.beginPath();
        ctx.moveTo(0, groundHeight);
        ctx.lineTo(canvas.width, groundHeight);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Dibujar reglas
        for (const rule of this.rules) {
            rule.draw(ctx);
        }
        
        // Dibujar joints
        for (const joint of this.joints) {
            joint.draw(ctx);
        }
        
        // Dibujar elementos adicionales para el editor
        
        // Destacar elemento seleccionado
        if (selectedJoint) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(selectedJoint.x, selectedJoint.y, selectedJoint.radius + 5, 0, Math.PI * 2);
            ctx.stroke();
        }
        
        if (selectedRule && selectedRule instanceof DistanceRule) {
            ctx.strokeStyle = '#00ff00';
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.moveTo(selectedRule.jointA.x, selectedRule.jointA.y);
            ctx.lineTo(selectedRule.jointB.x, selectedRule.jointB.y);
            ctx.stroke();
        }
        
        // Dibujar línea al crear una regla de distancia
        if (currentTool === 'distance' && connectingJoint) {
            ctx.strokeStyle = '#ffff00';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.moveTo(connectingJoint.x, connectingJoint.y);
            ctx.lineTo(this.lastMouseX || connectingJoint.x, this.lastMouseY || connectingJoint.y);
            ctx.stroke();
            ctx.setLineDash([]);
        }
    }
    
    setupInteraction() {
        // Eventos del mouse
        canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.handleMouseUp.bind(this));
        
        // Eventos táctiles
        canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }
    
    handleMouseDown(e) {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        // Verificar si hizo clic en algún joint
        for (const joint of this.joints) {
            if (joint.isPointInside(mouseX, mouseY)) {
                this.selectedJoint = joint;
                this.isDragging = true;
                break;
            }
        }
    }
    
    handleMouseMove(e) {
        // Actualizar la posición del mouse para dibujo
        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        
        if (this.isDragging && this.selectedJoint) {
            this.selectedJoint.x = e.clientX;
            this.selectedJoint.y = e.clientY;
            
            // Reiniciar velocidad
            this.selectedJoint.velocityX = 0;
            this.selectedJoint.velocityY = 0;
        }
    }
    
    handleMouseUp() {
        this.isDragging = false;
        this.selectedJoint = null;
    }
    
    handleTouchStart(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const touchX = touch.clientX;
        const touchY = touch.clientY;
        
        for (const joint of this.joints) {
            if (joint.isPointInside(touchX, touchY)) {
                this.selectedJoint = joint;
                this.isDragging = true;
                break;
            }
        }
    }
    
    handleTouchMove(e) {
        e.preventDefault();
        if (this.isDragging && this.selectedJoint) {
            const touch = e.touches[0];
            this.selectedJoint.x = touch.clientX;
            this.selectedJoint.y = touch.clientY;
            
            this.selectedJoint.velocityX = 0;
            this.selectedJoint.velocityY = 0;
        }
    }
    
    handleTouchEnd(e) {
        e.preventDefault();
        this.isDragging = false;
        this.selectedJoint = null;
    }
    
    start() {
        const gameLoop = (currentTime) => {
            // Calcular delta time (limitar para estabilidad)
            const dt = Math.min(0.1, (currentTime - this.lastTime) / this.frameInterval);
            this.lastTime = currentTime;
            
            // Actualizar física
            this.update(dt);
            
            // Dibujar
            this.draw(ctx);
            
            // Continuar el bucle
            requestAnimationFrame(gameLoop);
        };
        
        // Iniciar el bucle
        requestAnimationFrame(gameLoop);
    }
}