// Constantes globales para la física del sistema
const CONFIG = {
    // Constantes físicas
    GRAVITY: 9.8,
    GROUND_FRICTION: 0.8,
    AIR_FRICTION: 0.999,
    ELASTICITY: 0.0,
    GROUND_DRAG: 0.05,
    FPS: 60,
    
    // Valores por defecto para joints
    DEFAULT_JOINT: {
        MASS: 1,
        RADIUS: 5,
        COLOR: '#ffffff',
        FIXED: false
    },
    
    // Valores por defecto para distance rules
    DEFAULT_DISTANCE: {
        LENGTH: 100,
        STIFFNESS: 50,
        DAMPING: 3,
        COLOR: '#ffffff',
        DRAW_AS_SPRING: true
    }
};

// Variables globales para el editor
let currentTool = 'select';
let selectedJoint = null;
let selectedRule = null;
let connectingJoint = null;
let lastUsedJointId = 0;
let lastUsedRuleId = 0;
let groundHeight = 0;

// Objeto para almacenar referencias a joints por ID durante la importación
let createdJoints = {};