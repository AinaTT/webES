<?php

// grab recaptcha library
require_once "../recaptchalib.php";

// your secret key
$secret = "6LecvRwUAAAAACd-Ii5q8mAH83x2vYMeqBC5Owxm";
 
// empty response
$response = null;
 
// check secret key
$reCaptcha = new ReCaptcha($secret);

// if submitted check response
if ($_POST["g-recaptcha-response"]) {
    $response = $reCaptcha->verifyResponse(
        $_SERVER["REMOTE_ADDR"],
        $_POST["g-recaptcha-response"]
    );
}

if ($response != null && $response->success) {
    

	$sendTo = "info@topciment.com";
	$subject = "Formulario enviado desde la pagina web Topciment italiano";
	$headers = "From: " . "<" . $_POST["email_usuario"] . ">\r\n";
	$headers .= "Reply-To: " . $_POST["email_usuario"]. ">\r\n"; 
	$headers .= "Bcc: informatica@topciment.com";
    $message= 'Nombre: '.$_POST['nombre_usuario']."\n".'Email: '.$_POST['email_usuario']."\n".'Telefono: '.$_POST['telefono_usuario']."\n".'Localidad: '.$_POST['localidad_usuario']."\n".'Consulta: '.$_POST['nota_usuario'];
	mail($sendTo, $subject, $message, $headers);
	//echo "estado=Messaggio inviato, a breve ci metteremo in contatto con lei.";
header("Location: https://www.topciment.com/it/gracias.html"); /* Redirect browser */

//echo "Hi " . $_POST["name"] . " (" . $_POST["email"] . "), grazie per averci inviato la tua richiesta!";
  } else {
	  //echo 'ERROR Captcha';
	  header("Location: https://www.topciment.com/it/error-captcha.html");
  }

?>
