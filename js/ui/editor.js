// Funciones del editor de sistema articulado

// Establecer la herramienta actual
function setTool(tool) {
    // Desactivar todos los botones de herramientas
    document.querySelectorAll('.tool-button').forEach(button => {
        button.classList.remove('active');
    });
    
    // Activar el botón de la herramienta seleccionada
    document.getElementById(tool + 'Tool').classList.add('active');
    
    currentTool = tool;
    selectedJoint = null;
    selectedRule = null;
    connectingJoint = null;
    
    document.getElementById('status').textContent = 'Herramienta: ' + capitalizeFirstLetter(tool);
    
    updatePropertiesPanel();
}

// Borrar todo el sistema
function clearSystem() {
    if (confirm('¿Estás seguro de que quieres borrar todo el sistema?')) {
        // Crear un nuevo sistema físico
        physicsSystem.joints = [];
        physicsSystem.rules = [];
        selectedJoint = null;
        selectedRule = null;
        connectingJoint = null;
        createdJoints = {}; // Limpiar las referencias de joints
        updatePropertiesPanel();
    }
}

// Event listeners para interacciones del canvas
function setupEditorEvents() {
    canvas.addEventListener('mousedown', (e) => {
        const mouseX = e.clientX;
        const mouseY = e.clientY;
        
        if (currentTool === 'select') {
            // Primero intentar seleccionar un joint
            selectedJoint = null;
            selectedRule = null;
            
            for (const joint of physicsSystem.joints) {
                if (joint.isPointInside(mouseX, mouseY)) {
                    selectedJoint = joint;
                    break;
                }
            }
            
            // Si no se seleccionó un joint, intentar seleccionar una regla
            if (!selectedJoint) {
                for (const rule of physicsSystem.rules) {
                    if (rule instanceof DistanceRule) {
                        // Calcular distancia del punto a la línea (regla)
                        const dist = distanceToLine(
                            mouseX, mouseY,
                            rule.jointA.x, rule.jointA.y,
                            rule.jointB.x, rule.jointB.y
                        );
                        
                        if (dist < 10) { // Tolerancia para seleccionar
                            selectedRule = rule;
                            break;
                        }
                    }
                }
            }
            
            updatePropertiesPanel();
        }
        else if (currentTool === 'joint' || currentTool === 'anchor') {
            // Crear un nuevo joint
            const isFixed = currentTool === 'anchor';
            const newJoint = new Joint(mouseX, mouseY, {
                fixed: isFixed,
                color: isFixed ? '#ff0000' : '#ffffff',
                id: generateJointId()
            });
            
            physicsSystem.addJoint(newJoint);
            selectedJoint = newJoint;
            updatePropertiesPanel();
        }
        else if (currentTool === 'distance') {
            // Crear una regla de distancia
            if (connectingJoint === null) {
                // Seleccionar el primer joint
                for (const joint of physicsSystem.joints) {
                    if (joint.isPointInside(mouseX, mouseY)) {
                        connectingJoint = joint;
                        break;
                    }
                }
            }
            else {
                // Seleccionar el segundo joint y crear la regla
                for (const joint of physicsSystem.joints) {
                    if (joint !== connectingJoint && joint.isPointInside(mouseX, mouseY)) {
                        // Calcular longitud inicial
                        const dx = joint.x - connectingJoint.x;
                        const dy = joint.y - connectingJoint.y;
                        const length = Math.sqrt(dx * dx + dy * dy);
                        
                        // Crear la regla
                        const newRule = new DistanceRule(connectingJoint, joint, {
                            length: length,
                            id: generateRuleId()
                        });
                        
                        physicsSystem.addRule(newRule);
                        selectedRule = newRule;
                        connectingJoint = null;
                        updatePropertiesPanel();
                        break;
                    }
                }
            }
        }
        else if (currentTool === 'delete') {
            // Eliminar elementos
            let itemDeleted = false;
            
            // Intentar eliminar un joint
            for (let i = 0; i < physicsSystem.joints.length; i++) {
                if (physicsSystem.joints[i].isPointInside(mouseX, mouseY)) {
                    physicsSystem.removeJoint(physicsSystem.joints[i]);
                    itemDeleted = true;
                    break;
                }
            }
            
            // Si no se eliminó un joint, intentar eliminar una regla
            if (!itemDeleted) {
                for (let i = 0; i < physicsSystem.rules.length; i++) {
                    const rule = physicsSystem.rules[i];
                    
                    if (rule instanceof DistanceRule) {
                        // Calcular distancia del punto a la línea (regla)
                        const dist = distanceToLine(
                            mouseX, mouseY,
                            rule.jointA.x, rule.jointA.y,
                            rule.jointB.x, rule.jointB.y
                        );
                        
                        if (dist < 10) { // Tolerancia para seleccionar
                            physicsSystem.removeRule(rule);
                            itemDeleted = true;
                            break;
                        }
                    }
                }
            }
            
            // Actualizar selección
            selectedJoint = null;
            selectedRule = null;
            updatePropertiesPanel();
        }
        
        // Manejar arrastre si hay selección
        if (selectedJoint && currentTool === 'select') {
            physicsSystem.selectedJoint = selectedJoint;
            physicsSystem.isDragging = true;
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        // La captura de posición del ratón se maneja en PhysicsSystem
    });
    
    canvas.addEventListener('mouseup', () => {
        physicsSystem.isDragging = false;
        physicsSystem.selectedJoint = null;
    });
}