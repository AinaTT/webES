<?php 
// UTF8
ini_set('mbstring.internal_encoding','UTF-8');
ini_set('mbstring.func_overload',7);
ini_set('default_charset', 'UTF-8'); 

session_start();
include('app/classloader.php');
include('app/appconfig.php');
include('app/vendor/Common/sanitize.inc.php');

setlocale(LC_ALL, 'es_ES.utf8');
date_default_timezone_set('Europe/Madrid');

if( DEV_MODE ){
	//depuracion de errores
	error_reporting(E_ERROR | E_WARNING | E_PARSE);
    ini_set('display_errors','On');
}else{
    //error_reporting(E_ALL);
    error_reporting(E_ERROR | E_WARNING | E_PARSE);
    ini_set('display_errors','Off');
    ini_set('log_errors', 'On');
    ini_set('error_log', $_SERVER['DOCUMENT_ROOT'].'/app/logs/error.log');
}


#smarty
$smarty = new Smarty();
$smarty->setConfigDir(SMARTY_CONFIG);
$smarty->setTemplateDir(SMARTY_TEMPLATES);
$smarty->setCompileDir(SMARTY_TEMPLATES_C);


$smarty->assign('IVA',IVA);
$smarty->assign('RUTACARRITO',RUTACARRITO);
$smarty->assign('RUTACATEGORIA',RUTACATEGORIA);
$smarty->assign('RUTAPAGINA',RUTAPAGINA);
$smarty->assign('RUTAPOST',RUTAPOST);
$smarty->assign('DOMINIO',DOMINIO);
$smarty->assign('DOMINIO',DOMINIO);


###########
###  db
###########
try{
	$db = new miDB(DB_HOST,DB_USER, DB_PASS, DB_NAME);
}catch (Exception $e) {
	// falla la conexión
	header('Location:'.DOMINIO.'/error500');
	exit();
}

#######################################
############# ENCUESTA ################ Páginas - Vistas
if( isset($_SESSION['paginas_vistas']) ){
	++$_SESSION['paginas_vistas'];
}else{
	$_SESSION['paginas_vistas'] = 1;
}
if( $_SESSION['paginas_vistas'] <= 3 || isset( $_COOKIE['ocultar_encuesta'] ) ){
	$smarty->assign('encuesta',false);  // NO la muestro
}else{
	$smarty->assign('encuesta',true);   // SI la muestro
}
// SET COOKIE
if( isset($_GET['muestra_encuesta']) && $_GET['muestra_encuesta'] == 'no'){ // muestra_encuesta=no
	$origen = $_SERVER['HTTP_REFERER'];
	$expire = time()+60*60*24*30;
	setcookie('ocultar_encuesta', 'ocultar', $expire);
	header ('Location:'.$origen.'');
	exit();
}


