<?php 
	// *Email sender
	require '/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php';

	$emailLis = array('orafalskyy@egogames.es', 'carlossainz55@saivamanagement.com', 'carlosonoro@saivamanagement.com', 'pacoriberas96@hotmail.com', 'jaimedeanta@gmail.com', 'j.guerola.gonzalvez@pwc.com', 'pedro@serrahima.org', 'fernan@llantada.net', 'alex@cubanam.com', 'sergio.lucia@telefonica.net', 'dakota.50@telefonica.net', 'bsanchez@akela.com.es', 'maria@llantada.net', 'jmlaborda@egogames.es', 'marcos@madlions.com', 'jcabezas@egogames.es', 'bsanchez@egogames.es', 'baldomerosanchez19@gmail.com', 'ssauca@egogames.es', 'asaez@egogames.es', 'arodriguez@egogames.es', 'patricia.manca.diaz@pwc.com');

	// $emailLis = array('baldomerosanchez19@gmail.com', 'orafalskyy@egogames.es', 'bsanchez@egogames.es', 'leksanboy@gmail.com');


// 		$messageContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
// 					<html xmlns="http://www.w3.org/1999/xhtml">
// 						<head>
// 							<style>
// 								.gradient:hover{
// 									border-bottom: 10px solid #684c24;
// 									background: #ac8635; /* Old browsers */
// 									background: -moz-linear-gradient(top, #ac8635 1%, #ac8635 51%, #ac8635 51%, #a06d0e 52%, #a47e2d 100%); /* FF3.6-15 */
// 									background: -webkit-linear-gradient(top, #ac8635 1%,#ac8635 51%,#ac8635 51%,#a06d0e 52%,#a47e2d 100%); /* Chrome10-25,Safari5.1-6 */
// 									background: linear-gradient(to bottom, #ac8635 1%,#ac8635 51%,#ac8635 51%,#a06d0e 52%,#a47e2d 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
// 									filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ac8635", endColorstr="#a47e2d",GradientType=0 ); /* IE6-9 */
// 								}

// 								@media screen and (max-width: 440px){
// 									.direccion-mobile{ padding-left: 1%!important;padding-right: 1%!important; }
// 								}

// 								@media screen and (max-width: 520px){
// 									.hr-mobile{ width:20% }
// 									.separator{ width: 0; }
// 							.title2{font-size: 20px!important;}
// 							.small, .big{width: 100%!important;float: inherit!important;}
// 							.small{margin-bottom: 20px;}
// 								}

// 							</style>

// 							<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />

// 							<title>eGo Games - Email Inversores</title>

// 							<meta name="viewport" content="width=device-width, initial-scale=1.0"/>

// 						</head>

// 						<body style="font-size: 14px;line-height:18px;background-color:#163757;font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;margin: 0; padding: 0;">

// 							<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0;">

// 								<tr>

// 									<td>

// 									<table style="border-spacing: 0;max-width:760px;border-collapse: collapse;box-shadow: 6px 0px 11px 2px #0000009e;background-color: #dedede;" align="center" border="0" cellpadding="0" cellspacing="0">

// 								<tr>

// 								  <td style="width: 100%;">

// 									<img style="width: 100%;display: inline-block;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/cabecera-nl-inversores.png" alt="cabecera">

// 									<!--<img style="display:block;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/banner-verifica.jpg" alt="eGo Games" width="768" height="344" />-->

// 								  </td>

// 								</tr>

// 								<tr>

// 								  <td>

// 									<table style="width: 100%;padding: 30px;border-spacing: 0;">

// 									  <tr>

// 										<td>

// 										  <span style="font-weight: bold;font-size: 18px;">Queridos socios,</span>

// 										</td>

// 										<td>

// 										  <span style="float: right;font-weight: bold;font-size: 18px;color: #003044;text-decoration: underline;">14/12/2018</span>

// 										</td>

// 									  </tr>

// 									  <tr>

// 										<td colspan="2">

// 										  <p>

// 											Es un placer haceros llegar nuestra cuarta newsletter procediendo al env&iacute;o de informaci&oacute;n semanal donde repasamos los temas puntuales de la compa&ntilde;&iacute;a y situaci&oacute;n actual.

