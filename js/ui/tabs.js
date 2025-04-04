// Función para manejar las pestañas
function openTab(evt, tabName) {
    // Ocultar todos los contenidos de las pestañas
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Desactivar todos los botones de pestañas
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Mostrar el contenido de la pestaña actual y activar el botón
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";

    // Si estamos en la pestaña de exportar, generar el código automáticamente
    if (tabName === "export") {
        generateCode();
    }
}