##############################
######### Enrutado ###########
/*Enrutador, se le pasa un array con las rutas y destinos y a correr... acepta regexp
* @param array $rutas Array que relaciona las rutas con sus archivos de destino
* @param string $requestURI
* @return void
* @example: enrutar(array(
*			"/" => "src/inicio.php",
*			// seudo expresiones regulares más fáciles de escribir ;P
*			"/catalogo/page/:number" => "src/Catalogo.php",
*			"/producto/:alpha" => "src/Producto.php",
*			"/fabricante/:string" => "src/Fabricante.php"
*			// expresiones regulares estandard
*			"/catalogo/page/([0-9]+)" => "src/Catalogo.php",
*			"/producto/([a-zA-Z0-9-_]+)" => "src/Producto.php",
*			"/fabricante/([a-zA-Z]+)" => "src/Fabricante.php"
*		));	*/
function enrutar($rutas){
		// smarty y db como globales para evitar pasarlas como params a la función
		global $smarty;
		global $db;
		global $idiomas_gettext;
		global $regexp_langs;

        $path_info = '/';
        if (!empty($_SERVER['PATH_INFO'])) {
            $path_info = $_SERVER['PATH_INFO'];
        }else if (!empty($_SERVER['ORIG_PATH_INFO']) && $_SERVER['ORIG_PATH_INFO'] !== '/index.php') {
            $path_info = $_SERVER['ORIG_PATH_INFO'];
        } else {
            if (!empty($_SERVER['REQUEST_URI'])) {
				if( strpos($_SERVER['REQUEST_URI'], '?') > 0 ){
					 $path_info = strstr($_SERVER['REQUEST_URI'], '?', true);
				}else{
					$path_info = $_SERVER['REQUEST_URI'];
				}
            }
        }
        
        $gestor_ruta = null;
        $regex_aciertos = array();
		//var_dump($path_info);
        if ( isset($rutas[$path_info]) ) {
            $gestor_ruta = $rutas[$path_info];
        }else if ($rutas) {
            $tokens = array(
                ':string' => '([a-zA-Z]+)',
                ':number' => '([0-9]+)',
                ':alpha'  => '([a-zA-Z0-9\-_]+)',
                // regexp de idiomas
                ':lang' => $regexp_langs,
                ':detodo' => '(.*)'
            );
            foreach ($rutas as $pattern => $la_ruta) {
                $pattern = strtr($pattern, $tokens);
                if (preg_match('#^/?' . $pattern . '/?$#', $path_info, $aciertos)) {
                    $gestor_ruta = $la_ruta;
                    $regex_aciertos = $aciertos;
                    break;
                }
            }
        }
		
		//por compatibilidad con lo existente en topciment
		$mirutaurl = $path_info;
		//var_dump($gestor_ruta);
        if ($gestor_ruta) {
			if( is_readable($gestor_ruta) ){
				include($gestor_ruta);
			}else{
				//ERROR 404
				include($rutas['404']);
			}
		}
}



// Traducciones en:  include('app/src/tienda/tienda_comun.php');


$rutas = array(
		'404' => 'app/src/errors/error.php',	
		'/' => 'app/src/tienda/inicio.php',
		'/:lang/' => 'app/src/tienda/inicio.php',
		'/tienda' => 'app/src/tienda/tienda.php',
		'/sitemap.xml' => 'app/src/tienda/sitemap.php',
		'/buscar/' =>'app/src/tienda/buscador.php',
		'/buscar/:detodo' =>'app/src/tienda/buscador.php',
		'/contacto-asesoramiento-profesional' => 'app/src/tienda/contacto.php',
		'/delegaciones:detodo' => 'app/src/tienda/contacto.php',
		'/pagina/condiciones-uso-politica-privacidad' => 'app/src/tienda/pagina.php',
		'/pagina/uso-de-cookies' => 'app/src/tienda/pagina.php',
		'/carrito' => 'app/src/tienda/carrito.php',
		'/carrito/check/:detodo' => 'app/src/tienda/carrito_add.php',
		'/carrito/:detodo' => 'app/src/tienda/carrito.php',
		'/usuario' => 'app/src/tienda/user.php',
		'/usuario/recuperar-password' => 'app/src/tienda/recuperar_pass.php',
		'/usuario/recuperar-password/:detodo' => 'app/src/tienda/recuperar_pass.php',
		'/usuario/:alpha' => 'app/src/tienda/user.php',
		'/error/:num' => 'app/src/errors/error.php',
		'/:detodo' => 'app/src/tienda/detodo.php',
	);
enrutar($rutas);

//		'/google4e1ab7b933b6f63c.html' => 'app/src/tienda/se_comprobacion.php',
//		'/scrape-analytics' => 'app/src/tasks/cron_analytics.php',
//		'/sitemapimg.xml' => 'app/src/tienda/sitemapimg.php',
//		'/informacion' => 'app/src/tienda/pagina.php',		
//		'/revestimiento-continuo' => 'app/src/tienda/pagina.php',
//		'/aplicacion-microcemento' => 'app/src/tienda/pagina.php',
//		'/gama-de-colores-del-microcemento' => 'app/src/tienda/pagina.php',
//		'/acerca-de-nosotros-conocenos-un-poco-mejor' => 'app/src/tienda/pagina.php',
?>