// 										  </p>

// 										  <div>

// 											<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/banner-mobile.png" alt="banner">

// 										  </div>

// 										</td>

// 									  </tr>

// 									</table>

// 									<table style="width: 100%;border-spacing: 0;">

// 									  <tr>

// 										<td style="border-spacing: 0;">

// 										  <div style="background: #81adc6;width: 100%;text-align: center;padding: 10px 0;font-weight: bold;font-size: 30px;color: #fff;">

// 											<p class="title2" style="margin: 0;">NOTICIAS FIJAS</p>

// 										  </div>

// 										</td>

// 									  </tr>

// 									  <tr>

// 										<td>

// 										  <table style="background: #fff;width: 100%;">

// 											<tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">

// 											  <td>

// 												<div class="small" style="float: left;width: 30%; text-align: center;">

// 												  <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">MARKETING</div>

// 												  <div style="max-width: 80px;margin: auto;">

// 													<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/mkt-com.png" alt="mkt">

// 												  </div>

// 												</div>

// 												<div class="big" style="width: 70%;float: left;">

// 												  Hemos activado un equipo para la direcci&oacute;n del departamento formado por nuestros socios: Antonio Berm&uacute;dez (Content Practice Lead en Publicis), Jorge Planes Trillo (Principal Director Ocio y Entretenimiento en PwC), Javier Recuenco (Director General de Performics), Toni Garrido (fundador animal makers) que junto con &Aacute;lvaro Rodr&iacute;guez y Sergio Sauca desarrollar&aacute;n todas las actividades de comunicaci&oacute;n de la empresa.

// 												</div>

// 											  </td>

// 											</tr>

// 											<tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">

// 											  <td>

// 												<div class="small" style="float: left;width: 30%; text-align: center;">

// 												  <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">PRODUCTO</div>

// 												  <div style="max-width: 80px;margin: auto;">

// 													<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/producto.png" alt="producto">

// 												  </div>

// 												</div>

// 												<div class="big" style="width: 70%;float: left;">

// 												  Durante la pr&oacute;xima semana podr&eacute;is encontrar nuestro software con un v&iacute;deo sencillo de c&oacute;mo integrarlo en los juegos de habilidad para m&oacute;vil en cuesti&oacute;n de treinta (30) minutos. Como sab&eacute;is las pasarelas de pago que utilizamos en eGo son PayPal y AddonPayments (Caixabank). Nos ha llegado una oferta de colaboraci&oacute;n por parte de BBVA para tambi&eacute;n proveernos estos servicios; os mantendremos informados de cualquier posible cambio con su respectiva explicaci&oacute;n detallada.

// 												</div>

// 											  </td>

// 											</tr>

// 											<tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">

// 											  <td>

// 												<div class="small" style="float: left;width: 30%; text-align: center;">

// 												  <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">JUEGOS</div>

// 												  <div style="max-width: 80px;margin: auto;">

// 													<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/juegos.png" alt="juegos">

// 												  </div>

// 												</div>

// 												<div class="big" style="width: 70%;float: left;">

// 												  Est&aacute;n tres de nuestros juegos disponibles en la web y la Samsung Store
// (eGomonkeys, eGopong y eGodarts).Estamos recibiendo varias ofertas de desarrolladores de videojuegos a trav&eacute;s de nuestra p&aacute;gina web por lo que estamos implementando una estructura automatizada de verificaci&oacute;n y aprobaci&oacute;n de cada uno de los juegos de m&oacute;vil de habilidad que iremos sacando con el filtro de calidad de Badland Publishing.

// 												</div>

// 											  </td>

// 											</tr>

// 											<tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">

// 											  <td>

// 												<div class="small" style="float: left;width: 30%; text-align: center;">

// 												  <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">LEGAL/FISCAL</div>

// 												  <div style="max-width: 80px;margin: auto;">

// 													<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/legal.png" alt="legal">

// 												  </div>

// 												</div>

// 												<div class="big" style="width: 70%;float: left;">

