<?php
// Archivo: procesar-formulario.php

// Configuración de variables
$email_destino = "consultas@accama.com"; // Cambia esto por tu correo real
$asunto = "Nuevo contacto desde el sitio web de ACCAMA";

// Verifica si el formulario fue enviado
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    
    // Recoge y limpia los datos del formulario
    $nombre = filter_var($_POST['nombre'], FILTER_SANITIZE_STRING);
    $telefono = filter_var($_POST['telefono'], FILTER_SANITIZE_STRING);
    $email = filter_var($_POST['email'], FILTER_SANITIZE_EMAIL);
    $consulta = filter_var($_POST['consulta'], FILTER_SANITIZE_STRING);
    $reprocann = filter_var($_POST['reprocann'], FILTER_SANITIZE_STRING);
    
    // Validación básica
    if (empty($nombre) || empty($telefono) || empty($email) || empty($consulta) || empty($reprocann)) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, complete todos los campos requeridos.'));
        exit;
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(array('success' => false, 'message' => 'Por favor, ingrese un correo electrónico válido.'));
        exit;
    }
    
    // Construye el contenido del correo
    $contenido = "Nombre: " . $nombre . "\n";
    $contenido .= "Teléfono: " . $telefono . "\n";
    $contenido .= "Email: " . $email . "\n";
    $contenido .= "¿Tiene Reprocann?: " . $reprocann . "\n\n";
    $contenido .= "Consulta:\n" . $consulta . "\n";
    
    // Cabeceras del correo
    $cabeceras = "From: " . $email . "\r\n";
    $cabeceras .= "Reply-To: " . $email . "\r\n";
    
    // Envía el correo
    if (mail($email_destino, $asunto, $contenido, $cabeceras)) {
        // Éxito
        echo json_encode(array('success' => true, 'message' => '¡Gracias! Tu mensaje ha sido enviado correctamente.'));
    } else {
        // Error al enviar
        echo json_encode(array('success' => false, 'message' => 'Lo sentimos, hubo un problema al enviar tu mensaje. Por favor, inténtalo de nuevo.'));
    }
} else {
    // Si no se accede a través del formulario
    echo json_encode(array('success' => false, 'message' => 'Acceso incorrecto.'));
}
?>