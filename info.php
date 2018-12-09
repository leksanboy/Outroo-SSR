<?php 
	// // *Email sender
	// require '/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php';

	// $emailLis = array('orafalskyy@egogames.es', 'carlossainz55@saivamanagement.com', 'carlosonoro@saivamanagement.com', 'pacoriberas96@hotmail.com', 'jaimedeanta@gmail.com', 'j.guerola.gonzalvez@pwc.com', 'pedro@serrahima.org', 'fernan@llantada.net', 'alex@cubanam.com', 'sergio.lucia@telefonica.net', 'dakota.50@telefonica.net', 'bsanchez@akela.com.es', 'maria@llantada.net', 'jmlaborda@egogames.es', 'marcos@madlions.com', 'jcabezas@egogames.es', 'bsanchez@egogames.es', 'baldomerosanchez19@gmail.com', 'ssauca@egogames.es', 'asaez@egogames.es', 'arodriguez@egogames.es');

	// // $emailLis = array('baldomerosanchez19@gmail.com', 'orafalskyy@egogames.es', 'bsanchez@egogames.es', 'jcabezas@egogames.es');

	// for($i = 0; $i < count($emailLis); $i++) {
	// 	$messageContent = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
	// 		<html xmlns="http://www.w3.org/1999/xhtml">
	// 		 	<head>
	// 				<style>
	// 					.gradient:hover{
	// 						/* Permalink - use to edit and share this gradient: http://colorzilla.com/gradient-editor/#ac8635+1,ac8635+51,ac8635+51,a06d0e+52,a47e2d+100 */
	// 						border-bottom: 10px solid #684c24;
	// 						background: #ac8635; /* Old browsers */
	// 						background: -moz-linear-gradient(top, #ac8635 1%, #ac8635 51%, #ac8635 51%, #a06d0e 52%, #a47e2d 100%); /* FF3.6-15 */
	// 						background: -webkit-linear-gradient(top, #ac8635 1%,#ac8635 51%,#ac8635 51%,#a06d0e 52%,#a47e2d 100%); /* Chrome10-25,Safari5.1-6 */
	// 						background: linear-gradient(to bottom, #ac8635 1%,#ac8635 51%,#ac8635 51%,#a06d0e 52%,#a47e2d 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	// 						filter: progid:DXImageTransform.Microsoft.gradient( startColorstr="#ac8635", endColorstr="#a47e2d",GradientType=0 ); /* IE6-9 */
	// 					}
	// 					@media screen and (max-width: 440px){
	// 						.direccion-mobile{ padding-left: 1%!important;padding-right: 1%!important; }
	// 					}
	// 					@media screen and (max-width: 520px){
	// 						.hr-mobile{ width:20% }
	// 						.separator{ width: 0; }
	// 		        .title2{font-size: 20px!important;}
	// 		        .small, .big{width: 100%!important;float: inherit!important;}
	// 		        .small{margin-bottom: 20px;}
			        
	// 					}
	// 				</style>
	// 				<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
	// 				<title>eGo Games - Email Inversores</title>
	// 				<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
	// 			</head>
	// 			<body style="font-size: 14px;line-height:18px;background-color:#163757;font-family: -apple-system,system-ui,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,sans-serif;margin: 0; padding: 0;">
	// 				<table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-spacing: 0;">
	// 					<tr>
	// 						<td>
	// 					    <table style="border-spacing: 0;max-width:760px;border-collapse: collapse;box-shadow: 6px 0px 11px 2px #0000009e;background-color: #dedede;" align="center" border="0" cellpadding="0" cellspacing="0">
	// 		            <tr>
	// 		              <td style="width: 100%;">
	// 		                <img style="width: 100%;display: inline-block;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/cabecera-nl-inversores.png" alt="cabecera">
	// 		              </td>
	// 		            </tr>
	// 		            <tr>
	// 		              <td>
	// 		                <table style="width: 100%;padding: 30px;border-spacing: 0;">
	// 		                  <tr>
	// 		                    <td>
	// 		                      <span style="font-weight: bold;font-size: 18px;">Estimados socios,</span>
	// 		                    </td>
	// 		                    <td>
	// 		                      <span style="float: right;font-weight: bold;font-size: 18px;color: #003044;text-decoration: underline;">07/12/2018</span>
	// 		                    </td>
	// 		                  </tr>
	// 		                  <tr>
	// 		                    <td colspan="2">
	// 		                      <p>
	// 		                        Os mandamos nuestra tercera newsletter en la que plasmaremos todos los detalles de la plataforma para vuestro conocimiento de cara a la integraci&oacute;n en juegos de terceros y a su inminente publicaci&oacute;n en las Stores de m&oacute;vil.
	// 		                      </p>
	// 		                      <div>
	// 		                        <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/banner-mobile.png" alt="banner">
	// 		                      </div>
	// 		                    </td>
	// 		                  </tr>
	// 		                </table>
	// 		                <table style="width: 100%;border-spacing: 0;">
	// 		                  <tr>
	// 		                    <td style="border-spacing: 0;">
	// 		                      <div style="background: #81adc6;width: 100%;text-align: center;padding: 10px 0;font-weight: bold;font-size: 30px;color: #fff;">
	// 		                        <p class="title2" style="margin: 0;">NOTICIAS FIJAS</p>
	// 		                      </div>
	// 		                    </td>
	// 		                  </tr>
	// 		                  <tr>
	// 		                    <td>
	// 		                      <table style="background: #fff;width: 100%;">
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">MARKETING</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/mkt-com.png" alt="mkt">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              Esta semana damos fechas de lanzamiento de nuestras campa&ntilde;as de eventos en vivo modalidad Q12 para captar streamers y generadores de contenido para la plataforma. El martes/mi&eacute;rcoles reactivamos nuestros mensajes en redes. 
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">PRODUCTO</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/producto.png" alt="producto">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              Tenemos las pasarelas de pago de PayPal y Addon Payments (La Caixa) para mayor facilidad de ingreso de dinero para el usuario. En cuanto a la retirada (pago de premios) proveemos el servicio PayPal para cubrir a todos los usuarios independientemente de d&oacute;nde se encuentren por el mundo.
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">JUEGOS</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/juegos.png" alt="juegos">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              El lunes podr&eacute;is descargar las &uacute;ltimas versiones de 3 de nuestros juegos (eGoPong, eGoMonkeys y eGoDarts) desde nuestra p&aacute;gina web para todos los dispositivos Android.  Durante la semana iremos subiendo a nuestra web los siguientes juegos creados por eGoGames.
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">LEGAL/FISCAL</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/legal.png" alt="legal">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              Vamos a implementar la tecnolog&iacute;a blockchain para el registro de partidas y contabilidad interna de la empresa. A trav&eacute;s de estas tecnolog&iacute;as proveeremos el pago del IVA y las retenciones aplicadas a los jugadores con el fin de dotar de una total transparencia a nuestro funcionamiento.
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                      </table>
	// 		                    </td>
	// 		                  </tr>
	// 		                </table>
	// 		                <table style="width: 100%;border-spacing: 0;">
	// 		                  <tr>
	// 		                    <td style="border-spacing: 0;">
	// 		                      <div style="background: #81adc6;width: 100%;text-align: center;padding: 10px 0;font-weight: bold;font-size: 30px;color: #fff;">
	// 		                        <p class="title2" style="margin: 0;">NOVEDADES SEMANALES</p>
	// 		                      </div>
	// 		                    </td>
	// 		                  </tr>
	// 		                  <tr>
	// 		                    <td>
	// 		                      <table style="background: #fff;width: 100%;">
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">PARTNERSHIPS</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/check5.png" alt="partnerships">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              Esta semana hemos visitado atresmedia y hemos pasado directamente a la segunda fase interesados en colaborar con eGoGames. Seguimos recibiendo noticias positivas de Prisa, Samsung-liga, Global eSports Academy y a&ntilde;adimos a Besoccer.
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">LANZAMIENTO</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/check6.png" alt="lanzamiento">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              El lunes empezamos la subida a la Apple Store de nuestros tres juegos disponibles para dispositivos Android en la web y tenemos la &quot;call&quot; con los encargados de la store de Google. Nuestra idea es tenerlo en las tres stores: Samsung, Apple (ya confirmados) y Google (os iremos actualizando). De todas formas nos gustar&iacute;a reiterar que siempre se podr&aacute;n descargar para cualquier dispositivo Android, nuestros juegos a trav&eacute;s de la web.
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">SOCIOS</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/check7.png" alt="junta">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              <p style="margin-top: 0;">Esta semana como ya sab&eacute;is daremos la bienvenida a un grupo selecto de socios que nos ayudar&aacute;n a conseguir proyectos y cubrir necesidades de la empresa.</p>
	// 		                              <p>Estamos en proceso de mandar a Patricia Manca nuestra l&iacute;der legal y secretaria del consejo de administraci&oacute;n; los actas que todos hab&eacute;is firmado y as&iacute; celebrar nuestra primera junta de socios donde haremos oficial su nombramiento como secretaria.</p>
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                        <tr style="padding: 20px;border-bottom: 1px solid #ccc;display: block;">
	// 		                          <td>
	// 		                            <div class="small" style="float: left;width: 30%; text-align: center;">
	// 		                              <div class="title" style="font-size: 20px;color: #006ca7;font-weight: bold;margin-bottom: 20px;">JUEGOS</div>
	// 		                              <div style="max-width: 80px;margin: auto;">
	// 		                                <img style="width: 100%;" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/check8.png" alt="junta">
	// 		                              </div>
	// 		                            </div>
	// 		                            <div class="big" style="width: 70%;float: left;">
	// 		                              El martes firmamos con los respectivos Game Studios y juegos que iremos anunciando como ya comentamos de la mano de nuestros partners Badland y la DEV. Ya tenemos los contratos preparados y el conector con ambas pasarelas de pago integradas.
	// 		                            </div>
	// 		                          </td>
	// 		                        </tr>
	// 		                      </table>
	// 		                    </td>
	// 		                  </tr>
	// 		                </table>
	// 		              </td>
	// 		            </tr>
	// 		            <tr>
	// 		              <td bgcolor="#ffffff" style="padding-top:10px;">
	// 		                <table border="0" cellpadding="0" cellspacing="0" width="100%">
	// 		                  <tr>
	// 		                    <td>
	// 		                      <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding-top:30px;">
	// 		                        <tr>
	// 		                          <td width="33%" valign="top" style="padding-top: 6px;" class="hr-mobile">
	// 		                            <hr style="border: 1px solid #006aaa;"/>
	// 		                          </td>
	// 		                          <td width="33%"  valign="top" style="text-align:center;">
	// 		                            <img src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/egogames.png" alt="eGo Games" width="155" height="23" />
	// 		                          </td>
	// 		                          <td width="33%" valign="top" style="padding-top: 6px;" class="hr-mobile">
	// 		                            <hr style="border: 1px solid #006aaa;"/>
	// 		                          </td>
	// 		                        </tr>
	// 		                      </table>
	// 		                    </td>
	// 		                  </tr>
	// 		                  <tr>
	// 		                    <td bgcolor="#1e477d" style="height: 200px;background: url(https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/egobackground-covering.png)">
	// 		                      <table class="direccion-mobile" border="0" cellpadding="0" cellspacing="0" width="100%" style="color: #fff;margin-top: 0px;padding-top: 60px;padding-left: 60px;padding-right: 60px;padding-bottom: 15px;font-size: 14px;">
	// 		                        <tr>
	// 		                          <td width="44%" valign="top" class="direccion-mobile">
	// 		                            <p>
	// 		                              <span style="font-weight:900;font-size:18px;">eGo Games</span><br />
	// 		                              Avenida Fuencarral 44 <br />
	// 		                              Edificio 4B Loft 15 <br />
	// 		                              Madrid, Spain
	// 		                            </p>
	// 		                          </td>
	// 		                          <td width="2%" class="separator"></td>
	// 		                          <td width="44%" valign="top" class="direccion-mobile">
	// 		                            <table align="right" border="0" style="margin-top:-10px;" class="direccion-mobile">
	// 		                              <tr>
	// 		                                <td>
	// 		                                  <p style="margin-left:20px;margin-bottom:0;">
	// 		                                    <a target="_blank" href="https://www.facebook.com/egogamesESP/"><img width="25" alt="facebook" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/facebook.png" /></a>
	// 		                                    <a target="_blank" href="https://www.instagram.com/egogames_esp/"><img width="25" alt="instagram" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/instagram.png" /></a>
	// 		                                    <a target="_blank" href="https://twitter.com/eGoGamesESP"><img width="25" alt="twitter" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/twitter.png" /></a>
	// 		                                    <a target="_blank" href="https://www.linkedin.com/company/egogames/"><img width="25" alt="linkedin" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/linkedin.png" /></a>
	// 		                                    <br />
	// 		                                    <a target="_blank" href="mailto:alvaro9@egogames@outlook.com"><img width="25" alt="skype" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/skype.png" /></a>
	// 		                                    <a target="_blank" href="https://www.youtube.com/user/eGogamesEsp"><img width="25" alt="youtube" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/youtube.png" /></a>
	// 		                                    <a target="_blank" href="https://www.twitch.tv/egogamesesp"><img width="25" alt="twitch" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/twitch.png" /></a>
	// 		                                    <a target="_blank" href="https://www.mobcrush.com/eGogamesesp"><img width="25" alt="mobcrush" src="https://s3-eu-west-1.amazonaws.com/egogames-repo/mails/img/mobcrush.png" /></a>
	// 		                                  </p>
	// 		                                </td>
	// 		                              </tr>
	// 		                              <tr>
	// 		                                  <td style="font-size: 14px;text-align: right;" class="direccion-mobile">
	// 		                                    <a style="color:#fff;"  target="_blank"  href="http://www.egogames.com">www.egogames.com</a>
	// 		                                  </td>
	// 		                              </tr>
	// 		                            </table>
	// 		                          </td>
	// 		                        </tr>
	// 										      </table>
	// 		                    </td>
	// 		                  </tr>
	// 		                  <tr>
	// 		                    <td bgcolor="#1e477d" style="color: #fff;font-size: 10px!important;text-align: center;padding: 10px;">
	// 		                      <p style="line-height:14px;text-align:left;" class="direccion-mobile">
	// 		                        Copyright &copy; 2018 eGoGames. All rights reserved. <br/>
	// 		                        <a style="color:#fff;" target="_blank" href="https://www.egogames.com/pol%C3%ADtica-de-privacidad">Pol&iacute;tica de privacidad</a> y <a style="color:#fff;" href="https://www.egogames.com/terminos-y-condiciones">T&eacute;rminos y condiciones.</a>
	// 		                        <br />
	// 		                        Recibes este correo porque has creado una cuenta en eGoGames. <br/>
	// 		                      </p>
	// 		                    </td>
	// 								      </tr>
	// 							      </table>
	// 						      </td>
	// 					      </tr>
	// 		          </table>
	// 		        </td>
	// 		      </tr>
	// 		    </table>
	// 			</body>
	// 		</html>';

	// 	$mail = new PHPMailer();
	// 	$mail->isSMTP(true); // telling the class to use SMTP
	// 	$mail->SMTPOptions = array(
	// 		'ssl' => array(
	// 			'verify_peer' => false,
	// 			'verify_peer_name' => false,
	// 			'allow_self_signed' => true
	// 		)
	// 	);
	// 	$mail->SMTPSecure = 'tls';
	// 	$mail->Host = 'smtp.gmail.com';
	// 	$mail->Port = 587;
	// 	$mail->SMTPAuth = true;
	// 	$mail->Username = 'egogamesnewsletter@gmail.com';
	// 	$mail->Password = 'egogames2018';
	// 	$mail->setFrom('egogamesnewsletter@gmail.com');
	// 	$mail->FromName = 'eGoGames';
	// 	$mail->AddAddress($emailLis[$i]);
	// 	$mail->Subject = "Newsletter Socios";
	// 	$mail->IsHTML(true);
	// 	$mail->Body = $messageContent;
	// 	$mail->Send();

	// 	echo '<br>Mailer OK:'.$emailLis[$i].$mail->ErrorInfo;
	// }
?>
