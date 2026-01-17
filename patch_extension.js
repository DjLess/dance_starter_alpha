/**
 * CYBER_CLUB - STABLE ENTITY SYNC
 * Fija las skins para que no cambien aleatoriamente y mantiene la Zona Azul.
 */

console.log("🛡️ [CYBER_CLUB] Versión estable: Skins fijas y Zona Azul corregida.");

const CYBER_SKINS = {
    MARCO: { 
        id: "guerrero", 
        izq: [" /", "█C", "/ \\"], 
        der: ["\\ ", "C█\\", "/ \\"], 
        base: ["  ", "█C ", "/ \\"], 
        dance: [" ", "/█\\", "/ \\"] 
    },
    ELENA: { 
        id: "exploradora", 
        izq: [" ", "/Hп", "/ \\"], 
        der: [" ", "пH\\", "/ \\"], 
        base: [" ", " H ", "/ \\"], 
        dance: ["\\ /", " H ", "/ \\"] 
    },
    R40: { 
        id: "robot", 
        izq: [" ", "o- ", "d b"], 
        der: [" ", " -o", "d b"], 
        base: [" ", " - ", "d b"], 
        dance: ["o o", "\\ /", "d b"] 
    },
    SILAS: { 
        id: "mago", 
        izq: [" ^ ", " ", "/A "], 
        der: [" ^ ", " ", " A\\"], 
        base: [" ^ ", " ", " / \\"], 
        dance: ["~^~", " ", "/A\\"] 
    }
};

const originalFillText = CanvasRenderingContext2D.prototype.fillText;

CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    let targetSkin = null;
    let state = "base";

    // 1. IDENTIFICACIÓN DEL JUGADOR (Prioridad 1)
    const isPlayer = (typeof player !== 'undefined' && 
        (Math.abs(x - (player.x * (450/config.grid) + 22.5)) < 30 || text === player.char));

    if (isPlayer) {
        targetSkin = CYBER_SKINS.R40;
        if (player.y < 160) state = "dance"; // Zona Azul
        else if (player.vx < -0.1) state = "izq";
        else if (player.vx > 0.1) state = "der";
    } 
    // 2. IDENTIFICACIÓN DE NPCs Y BARTENDER
    else if (typeof npcs !== 'undefined') {
        const npcMatch = npcs.find(n => Math.abs(x - (n.x * (450/config.grid) + 22.5)) < 30);
        
        if (npcMatch && !text.includes('WC')) {
            // ASIGNACIÓN FIJA DE SKIN (Usamos n.id para que no cambie al caminar)
            if (npcMatch.x < 180 && npcMatch.y > 160) {
                targetSkin = CYBER_SKINS.R40; // Bartender
            } else {
                // Si el ID es par es Elena, si es impar es Silas (para variedad)
                targetSkin = (npcMatch.id % 2 === 0) ? CYBER_SKINS.R40 : CYBER_SKINS.R40;
            }

            // Lógica de Estado (Corral vs Pista)
            if (npcMatch.y < 160) state = "dance";
            else {
                if (text.includes('<')) state = "izq";
                else if (text.includes('>')) state = "der";
            }
        }
    }

    // 3. RENDERIZADO
    if (targetSkin) {
        this.save();
        this.font = "bold 14px 'Courier New', monospace";
        this.textAlign = "center";
        const originalColor = this.fillStyle;
        const bodyLines = targetSkin[state] || targetSkin["base"];

        bodyLines.forEach((line, i) => {
            if (i === 1 && targetSkin === CYBER_SKINS.SILAS) return; 
            originalFillText.call(this, line, x, y + (i * 14) - 15);
        });

        this.fillStyle = originalColor;
        let faceY = (targetSkin === CYBER_SKINS.SILAS) ? -1 : -15;
        originalFillText.call(this, text, x, y + faceY);
        this.restore();
    } else {
        originalFillText.call(this, text, x, y, maxWidth);
    }
};

if (document.getElementById('club-name')) {
    document.getElementById('club-name').innerText = "── CYBER_CLUB: STABLE_SYNC ──";
}
