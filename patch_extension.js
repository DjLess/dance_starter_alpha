/**
 * MOD: HACKER TERMINAL - CHROMA HEADLESS (CORREGIDO)
 * Mantiene la estética de consola, colores vibrantes y elimina cuerpos ASCII.
 */

console.log("📟 Inicializando protocolo de intrusión visual...");

// 1. REESCRITURA DE ESTILOS (Look & Feel de Terminal)
const hackerStyle = document.createElement('style');
hackerStyle.textContent = `
    :root {
        --bg-color: #000800 !important;
        --accent-color: #00ff41 !important; 
        --panel-bg: rgba(0, 10, 0, 0.95) !important;
        --border-color: #003300 !important;
        --terminal-font: 'Consolas', 'Monaco', 'Courier New', monospace;
    }

    body::before {
        content: " ";
        display: block;
        position: absolute;
        top: 0; left: 0; bottom: 0; right: 0;
        background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), 
                    linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
        z-index: 9999;
        background-size: 100% 2px, 3px 100%;
        pointer-events: none;
    }

    #zona-juego {
        filter: brightness(1.1) contrast(1.2);
        border: 1px solid var(--accent-color);
        box-shadow: 0 0 15px rgba(0, 255, 65, 0.2);
        background-color: #000500 !important;
    }
`;
document.head.appendChild(hackerStyle);



const clubTitle = document.getElementById('club-name');
if (clubTitle) clubTitle.innerText = "SYSTEM_BREACH_V2.0";

// 3. TRANSFORMACIÓN DE NPCs EN ICONOS FLOTANTES
const originalGenerarLayoutHacker = window.generarLayout;
window.generarLayout = function() {
    if (typeof originalGenerarLayoutHacker === 'function') originalGenerarLayoutHacker();
    
    if (typeof npcs !== 'undefined') {
        // Colores Cyber: Cian, Rosa, Amarillo, Verde, Naranja
        const cyberColors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff41", "#ff4500"];
        const dataIcons = ["{01}", "<0x>", "[FF]", "(??)", "##"];
        
        npcs.forEach(n => {
            n.char = dataIcons[Math.floor(Math.random() * dataIcons.length)];
            n.color = cyberColors[Math.floor(Math.random() * cyberColors.length)];
        });
    }
};

// 4. FILTRADO DE RENDERIZADO (Solo el "rostro"/icono, ocultar el resto)
const originalFillText = CanvasRenderingContext2D.prototype.fillText;

CanvasRenderingContext2D.prototype.fillText = function(text, x, y, maxWidth) {
    // Definimos qué caracteres se consideran "cuerpo" para ocultarlos
    const isBodyPart = /[\\\/|_]/.test(text) && text.length === 1;
    
    // Si NO es una parte del cuerpo, lo dibujamos con estilo hacker
    if (!isBodyPart) {
        this.save();
        
        // Estilo especial para el Jugador
        if (text === ">_ROOT") {
            this.fillStyle = "#00ff41";
            this.font = "bold 15px 'Consolas', monospace";
            this.shadowBlur = 10;
            this.shadowColor = "#00ff41";
        } else {
            // Estilo para NPCs y otros textos (usando el color que el motor ya les asignó)
            this.font = "bold 13px 'Consolas', monospace";
            if (this.fillStyle === "#ff0000" || this.fillStyle === "red") {
                // Si el motor intenta pintar rojo (NPC normal), aplicamos brillo
                this.shadowBlur = 5;
                this.shadowColor = this.fillStyle;
            }
        }

        originalFillText.call(this, text, x, y, maxWidth);
        this.restore();
    }
};

// 5. RE-INICIALIZAR PARA APLICAR CAMBIOS
if (typeof generarLayout === 'function') generarLayout();

console.log("🔓 Parche aplicado: Personajes sin cuerpo y colores corregidos.");
