<?php
	// Email sender service
	require '/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php';

	// Register "Welcome"
	function emailWelcome($email, $lang, $name, $hash) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'Welcome to Outroo '.$name.', please confirm your email',
				'title'			=> 'Welcome',
				'hello'			=> 'Hello <b>'.$name.'</b>, thanks for creating an account. Follow other people, search an amazing songs and share your photos and videos with the rest of comunity.',
				'confirm'		=> 'Confirm your email address <b>'.$email.'</b>, click on the button below.',
				'button'		=> 'Confirm email address'
			),
			'es' => array(
				'subject' 		=> 'Bienvenido a Outroo'.$name.', por favor, confirma tu email',
				'title'			=> 'Bienvenido',
				'hello'			=> 'Hola <b>'.$name.'</b>, gracias por crear la cuenta. Sigue a otras personas, busca increíbles canciones y comparte tus fotos y videos con el resto de la comunidad.',
				'confirm'		=> 'Confirma tu dirección de correo electrónico <b>'.$email.'</b>, haz click en el siguiente botón.',
				'button'		=> 'Confirmar correo electrónico'
			),
			'ru' => array(
				'subject' 		=> 'Добро пожаловать в Outroo'.$name.', пожалуйста подтвердите свою электронную почту',
				'title'			=> 'Добро пожаловать',
				'hello'			=> 'Здравствуйте <b>'.$name.'</b>, спасибо за создание аккаунта. Следите за другими людьми, находите потрясающие песни и делитесь своими фотографиями и видео с остальным сообществом.',
				'confirm'		=> 'Подтвердите ваш электронный адрес <b>'.$email.'</b>, нажмите на кнопку ниже.',
				'button'		=> 'Подтвердить электронный адрес'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['hello'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['confirm'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:12px 5% 18px;">
																			<a href="'.$urlWeb.'confirm-email/'.$hash.'" style="padding:10px 14px;text-decoration:none;background:#2196f3;color:#ffffff;border-radius:5px;font:300 15px/14px Arial,Helvetica,sans-serif;">
																				<nowrap>
																					'.$translations['button'].'
																				</nowrap>
																			</a>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Register "Welcome"
	function emailWelcomeSocial($email, $lang, $name, $hash, $password) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'Welcome to Outroo '.$name.', please confirm your email',
				'title'			=> 'Welcome',
				'hello'			=> 'Hello <b>'.$name.'</b>, thanks for creating an account. Follow other people, search an amazing songs and share your photos and videos with the rest of comunity.',
				'confirm'		=> 'Confirm your email address <b>'.$email.'</b>, click on the button below.',
				'button'		=> 'Confirm email address'
			),
			'es' => array(
				'subject' 		=> 'Bienvenido a Outroo'.$name.', por favor, confirma tu email',
				'title'			=> 'Bienvenido',
				'hello'			=> 'Hola <b>'.$name.'</b>, gracias por crear la cuenta. Sigue a otras personas, busca increíbles canciones y comparte tus fotos y videos con el resto de la comunidad.',
				'confirm'		=> 'Confirma tu dirección de correo electrónico <b>'.$email.'</b>, haz click en el siguiente botón.',
				'button'		=> 'Confirmar correo electrónico'
			),
			'ru' => array(
				'subject' 		=> 'Добро пожаловать в Outroo'.$name.', пожалуйста подтвердите свою электронную почту',
				'title'			=> 'Добро пожаловать',
				'hello'			=> 'Здравствуйте <b>'.$name.'</b>, спасибо за создание аккаунта. Следите за другими людьми, находите потрясающие песни и делитесь своими фотографиями и видео с остальным сообществом.',
				'confirm'		=> 'Подтвердите ваш электронный адрес <b>'.$email.'</b>, нажмите на кнопку ниже.',
				'button'		=> 'Подтвердить электронный адрес'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['hello'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['confirm'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:12px 5% 18px;">
																			<a href="'.$urlWeb.'confirm-email/'.$hash.'" style="padding:10px 14px;text-decoration:none;background:#2196f3;color:#ffffff;border-radius:5px;font:300 15px/14px Arial,Helvetica,sans-serif;">
																				<nowrap>
																					'.$translations['button'].'
																				</nowrap>
																			</a>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// New login
	function emailNewLogin($email, $lang, $name, $hash, $device, $location, $date) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'New login',
				'title'			=> 'New login',
				'device'		=> 'Device',
				'location'		=> 'Location',
				'date'			=> 'Date',
				'approx'		=> 'The location is approximate according to the IP address of the login.',
				'detect'		=> 'Hello <b>@'.$name.'</b>, we have detected a new login activity on your account.',
				'button' 		=> 'If you haven\'t done this action, your account may have been compromised and should complete a few steps to make sure your account is safe, please <a href="'.$urlWeb.'reset-password/'.$hash.'"style="color:#09f;text-decoration:none" role="link" target="_blank">Reset your password now</a>.'
			),
			'es' => array(
				'subject' 		=> 'Nuevo inicio de sesión',
				'title'			=> 'Nuevo inicio de sesión',
				'device' 		=> 'Dispositivo',
				'location' 		=> 'Ubicación',
				'date' 			=> 'Fecha',
				'approx' 		=> 'La ubicación es aproximada según la dirección IP del inicio de sesión',
				'detect' 		=> 'Hola <b>@'.$name.'</b>, hemos detectado una nueva actividad de inicio de sesión en su cuenta.',
				'button' 		=> 'Si no ha realizado esta acción, su cuenta puede haber sido comprometida y debe completar algunos pasos para asegurarse de que su cuenta esté segura, por favor <a href="'.$urlWeb.'reset-password/'.$hash.'"style="color:#09f;text-decoration:none" role="link" target="_blank">Restablezca su contraseña ahora</a>.'
			),
			'ru' => array(
				'subject' 		=> 'Новый логин.',
				'title'			=> 'Новый логин',
				'device' 		=> 'Устройство',
				'location' 		=> 'Расположение',
				'date' 			=> 'Дата',
				'approx' 		=> 'Местоположение является приблизительным в соответствии с IP-адресом для входа.',
				'detect'		=> 'Здравствуйте <b>@'.$name.'</b>, мы обнаружили новую активность входа в вашу учетную запись.',
				'button' 		=> 'Если вы не выполнили это действие, возможно, ваша учетная запись была взломана и должна выполнить несколько шагов, чтобы убедиться, что ваша учетная запись безопасна, <a href="'.$urlWeb.'reset-password/'.$hash.'"style="color:#09f;text-decoration:none" role="link" target="_blank">Восстановить пароль сейчас</a>.'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 4px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			<b>'.$translations['device'].'</b>: '.$device.'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 4px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			<b>'.$translations['location'].'</b>: '.$location.'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 4px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			<b>'.$translations['date'].'</b>: '.$date.'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:12px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['approx'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['detect'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['button'].'
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Forgot password
	function emailForgotPassword($email, $lang, $name, $hash) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'Reset your password',
				'title'			=> 'Reset password',
				'reset'			=> 'Password reset for <b>@'.$name.'</b>, click on the button below.',
				'ignore'		=> 'If you did not request this, ignore this email, your password will not be changed.',
				'notRequest'	=> 'If you didn\'t request a password reset, please',
				'contact'		=> 'contact us',
				'button' 		=> 'Reset password'
			),
			'es' => array(
				'subject' 		=> 'Restablecer su contraseña',
				'title' 		=> 'Restablecer contraseña',
				'reset' 		=> 'Restablecimiento de contraseña para <b>@'.$name.'</b>, haga clic en el botón a continuación.',
				'ignore' 		=> 'Si no has solicitado recuperar la contraseña, ignora este correo electrónico, tu contraseña no será cambiada',
				'notRequest' 	=> 'Si no has solicitado recuperar la contraseña, por favor',
				'contact' 		=> 'contacta con nosotros',
				'button' 		=> 'Restablecer contraseña'
			),
			'ru' => array(
				'subject' 		=> 'Сбросить пароль',
				'title' 		=> 'Сбросить пароль',
				'reset' 		=> 'Сброс пароля для <b>@'.$name.'</b>, нажмите кнопку ниже.',
				'ignore' 		=> 'Если вы не запрашивали восстановление пароля, игнорируйте это письмо, ваш пароль не будет изменен.',
				'notRequest' 	=> 'Если вы не запрашивали восстановление пароля, пожалуйста',
				'contact' 		=> 'свяжитесь с нами',
				'button' 		=> 'Восстановить пароль'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['reset'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 6px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['ignore'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['notRequest'].'
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				'.$translations['contact'].'
																			</a>.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:12px 5% 18px;">
																			<a href="'.$urlWeb.'reset-password/'.$hash.'" style="padding:10px 14px;text-decoration:none;background:#2196f3;color:#ffffff;border-radius:5px;font:300 15px/14px Arial,Helvetica,sans-serif;">
																				<nowrap>
																					'.$translations['button'].'
																				</nowrap>
																			</a>
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Reset password
	function emailResetPassword($email, $lang, $name, $hash) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'Your password has been changed',
				'title'			=> 'New password',
				'hello'			=> 'Hello <b>@'.$name.'</b>, you reset your password successfully.',
				'password'		=> 'Here is your new password: <b>'.$hash.'</b>',
				'notRequest'	=> 'If you didn\'t request a password reset, please',
				'contact'		=> 'contact us'
			),
			'es' => array(
				'subject' 		=> 'Restablecer su contraseña',
				'title' 		=> 'Nueva contraseña',
				'hello' 		=> 'Hola <b>@'.$name.'</b>, has restablecido tu contraseña correctamente.',
				'password' 		=> 'Aquí está tu nueva contraseña: <b>'.$hash.'</b>',
				'notRequest' 	=> 'Si no has solicitado recuperar la contraseña, por favor',
				'contact' 		=> 'contacta con nosotros'
			),
			'ru' => array(
				'subject' 		=> 'Сбросить пароль',
				'title' 		=> 'Новый пароль',
				'hello' 		=> 'Здравствуйте, <b>@'.$name.'</b>, вы успешно восстановили свой пароль.',
				'password' 		=> 'Вот ваш новый пароль: <b>'.$hash.'</b>',
				'notRequest' 	=> 'Если вы не запрашивали восстановление пароля, пожалуйста',
				'contact' 		=> 'свяжитесь с нами'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['hello'].'
																			<br>
																			'.$translations['password'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['notRequest'].'
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				'.$translations['contact'].'
																			</a>.
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Support
	function emailSupportQuestion($email, $lang, $content) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'Support',
				'title'			=> 'Your question',
				'hello'			=> 'Hello, recently we received a question from this email <b>'.$email.'</b> in support.',
				'copy'			=> 'We send you the copy of the requested question.',
				'answer'		=> 'We will answer your question as soon as possible.',
				'compromised' 	=> 'If you haven\'t done this action, your email has been compromised, do not leave your email in third-party pages.',
				'question' 		=> 'If you have any question, please',
				'contact'		=> 'contact us'
			),
			'es' => array(
				'subject' 		=> 'Soporte',
				'title' 		=> 'Tu pregunta',
				'hello' 		=> 'Hola, recientemente recibimos una pregunta de este correo electrónico <b>'.$email.'</b> en soporte.',
				'copy' 			=> 'Le hemos enviado una copia con la pregunta solicitada',
				'answer' 		=> 'Responderemos su pregunta lo antes posible',
				'compromised' 	=> 'Si no ha realizado esta acción, su correo electrónico ha sido comprometido, no lo deje en páginas de terceros.',
				'question' 		=> 'Si tiene alguna pregunta, por favor',
				'contact' 		=> 'contacta con nosotros'
			),
			'ru' => array(
				'subject' 		=> 'Служба поддержки',
				'title' 		=> 'Ваш вопрос',
				'hello' 		=> 'Здравствуйте, недавно мы получили вопрос из этой почты <b>'.$email.'</b> в службу поддержки.',
				'copy' 			=> 'Мы отправим вам копию запрошенного вопроса.',
				'answer' 		=> 'Мы ответим на ваш вопрос как можно скорее.',
				'compromised' 	=> 'Если вы не сделали этого действия, ваша электронная почта была скомпрометирована, не оставляйте вашу электронную почту на сторонних страницах.',
				'question' 		=> 'Если у вас есть вопросы, пожалуйста',
				'contact' 		=> 'свяжитесь с нами'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>

																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['hello'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['copy'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			"<b>'.$content.'</b>"
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['answer'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['compromised'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['question'].'
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				'.$translations['contact'].'
																			</a>.
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Report
	function emailReport($email, $lang, $content) {
		$translations  = array(
			'en' => array(
				'subject'		=> 'Report',
				'title'			=> 'Report',
				'hello'			=> 'Hello, recently we received a report from this email <b>'.$email.'</b> in support.',
				'copy'			=> 'We send you the copy of the report.',
				'measure'		=> 'We will take the necessary measures to resolve this matter.',
				'question' 		=> 'If you have any question, please',
				'contact'		=> 'contact us'
			),
			'es' => array(
				'subject' 		=> 'Reporte',
				'title' 		=> 'Reporte',
				'hello' 		=> 'Hola, recientemente recibimos un reporte de este correo electrónico <b>'.$email.'</b> en soporte.',
				'copy' 			=> 'Le hemos enviado una copia con el reporte.',
				'measure'		=> 'Tomaremos las medidas ncesarias para resolver este asunto.',
				'question' 		=> 'Si tiene alguna pregunta, por favor',
				'contact' 		=> 'contacta con nosotros'
			),
			'ru' => array(
				'subject' 		=> 'Рапорт',
				'title' 		=> 'Рапорт',
				'hello' 		=> 'Здравствуйте, недавно мы получили рапорт из этой почты <b>'.$email.'</b> в службу поддержки.',
				'copy' 			=> 'Мы отправим вам копию рапорта.',
				'measure'		=> 'Мы примем необходимые меры для решения этого вопроса.',
				'question' 		=> 'Если у вас есть вопросы, пожалуйста',
				'contact' 		=> 'свяжитесь с нами'
			)
		);

		if ($lang == 1) {
			$translations = $translations['en'];
		} else if ($lang == 2) {
			$translations = $translations['es'];
		} else if ($lang == 3) {
			$translations = $translations['ru'];
		} else {
			$translations = $translations['en'];
		}

		$urlWeb = 'https://outroo.com/';
		$nameWeb = 'Outroo';
		$messageContent = '<div style="background-color:#fff">
									<div id="left-align" dir="ltr" style="max-width:760px;margin:0 auto;">
										<div id="main">
											<div id="logo-row-box" style="width:95%;text-align:right;padding:5% 0;">
												<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
													<img id="logo-in-row-box" src="'.$urlWeb.'assets/images/icons/round/icon-72x72.png" style="display:inline-block;height:32px;width:32px">
												</a>
											</div>
											<table id="message-body-wrapper" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="message-body">
															<table id="paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
																<tbody>
																	<tr>
																		<td id="title" style="padding:0 5% 24px;font:18px/12px Arial,Helvetica,sans-serif;font-weight:bold;text-transform:uppercase;color:#333">
																			'.$translations['title'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['hello'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['copy'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			"<b>'.$content.'</b>"
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			'.$translations['measure'].'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			'.$translations['question'].'
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				'.$translations['contact'].'
																			</a>.
																		</td>
																	</tr>
																</tbody>
															</table>
														</td>
													</tr>
												</tbody>
											</table>
										</div>
										<footer style="width:100%; margin: 0;">
											<table id="footer-paragraphs" border="0" cellpadding="0" cellspacing="0" style="width:100%;">
												<tbody>
													<tr>
														<td id="footer-links" style="padding:12px 0 0;text-align:center;font:12px/15px Arial,Helvetica,sans-serif;color:#999">
															<a href="'.$urlWeb.'about" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																About
															</a>
															<a href="'.$urlWeb.'privacy" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Privacy
															</a>
															<a href="'.$urlWeb.'support" style="padding:0 3px;color:#777;text-decoration:none;font-weight:bold;" role="link" target="_blank">
																Support
															</a>
														</td>
													</tr>
													<tr>
														<td id="copyright-cell" style="padding:6px 0 0;margin-bottom:0;text-align:center;font:11px/15px Arial,Helvetica,sans-serif;;font-weight:bold;color:#999">
															© '.date("Y").' '.$nameWeb.'
														</td>
													</tr>
												</tbody>
											</table>
										</footer>
									</div>
								</div>';

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
		$mail->CharSet = 'utf-8';
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}
?>
