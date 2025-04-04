// Clase Biped - Simple sistema bípedo controlable
class Biped {
    constructor(physicsSystem, x, y) {
        this.physicsSystem = physicsSystem;
        
        // Crear estructura de joints
        this.joints = {
            body: physicsSystem.addJoint(new Joint(x, y, {
                mass: 100,
                fixed: false,
                color: '#ff0000',
                radius: 8,
                id: 'body'
            })),
            
            leftHip: physicsSystem.addJoint(new Joint(x - 30, y + 126, {
                mass: 5,
                fixed: false,
                color: '#ffffff',
                radius: 5,
                id: 'leftHip'
            })),
            
            leftKnee: physicsSystem.addJoint(new Joint(x - 90, y + 136, {
                mass: 10,
                fixed: false,
                color: '#ffffff',
                radius: 5,
                id: 'leftKnee'
            })),
            
            leftFoot: physicsSystem.addJoint(new Joint(x - 70, y + 180, {
                mass: 20,
                fixed: false,
                color: '#ffffff',
                radius: 20,
                id: 'leftFoot'
            })),
            
            rightHip: physicsSystem.addJoint(new Joint(x + 90, y + 126, {
                mass: 5,
                fixed: false,
                color: '#ffffff',
                radius: 5,
                id: 'rightHip'
            })),
            
            rightKnee: physicsSystem.addJoint(new Joint(x + 0, y + 136, {
                mass: 10,
                fixed: false,
                color: '#ffffff',
                radius: 5,
                id: 'rightKnee'
            })),
            
            rightFoot: physicsSystem.addJoint(new Joint(x + 70, y + 180, {
                mass: 20,
                fixed: false,
                color: '#ffffff',
                radius: 20,
                id: 'rightFoot'
            }))
        };
        
        // Crear estructura de reglas (resortes)
        this.rules = {
            // Pierna izquierda
            leftThigh: physicsSystem.addRule(new DistanceRule(
                this.joints.body, this.joints.leftHip, {
                    length: 130,
                    stiffness: 10,
                    damping: 0.8,
                    color: '#ffffff',
                    drawAsSpring: false,
                    id: 'leftThigh'
                }
            )),
            
            leftShin: physicsSystem.addRule(new DistanceRule(
                this.joints.leftHip, this.joints.leftKnee, {
                    length: 90,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#ffffff',
                    drawAsSpring: true,
                    id: 'leftShin'
                }
            )),
            
            leftAnkle: physicsSystem.addRule(new DistanceRule(
                this.joints.leftKnee, this.joints.leftFoot, {
                    length: 50,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#ffffff',
                    drawAsSpring: false,
                    id: 'leftAnkle'
                }
            )),
            
            leftCross1: physicsSystem.addRule(new DistanceRule(
                this.joints.leftHip, this.joints.leftFoot, {
                    length: 90,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#a00000',
                    drawAsSpring: true,
                    id: 'leftCross1'
                }
            )),
            
            leftCross2: physicsSystem.addRule(new DistanceRule(
                this.joints.body, this.joints.leftKnee, {
                    length: 150,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#a00000',
                    drawAsSpring: true,
                    id: 'leftCross2'
                }
            )),
            
            leftCross3: physicsSystem.addRule(new DistanceRule(
                this.joints.leftFoot, this.joints.body, {
                    length: 185,
                    stiffness: 20,
                    damping: 0.9,
                    color: '#a00000',
                    drawAsSpring: true,
                    id: 'leftCross3'
                }
            )),
            
            // Pierna derecha
            rightThigh: physicsSystem.addRule(new DistanceRule(
                this.joints.body, this.joints.rightHip, {
                    length: 130,
                    stiffness: 10,
                    damping: 0.8,
                    color: '#ffffff',
                    drawAsSpring: false,
                    id: 'rightThigh'
                }
            )),
            
            rightShin: physicsSystem.addRule(new DistanceRule(
                this.joints.rightHip, this.joints.rightKnee, {
                    length: 90,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#ffffff',
                    drawAsSpring: true,
                    id: 'rightShin'
                }
            )),
            
            rightAnkle: physicsSystem.addRule(new DistanceRule(
                this.joints.rightKnee, this.joints.rightFoot, {
                    length: 50,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#ffffff',
                    drawAsSpring: false,
                    id: 'rightAnkle'
                }
            )),
            
            rightCross1: physicsSystem.addRule(new DistanceRule(
                this.joints.rightHip, this.joints.rightFoot, {
                    length: 90,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#a00000',
                    drawAsSpring: true,
                    id: 'rightCross1'
                }
            )),
            
            rightCross2: physicsSystem.addRule(new DistanceRule(
                this.joints.body, this.joints.rightKnee, {
                    length: 150,
                    stiffness: 20,
                    damping: 0.8,
                    color: '#a00000',
                    drawAsSpring: true,
                    id: 'rightCross2'
                }
            )),
            
            rightCross3: physicsSystem.addRule(new DistanceRule(
                this.joints.rightFoot, this.joints.body, {
                    length: 185,
                    stiffness: 20,
                    damping: 0.9,
                    color: '#a00000',
                    drawAsSpring: true,
                    id: 'rightCross3'
                }
            ))
        };
        
        // Valores normales para longitudes de resortes
        this.defaultLengths = {
            leftThigh: 130,
            leftShin: 90,
            leftCross1: 90,
            leftCross2: 150,
            leftCross3: 185,
            rightThigh: 130,
            rightShin: 90,
            rightCross1: 90,
            rightCross2: 150,
            rightCross3: 185
        };
    }
    

