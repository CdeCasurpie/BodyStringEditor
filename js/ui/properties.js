// Actualizar el panel de propiedades según la selección actual
function updatePropertiesPanel() {
    // Ocultar todos los paneles de propiedades
    document.getElementById('jointProperties').classList.add('hidden');
    document.getElementById('distanceProperties').classList.add('hidden');
    document.getElementById('noSelection').classList.add('hidden');
    
    if (selectedJoint) {
        // Mostrar propiedades del joint
        const panel = document.getElementById('jointProperties');
        panel.classList.remove('hidden');
        
        document.getElementById('jointId').value = selectedJoint.id;
        document.getElementById('jointMass').value = selectedJoint.mass;
        document.getElementById('jointRadius').value = selectedJoint.radius;
        document.getElementById('jointColor').value = selectedJoint.color;
        document.getElementById('jointFixed').checked = selectedJoint.fixed;
    }
    else if (selectedRule && selectedRule instanceof DistanceRule) {
        // Mostrar propiedades de la regla de distancia
        const panel = document.getElementById('distanceProperties');
        panel.classList.remove('hidden');
        
        document.getElementById('distanceId').value = selectedRule.id;
        document.getElementById('distanceLength').value = selectedRule.length;
        document.getElementById('distanceStiffness').value = selectedRule.stiffness;
        document.getElementById('distanceDamping').value = selectedRule.damping;
        document.getElementById('distanceColor').value = selectedRule.color;
        document.getElementById('distanceDrawAsSpring').checked = selectedRule.drawAsSpring;
    }
    else {
        // No hay selección
        document.getElementById('noSelection').classList.remove('hidden');
    }
}

// Aplicar propiedades editadas a un joint
function applyJointProperties() {
    if (!selectedJoint) return;
    
    selectedJoint.id = document.getElementById('jointId').value;
    selectedJoint.mass = parseFloat(document.getElementById('jointMass').value);
    selectedJoint.radius = parseFloat(document.getElementById('jointRadius').value);
    selectedJoint.color = document.getElementById('jointColor').value;
    selectedJoint.fixed = document.getElementById('jointFixed').checked;
}

// Aplicar propiedades editadas a una regla de distancia
function applyDistanceProperties() {
    if (!selectedRule || !(selectedRule instanceof DistanceRule)) return;
    
    selectedRule.id = document.getElementById('distanceId').value;
    selectedRule.length = parseFloat(document.getElementById('distanceLength').value);
    selectedRule.stiffness = parseFloat(document.getElementById('distanceStiffness').value);
    selectedRule.damping = parseFloat(document.getElementById('distanceDamping').value);
    selectedRule.color = document.getElementById('distanceColor').value;
    selectedRule.drawAsSpring = document.getElementById('distanceDrawAsSpring').checked;
}