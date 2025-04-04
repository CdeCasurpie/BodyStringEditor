// Generar código para exportar el sistema actual
function generateCode() {
    let code = '// Código generado por el Editor de Sistema Articulado\n\n';
    
    // Generar código para los joints
    code += '// Crear sistema físico\n';
    code += 'const physicsSystem = new PhysicsSystem();\n\n';
    
    code += '// Crear joints\n';
    for (const joint of physicsSystem.joints) {
        code += `const ${joint.id} = physicsSystem.addJoint(new Joint(${Math.round(joint.x)}, ${Math.round(joint.y)}, {\n`;
        code += `    mass: ${joint.mass},\n`;
        code += `    fixed: ${joint.fixed},\n`;
        code += `    color: '${joint.color}',\n`;
        code += `    radius: ${joint.radius},\n`;
        code += `    id: '${joint.id}'\n`;
        code += `}));\n`;
    }
    
    code += '\n// Crear reglas\n';
    for (const rule of physicsSystem.rules) {
        if (rule instanceof DistanceRule) {
            code += `physicsSystem.addRule(new DistanceRule(${rule.jointA.id}, ${rule.jointB.id}, {\n`;
            code += `    length: ${rule.length},\n`;
            code += `    stiffness: ${rule.stiffness},\n`;
            code += `    damping: ${rule.damping},\n`;
            code += `    color: '${rule.color}',\n`;
            code += `    drawAsSpring: ${rule.drawAsSpring},\n`;
            code += `    id: '${rule.id}'\n`;
            code += `}));\n`;
        }
    }
    
    // Actualizar el campo de texto
    document.getElementById('exportCode').value = code;
}

// Copiar el código al portapapeles
function copyToClipboard() {
    const textarea = document.getElementById('exportCode');
    textarea.select();
    document.execCommand('copy');
    alert('Código copiado al portapapeles');
}

// Importar un sistema desde código
function importCode() {
    const codeText = document.getElementById('importCode').value.trim();

    if (!codeText) {
        alert('Por favor, ingresa código para importar');
        return;
    }

    if (physicsSystem.joints.length > 0 || physicsSystem.rules.length > 0) {
        if (!confirm('Esta acción reemplazará el sistema actual. ¿Deseas continuar?')) {
            return;
        }
    }

    // Limpiar el sistema actual
    physicsSystem.joints = [];
    physicsSystem.rules = [];
    createdJoints = {};

    try {
        // Patrón para encontrar declaraciones de joints
        const jointPattern = /const\s+(\w+)\s*=\s*physicsSystem\.addJoint\(new\s+Joint\((\d+),\s*(\d+),\s*\{([^}]+)\}\)\);/g;

        // Patrón para encontrar declaraciones de reglas
        const rulePattern = /physicsSystem\.addRule\(new\s+DistanceRule\((\w+),\s*(\w+),\s*\{([^}]+)\}\)\);/g;

        // Primero crear todos los joints
        let jointMatch;
        while ((jointMatch = jointPattern.exec(codeText)) !== null) {
            const jointId = jointMatch[1];
            const x = parseInt(jointMatch[2]);
            const y = parseInt(jointMatch[3]);
            const optionsText = jointMatch[4];

            // Extraer opciones del joint
            const massMatch = /mass:\s*([\d\.]+)/.exec(optionsText);
            const fixedMatch = /fixed:\s*(true|false)/.exec(optionsText);
            const colorMatch = /color:\s*'([^']+)'/.exec(optionsText);
            const radiusMatch = /radius:\s*([\d\.]+)/.exec(optionsText);
            const idMatch = /id:\s*'([^']+)'/.exec(optionsText);

            const options = {
                mass: massMatch ? parseFloat(massMatch[1]) : 1,
                fixed: fixedMatch ? fixedMatch[1] === 'true' : false,
                color: colorMatch ? colorMatch[1] : '#ffffff',
                radius: radiusMatch ? parseFloat(radiusMatch[1]) : 5,
                id: idMatch ? idMatch[1] : jointId
            };

            // Crear el joint
            const joint = new Joint(x, y, options);
            physicsSystem.addJoint(joint);

            // Guardar referencia por ID para conectar reglas luego
            createdJoints[jointId] = joint;
        }

        // Luego crear todas las reglas
        let ruleMatch;
        while ((ruleMatch = rulePattern.exec(codeText)) !== null) {
            const jointAId = ruleMatch[1];
            const jointBId = ruleMatch[2];
            const optionsText = ruleMatch[3];

            // Verificar que tenemos referencias a los joints
            if (!createdJoints[jointAId] || !createdJoints[jointBId]) {
                console.error(`No se encontraron los joints ${jointAId} o ${jointBId}`);
                continue;
            }

            // Extraer opciones de la regla
            const lengthMatch = /length:\s*([\d\.]+)/.exec(optionsText);
            const stiffnessMatch = /stiffness:\s*([\d\.]+)/.exec(optionsText);
            const dampingMatch = /damping:\s*([\d\.]+)/.exec(optionsText);
            const colorMatch = /color:\s*'([^']+)'/.exec(optionsText);
            const drawAsSpringMatch = /drawAsSpring:\s*(true|false)/.exec(optionsText);
            const idMatch = /id:\s*'([^']+)'/.exec(optionsText);

            const options = {
                length: lengthMatch ? parseFloat(lengthMatch[1]) : 100,
                stiffness: stiffnessMatch ? parseFloat(stiffnessMatch[1]) : 0.1,
                damping: dampingMatch ? parseFloat(dampingMatch[1]) : 0.1,
                color: colorMatch ? colorMatch[1] : '#ffffff',
                drawAsSpring: drawAsSpringMatch ? drawAsSpringMatch[1] === 'true' : true,
                id: idMatch ? idMatch[1] : `rule_${Math.random().toString(36).substr(2, 9)}`
            };

            // Crear la regla de distancia
            const rule = new DistanceRule(createdJoints[jointAId], createdJoints[jointBId], options);
            physicsSystem.addRule(rule);
        }

        // Actualizar IDs para la próxima creación
        updateLastUsedIds();

        alert('Sistema importado exitosamente');
    } catch (error) {
        console.error('Error al importar el código:', error);
        alert('Error al importar el código. Verifica el formato y vuelve a intentarlo.');
    }
}