// 												  Tenemos pensado establecer nuestra primera junta de socios a finales de enero. Os iremos informando de la mano de Patricia, que como sab&eacute;is tenemos la fortuna de que sea nuestra l&iacute;der legal y secretaria del consejo.

// 												</div>

// 											  </td>

// 											</tr>

// 										  </table>

// 										</td>

// 									  </tr>

// 									</table>

// 									<table style="width: 100%;border-spacing: 0;">

// 									  <tr>

// 										<td style="border-spacing: 0;">

// 										  <div style="background: #81adc6;width: 100%;text-align: center;padding: 10px 0;font-weight: bold;font-size: 30px;color: #fff;">

// 											<p class="title2" style="margin: 0;">NOVEDADES SEMANALES</p>

// 										  </div>

// 										</td>

// 									  </tr>

// 									  <tr>

// 										<td>

// 										  <table style="background: #fff;width: 100%;">

// 											<tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">

// 											  <td>

// 												<div class="small" style="float: left;width: 30%; text-align: center;">

// 												  <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">PARTNERSHIPS</div>

// 												  <div style="max-width: 80px;margin: auto;">

// 													<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/check5.png" alt="partnerships">

// 												  </div>

// 												</div>

// 												<div class="big" style="width: 70%;float: left;">
// 												  Este lunes firmamos el principio de acuerdo con la empresa Global eSports Academy (academia de formaci&oacute;n de jugadores, proveedor de becas acad&eacute;micas en universidades por el mundo y colaborador del Real Madrid para su nuevo proyecto eSports) mediante el cual proveeremos eventos f&iacute;sicos, juegos acad&eacute;micos, meteremos nuestros juegos en su programa formativo, atenderemos al p&uacute;blico menor y mayor y ,en un futuro cercano, competiciones a universidades/colegios con premios patrocinados por sus marcas. Por supuesto, todas las competiciones de menores ser&aacute;n provistas con nuestra moneda gratu&iacute;ta GGs.
// 												  Un gran paso para eGoGames en nuestro discurso de valores y educacional de los eSports.
// En relaci&oacute;n a los otros temas (Prisa, Samsung, LaLiga, Atresmedia, Besoccer) que os vamos adelantando ,como en su d&iacute;a hicimos con Global eSports Academy, os iremos notificando de la misma manera.
// 												</div>
// 											  </td>
// 											</tr>

// 											<tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
// 											  <td>
// 												<div class="small" style="float: left;width: 30%; text-align: center;">
// 												  <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">LANZAMIENTO</div>
// 												  <div style="max-width: 80px;margin: auto;">
// 													<img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/check6.png" alt="lanzamiento">
// 												  </div>
// 												</div>

// 												<div class="big" style="width: 70%;float: left;">
// 												  La pol&iacute;tica de Google Store no acepta nada que tenga que ver con premios en dinero real; ya sean eSports o negocios de juego online. De todas formas, estamos tratando de la mano de los responsables de Google Play, poder proveer nuestros juegos en su store desde Espa&ntilde;a y sobretodo para las zonas geogr&aacute;ficas que nos dicen que ayudar&iacute;an directamente; que son Reino Unido, Francia e Irlanda (os iremos informando).  Mientras tanto seguimos como todos los negocios eSports (Fortnite el m&aacute;s conocido) proveyendo la descarga directa de nuestros juegos en dispositivos android v&iacute;a nuestra web (o Samsung store). En cuanto a IOS estamos a la espera de que Apple nos publique dentro de su proceso normal que suele tardar entre una y dos semanas.
// 												</div>
// 											  </td>
// 											</tr>
// 										  </table>
// 										</td>
// 									  </tr>
// 									</table>

// 								  </td>

// 								</tr>

// 								<tr>

// 								  <td bgcolor="#ffffff" style="padding-top:10px;">

// 									<table border="0" cellpadding="0" cellspacing="0" width="100%">

// 									  <tr>

// 										<td>

