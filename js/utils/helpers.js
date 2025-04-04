// Función para calcular la distancia de un punto a una línea
function distanceToLine(px, py, x1, y1, x2, y2) {
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    
    const dot = A * C + B * D;
    const len_sq = C * C + D * D;
    let param = -1;
    
    if (len_sq !== 0) {
        param = dot / len_sq;
    }
    
    let xx, yy;
    
    if (param < 0) {
        xx = x1;
        yy = y1;
    }
    else if (param > 1) {
        xx = x2;
        yy = y2;
    }
    else {
        xx = x1 + param * C;
        yy = y1 + param * D;
    }
    
    const dx = px - xx;
    const dy = py - yy;
    
    return Math.sqrt(dx * dx + dy * dy);
}

// Función para generar IDs
function generateJointId() {
    lastUsedJointId++;
    return `joint${lastUsedJointId}`;
}

function generateRuleId() {
    lastUsedRuleId++;
    return `rule${lastUsedRuleId}`;
}

// Función para capitalizar la primera letra
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Función para actualizar los contadores de IDs basado en los IDs existentes
function updateLastUsedIds() {
    lastUsedJointId = 0;
    lastUsedRuleId = 0;

    for (const joint of physicsSystem.joints) {
        const match = /joint(\d+)/.exec(joint.id);
        if (match) {
            const num = parseInt(match[1]);
            if (num > lastUsedJointId) {
                lastUsedJointId = num;
            }
        }
    }

    for (const rule of physicsSystem.rules) {
        const match = /rule(\d+)/.exec(rule.id);
        if (match) {
            const num = parseInt(match[1]);
            if (num > lastUsedRuleId) {
                lastUsedRuleId = num;
            }
        }
    }
}