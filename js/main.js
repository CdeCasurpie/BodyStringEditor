// Inicialización y punto de entrada principal de la aplicación

// Variables globales para el canvas
let canvas;
let ctx;

// Inicializar canvas y configurar su tamaño
function initCanvas() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    
    // Configurar evento de cambio de tamaño
    window.addEventListener('resize', resizeCanvas);
}

// Ajustar tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    groundHeight = canvas.height * 0.8;
}

// Inicializar la aplicación
function initApp() {
    // Inicializar canvas
    initCanvas();
    
    // Crear el sistema físico
    window.physicsSystem = new PhysicsSystem();
    
    // Configurar eventos de la interfaz
    setupEditorEvents();
    

    const myBiped = new Biped(physicsSystem, 800, 600);
    setupBipedControls(myBiped);
    
    // Iniciar el sistema
    physicsSystem.start();

}

// Iniciar la aplicación cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', initApp);