// 										  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top:30px;">
// 											<tr>
// 											  <td width="33%" valign="top" style="padding-top: 6px;" class="hr-mobile">
// 												<hr style="border: 1px solid #006aaa;"/>
// 											  </td>
// 											  <td width="33%"  valign="top" style="text-align:center;">
// 												<img src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/egogames.png" alt="eGo Games" width="155" height="23" />
// 											  </td>
// 											  <td width="33%" valign="top" style="padding-top: 6px;" class="hr-mobile">
// 												<hr style="border: 1px solid #006aaa;"/>
// 											  </td>
// 											</tr>
// 										  </table>
// 										</td>
// 									  </tr>
// 									  <tr>
// 										<td bgcolor="#1e477d" style="height: 200px;background: url(https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/egobackground-covering.png)">
// 										  <table class="direccion-mobile" border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #fff;margin-top: 0px;padding-top: 60px;padding-left: 60px;padding-right: 60px;padding-bottom: 15px;font-size: 14px;">
// 											<tr>
// 											  <td width="44%" valign="top" class="direccion-mobile">
// 												<p>
// 												  <span style="font-weight:900;font-size:18px;">eGo Games</span><br />
// 												  Avenida Fuencarral 44 <br />
// 												  Edificio 4B Loft 15 <br />
// 												  Madrid, Spain
// 												</p>
// 											  </td>
// 											  <td width="2%" class="separator"></td>
// 											  <td width="44%" valign="top" class="direccion-mobile">
// 												<table align="right" border="0" style="margin-top:-10px;" class="direccion-mobile">
// 												  <tr>
// 													<td>
// 													  <p style="margin-left:20px;margin-bottom:0;">
// 														<a target="_blank" href="https://www.facebook.com/egogamesESP/"><img width="25" alt="facebook" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/facebook.png" /></a>
// 														<a target="_blank" href="https://twitter.com/eGoGamesESP"><img width="25" alt="instagram" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/instagram.png" /></a>
// 														<a target="_blank" href="https://twitter.com/eGoGamesESP"><img width="25" alt="twitter" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/twitter.png" /></a>
// 														<a target="_blank" href="https://www.linkedin.com/company/egogames/"><img width="25" alt="linkedin" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/linkedin.png" /></a>
// 														<br />
// 														<a target="_blank" href="mailto:alvaro9@egogames@outlook.com"><img width="25" alt="skype" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/skype.png" /></a>
// 														<a target="_blank" href="https://www.youtube.com/user/eGogamesEsp"><img width="25" alt="youtube" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/youtube.png" /></a>
// 														<a target="_blank" href="https://www.twitch.tv/egogamesesp"><img width="25" alt="twitch" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/twitch.png" /></a>
// 														<a target="_blank" href="https://www.mobcrush.com/eGogamesesp"><img width="25" alt="mobcrush" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/mobcrush.png" /></a>
// 													  </p>
// 													</td>
// 												  </tr>
// 												  <tr>
// 													  <td style="font-size: 14px;text-align: right;" class="direccion-mobile">
// 														<a style="color:#fff;"  target="_blank"  href="http://www.egogames.com">www.egogames.com</a>
// 													  </td>
// 												  </tr>
// 												</table>
// 											  </td>
// 											</tr>
// 														  </table>
// 										</td>
// 									  </tr>
// 									  <tr>
// 										<td bgcolor="#1e477d" style="color: #fff;font-size: 10px!important;text-align: center;padding: 10px;">
// 										  <p style="line-height:14px;text-align:left;" class="direccion-mobile">
// 											Copyright &copy; 2018 eGo Games. All rights reserved. <br/>
// 											<a style="color:#fff;" target="_blank" href="https://www.egogames.com/pol%C3%ADtica-de-privacidad">Pol&iacute;tica de privacidad</a> y <a style="color:#fff;" href="https://www.egogames.com/terminos-y-condiciones">T&eacute;rminos y condiciones.</a>
// 											<br />
// 											Recibes este correo porque has creado una cuenta en eGo Games. <br/>
// 										  </p>
// 										</td>
// 												  </tr>
// 											  </table>
// 										  </td>
// 									  </tr>
// 							  </table>
// 							</td>
// 						  </tr>
// 						</table>
// 						</body>
// 					</html>';


	$messageContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
						<html xmlns="http://www.w3.org/1999/xhtml">
							<head>
								<style>
									.gradient:hover{
										border-bottom: 10px solid #684c24;
										background: #ac8635; /* Old browsers */
										background: -moz-linear-gradient(top, #ac8635 1%, #ac8635 51%, #ac8635 51%, #a06d0e 52%, #a47e2d 100%); /* FF3.6-15 */
										background: -webkit-linear-gradient(top, #ac8635 1%,#ac8635 51%,#ac8635 51%,#a06d0e 52%,#a47e2d 100%); /* Chrome10-25,Safari5.1-6 */
										background: linear-gradient(to bottom, #ac8635 1%,#ac8635 51%,#ac8635 51%,#a06d0e 52%,#a47e2d 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
										filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ac8635", endColorstr="#a47e2d",GradientType=0 ); /* IE6-9 */
									}
									@media screen and (max-width: 440px){
										.direccion-mobile{ padding-left: 1%!important;padding-right: 1%!important; }
									}
									@media screen and (max-width: 520px){
										.hr-mobile{ width:20% }
										.separator{ width: 0; }
										.title2{font-size: 20px!important;}
										.small, .big{width: 100%!important;float: inherit!important;}
										.small{margin-bottom: 20px;}
									}
								</style>
								<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
								<title>eGoGames - Email Inversores</title>
								<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
							</head>

							<body style="font-size: 14px;line-height:18px;font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;margin: 0; padding: 0;"><table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width:760px;font-family:-apple-system,system-ui,BlinkMacSystemFont,&quot;Segoe UI&quot;,Roboto,&quot;Helvetica Neue&quot;,Arial,sans-serif;font-size:14px;font-style:normal;font-variant-caps:normal;font-weight:normal;letter-spacing:normal;text-align:start;text-indent:0px;text-transform:none;white-space:normal;word-spacing:0px;text-decoration:none;border-spacing:0px">
								<tbody>
									<tr>
									<td><img src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/cabecera-xmas.jpg" style="width:760px;display:inline-block" class="CToWUd a6T" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 848px; top: 505px;"><div id=":3is" class="T-I J-J5-Ji aQv T-I-ax7 L3 a5q" role="button" tabindex="0" aria-label="Descargar el archivo adjunto " data-tooltip-class="a1V" data-tooltip="Descargar"><div class="aSK J-J5-Ji aYr"></div></div></div></td>
									</tr>
									<tr>
									<td>
									<table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top:30px">
									<tbody>
									<tr>
									<td width="33%" valign="top" class="m_1164411051466165659hr-mobile" style="padding-top:6px">
									<hr style="border:1px solid rgb(0,106,170)">
									</td>
									<td width="33%" valign="top" style="text-align:center"><img src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/egogames.png" alt="eGo Games" width="155" height="23" class="CToWUd"></td>
									<td width="33%" valign="top" class="m_1164411051466165659hr-mobile" style="padding-top:6px">
									<hr style="border:1px solid rgb(0,106,170)">
									</td>
									</tr>
									</tbody>
									</table>
									</td>
									</tr>
									<tr>
									<td bgcolor="#ffffff" style="padding-top:10px">
									<table border="0" cellpadding="0" cellspacing="0" width="100%">
									<tbody>
									<br>
									<tr>
									<td align="center">
									<div style="width:608px;margin:auto;padding-bottom:10px;text-align:left;line-height:20px">
									Queridos socios,
									<br>
									<br>
									En primer lugar agradeceros de nuevo la confianza depositada en el proyecto y en el equipo. Ayer por la noche recibimos el mejor regalo de navidad ESTAMOS DISPONIBLES EN EL APPLE STORE.
									<br>
									<br>
									A partir de ahora empezaremos a lanzar los juegos captados y optimizados por BadLand Publishing. A finales de esta semana nos reunimos con Genera Games, el game studio más potente a nivel nacional, para implementar nuestro conector sus juegos.
									<br>
									<br>
									El dia 28 como cada viernes os mandaremos la newsletter informándoos de todas las novedades.
									<br>
									<br>
									Muchas gracias de nuevo y que paséis una feliz noche.
									</div>
									<br>
									Equipo eGoGames</p>
									</td>
									</tr>
									<tr>
									<td bgcolor="#1e477d" style="height:200px;background-image:url(&quot;https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/bottom_xmas.jpg&quot;);background-position:initial initial;background-repeat:initial initial">
									<table class="m_1164411051466165659direccion-mobile" border="0" cellpadding="0" cellspacing="0" width="100%" style="color:rgb(255,255,255);margin-top:0px;padding:60px 60px 15px;font-size:14px">
									<tbody>
									<tr>
									<td width="44%" valign="top" class="m_1164411051466165659direccion-mobile">
									<p><span style="font-weight:900;font-size:18px">eGo Games</span><br>
									Avenida Fuencarral 44<span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><br>
									Edificio 4B Loft 15<span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><br>
									Madrid, Spain</p>
									</td>
									<td width="2%" class="m_1164411051466165659separator"></td>
									<td width="44%" valign="top" class="m_1164411051466165659direccion-mobile">
									<table align="right" border="0" class="m_1164411051466165659direccion-mobile">
									<tbody>
									<tr>
									<td>
									<p style="margin-left:20px;margin-bottom:0px"><a href="https://www.facebook.com/egogamesESP/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/egogamesESP/&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNH03rUbIta9XoToQN9oFOGTnvoLhQ"><img width="25" alt="facebook" src="https://ci6.googleusercontent.com/proxy/SkY3kEOdRS_hdtgzCQAen-cgoOfTzzs6Ek_ENDy1pP8-ArgZxbvw9TAwBb1pwNT607bxNR6SqkpHL1Ck_Wi8aAyKZ3YgkVPsUBoM3-XQ8cVtLodnFT1vLbWv=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/facebook.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a href="https://twitter.com/eGoGamesESP" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/eGoGamesESP&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNELpgRq6HFMZGFPA8oas4YMqMdP7Q"><img width="25" alt="instagram" src="https://ci6.googleusercontent.com/proxy/qSvQyR5JskxOuSy-sMbCNhj4A7eYM80sCbE1tHMfPn4UFUIWa9Q-hCP3d6VjCVt2eATTY84JwTzJusoA11gKVoZy5Or-aTf3_3n0nF4N8YS27DptSA50hfNaqQ=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/instagram.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a href="https://twitter.com/eGoGamesESP" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://twitter.com/eGoGamesESP&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNELpgRq6HFMZGFPA8oas4YMqMdP7Q"><img width="25" alt="twitter" src="https://ci6.googleusercontent.com/proxy/0OtkB2snrzLZ2a5tmgeVBY8I3JL0QMD-kpqI1xiYg9HHLvWFtUDR8DxOv2JzMCO79mFBkPoXhe6hXrcwQgZsf-YyVVavLm4GFxrA5KJKnZDK5ed9pNsI7Yw=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/twitter.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a href="https://www.linkedin.com/company/egogames/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.linkedin.com/company/egogames/&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNEy13IVfJESDhEVvryHZ4UPTK8qmg"><img width="25" alt="linkedin" src="https://ci4.googleusercontent.com/proxy/MPfUQ2_WMpgCORTX5XtbTYSGVcm_6uILCqTN5cThBQ8nWVYnEwLsUvY4iqdI2w8MsiJ33CibDICFICAz0o_S6wUE-Pz62PSF7QGz6h4EVeEkeobcGg2rYTZi=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/linkedin.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><br>
									<a href="mailto:alvaro9@egogames@outlook.com" target="_blank"><img width="25" alt="skype" src="https://ci4.googleusercontent.com/proxy/J06hWWEjN8nyZsGvsW2YE96R3MQFzd58NiKCUBQL7Tvv2fjjWVnzHwm5gYGe3KBbPKqD5Cj1NWABxmdxyMO6ETl2A8rLSs7Xgai-hBLTOFF7k2ExCuWq=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/skype.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a href="https://www.youtube.com/user/eGogamesEsp" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.youtube.com/user/eGogamesEsp&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNHTrPjHzvuK989dLQN8MLovqUVA9g"><img width="25" alt="youtube" src="https://ci4.googleusercontent.com/proxy/9StyzpqEBH9VOx42gLBnrAaAD5tVcAWeWqXS33hjzUuUqef5n6ZkQyk-XLbZSKQLMb8-c1ys1aR-7dtQEXTxI_Dy6LLb5YzGTrD7H3CKh0nJ_TtuqzTmh_A=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/youtube.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a href="https://www.twitch.tv/egogamesesp" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.twitch.tv/egogamesesp&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNE_zqVEpiW092ABRsdG1yZMG7dGeg"><img width="25" alt="twitch" src="https://ci4.googleusercontent.com/proxy/9v8Xe0rtpA6lEcKBnGIJiQyryhgyRJXfc5Xpt5YbzqOq06QGBOGgztq9qjypYWal1e9Wl4rr9urQTCeRs5WPWfpaPKA-a5_esC3o1_GfQ4s53FhpVoHBpA=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/twitch.png" class="CToWUd"></a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a href="https://www.mobcrush.com/eGogamesesp" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.mobcrush.com/eGogamesesp&amp;source=gmail&amp;ust=1545749158590000&amp;usg=AFQjCNEg0KHZTxllfchjtg8XnjvZb-64xw"><img width="25" alt="mobcrush" src="https://ci5.googleusercontent.com/proxy/93We-SeHcOVA-P62DVnzkFR5j8zBJK1q1f5s5yrEeIHWFLsl82PAbMXbn67JWcjCabiGuQoGm8yNR1MbaPAdBwkga3K86wUBGOKJmI_X4pEZI3QUZLvdmXmZ=s0-d-e1-ft#https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/mobcrush.png" class="CToWUd"></a></p>
									</td>
									</tr>
									<tr>
									<td class="m_1164411051466165659direccion-mobile" style="font-size:14px;text-align:right"><a href="http://www.egogames.es/" style="color:rgb(255,255,255)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.egogames.es/&amp;source=gmail&amp;ust=1545749158591000&amp;usg=AFQjCNFR9AxxCa_v4VlgBydfevmvmPWMIw">www.egogames.es</a></td>
									</tr>
									</tbody>
									</table>
									</td>
									</tr>
									</tbody>
									</table>
									</td>
									</tr>
									<tr>
									<td bgcolor="#1e477d" style="color:rgb(255,255,255);text-align:center;padding:10px;font-size:10px!important">
									<p class="m_1164411051466165659direccion-mobile" style="line-height:14px;text-align:left">Copyright © 2018 eGo Games. All rights reserved.<span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><br>
									<a href="http://www.egogames.es/" style="color:rgb(255,255,255)" target="_blank" data-saferedirecturl="https://www.google.com/url?q=http://www.egogames.es/&amp;source=gmail&amp;ust=1545749158591000&amp;usg=AFQjCNFR9AxxCa_v4VlgBydfevmvmPWMIw">Política de privacidad</a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span>y<span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><a style="color:rgb(255,255,255)">Términos
									 y condiciones.</a><span class="m_1164411051466165659Apple-converted-space">&nbsp;</span><br>
									</p>
									</td>
									</tr>
									</tbody>
									</table>
									</td>
									</tr>
									</tbody>
								</table>
							</body>
						</html>';

	for($i = 0; $i < count($emailLis); $i++) {
		$mail = new PHPMailer();
		$mail->isSMTP(true); // telling the class to use SMTP
		$mail->SMTPOptions = array(
			'ssl' => array(
				'verify_peer' => false,
				'verify_peer_name' => false,
				'allow_self_signed' => true
			)
		);
		$mail->SMTPSecure = 'tls';
		$mail->Host = 'smtp.gmail.com';
		$mail->Port = 587;
		$mail->SMTPAuth = true;
		$mail->Username = 'egogamesnewsletter@gmail.com';
		$mail->Password = 'egogames2018';
		$mail->setFrom('egogamesnewsletter@gmail.com');
		$mail->FromName = 'eGoGames';
		$mail->AddAddress($emailLis[$i]);
		$mail->Subject = "Newsletter Socios";
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();

		echo '<br>Mailer OK:'.$emailLis[$i].$mail->ErrorInfo;
	}
?>