    // Método para levantar una pierna (valores negativos estirarán más allá de lo normal)
    raiseLeg(side, factor) {
        // Ya no limitamos el factor mínimo, solo el máximo
        factor = Math.min(1, factor);
        
        if (side === 'left') {
            // Si factor es positivo, acorta los resortes (levanta)
            // Si factor es negativo, alarga los resortes (estira más allá de normal)
            this.rules.leftCross3.length = this.defaultLengths.leftCross3 * (1 - factor * 0.4);
            this.rules.leftCross2.length = this.defaultLengths.leftCross2 * (1 - factor * 0.8);
            this.rules.leftCross1.length = this.defaultLengths.leftCross1 * (1 - factor * 0.6);
        } 
        else if (side === 'right') {
            // Aplicar la misma lógica a la pierna derecha
            this.rules.rightCross3.length = this.defaultLengths.rightCross3 * (1 - factor * 0.4);
            this.rules.rightCross2.length = this.defaultLengths.rightCross2 * (1 - factor * 0.8);
            this.rules.rightCross1.length = this.defaultLengths.rightCross1 * (1 - factor * 0.6);
        }
    }
}

// Configuración de teclas para el bípedo
function setupBipedControls(biped) {
    // Variables para seguimiento del estado actual
    let leftLegFactor = 0;
    let rightLegFactor = 0;
    const movementSpeed = 0.03;  // Velocidad más lenta para movimiento continuo
    
    // Objeto para rastrear qué teclas están siendo presionadas
    const keysPressed = {
        'q': false,
        'a': false,
        'p': false,
        'l': false
    };
    
    // Intervalo para actualizar continuamente mientras se mantiene presionada una tecla
    let updateInterval = null;
    
    // Función que se ejecutará continuamente mientras se mantengan teclas presionadas
    function updateLegs() {
        // Pierna izquierda
        if (keysPressed['q']) {
            leftLegFactor = Math.min(1, leftLegFactor + movementSpeed);
            biped.raiseLeg('left', leftLegFactor);
        } 
        else if (keysPressed['a']) {
            // Ya no limitamos a 0, permitimos valores negativos hasta -1
            leftLegFactor = Math.max(-1, leftLegFactor - movementSpeed);
            biped.raiseLeg('left', leftLegFactor);
        }
        
        // Pierna derecha
        if (keysPressed['p']) {
            rightLegFactor = Math.min(1, rightLegFactor + movementSpeed);
            biped.raiseLeg('right', rightLegFactor);
        } 
        else if (keysPressed['l']) {
            // Ya no limitamos a 0, permitimos valores negativos hasta -1
            rightLegFactor = Math.max(-1, rightLegFactor - movementSpeed);
            biped.raiseLeg('right', rightLegFactor);
        }
    }

    // Evento cuando una tecla es presionada
    document.addEventListener('keydown', (e) => {
        // Registrar que la tecla está siendo presionada
        if (e.key in keysPressed) {
            keysPressed[e.key] = true;
            
            // Iniciar el intervalo si no está activo
            if (!updateInterval) {
                updateInterval = setInterval(updateLegs, 20); // Actualizar cada 20ms
            }
        }
    });
    
    // Evento cuando una tecla es liberada
    document.addEventListener('keyup', (e) => {
        // Registrar que la tecla ya no está siendo presionada
        if (e.key in keysPressed) {
            keysPressed[e.key] = false;
            
            // Si no hay teclas presionadas, detener el intervalo
            if (!Object.values(keysPressed).some(pressed => pressed)) {
                clearInterval(updateInterval);
                updateInterval = null;
            }
        }
    });
}
// Uso:
// const myBiped = new Biped(physicsSystem, 800, 400);
// setupBipedControls(myBiped);