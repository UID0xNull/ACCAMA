<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Generador de QR</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      text-align: center;
      padding: 30px;
    }
    input[type="text"] {
      width: 300px;
      padding: 10px;
      font-size: 16px;
    }
    button {
      padding: 10px 20px;
      font-size: 16px;
      margin-left: 10px;
    }
    #qrcode {
      margin-top: 30px;
    }
  </style>
</head>
<body>
  <h1>Generador de QR</h1>
  <input type="text" id="enlace" placeholder="Pegá el enlace aquí">
  <button onclick="generarQR()">Generar QR</button>
  <div id="qrcode"></div>

  <script src="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js"></script>
  <script>
    function generarQR() {
      const enlace = document.getElementById("enlace").value.trim();
      const contenedor = document.getElementById("qrcode");
      contenedor.innerHTML = ""; // Limpiar QR anterior

      if (enlace) {
        new QRCode(contenedor, {
          text: enlace,
          width: 256,
          height: 256,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H
        });
      } else {
        alert("Por favor, ingresá un enlace válido.");
      }
    }
  </script>
</body>
</html>
