<?php
	// Email sender service
	require '/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php';

	// Register "Welcome"
	function emailWelcome($email, $lang, $name, $hash) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> $name.', welcome to Beatfeel, please confirm your email',
				'title'			=> 'Welcome',
				'hello'			=> 'Hello <b>'.$name.'</b>, thanks for creating an account. Follow other people, search an amazing songs and share your photos and videos with the rest of comunity.',
				'confirm'		=> 'Confirm your email address <b>'.$email.'</b>, click on the button below.',
				'button'		=> 'Confirm email address',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> $name.', bienvenido a Beatfeel, por favor, confirma tu email',
				'title'			=> 'Bienvenido',
				'hello'			=> 'Hola <b>'.$name.'</b>, gracias por crear la cuenta. Sigue a otras personas, busca increíbles canciones y comparte tus fotos y videos con el resto de la comunidad.',
				'confirm'		=> 'Confirma tu dirección de correo electrónico <b>'.$email.'</b>, haz click en el siguiente botón.',
				'button'		=> 'Confirmar correo electrónico',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> $name.', добро пожаловать в Beatfeel, пожалуйста подтвердите свою электронную почту',
				'title'			=> 'Добро пожаловать',
				'hello'			=> 'Здравствуйте <b>'.$name.'</b>, спасибо за создание аккаунта. Следите за другими людьми, находите потрясающие песни и делитесь своими фотографиями и видео с остальным сообществом.',
				'confirm'		=> 'Подтвердите ваш электронный адрес <b>'.$email.'</b>, нажмите на кнопку ниже.',
				'button'		=> 'Подтвердить электронный адрес',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
								<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
									<div>
										<div style="text-align: right; padding: 18px 0 6px;">
											<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
												<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
											</a>
										</div>
										<table cellpadding="0" cellspacing="0" style="width: 100%;">
											<tbody>
												<tr>
													<td>
														<table cellpadding="0" cellspacing="0" style="width:100%;">
															<tbody>
																<tr>
																	<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																		'.$translations['title'].'
																	</td>
																</tr>
																<tr>
																	<td style="padding: 0 0 18px; font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																		'.$translations['hello'].'
																	</td>
																</tr>
																<tr>
																	<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #999;">
																		'.$translations['confirm'].'
																	</td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
												<tr> 
													<td>
														<a href="'.$urlWeb.'confirm-email/'.$hash.'" target="_blank" style="background: #2196f3; color:#fff; font: bold 13px/17px Arial,Helvetica,sans-serif; border-radius:5px; text-decoration:none; text-align:center; padding:12px 0; margin: 12px 0 0; width:100%; display: block;">
															'.$translations['button'].'
														</a>
													</td> 
												</tr>
											</tbody>
										</table>
									</div>
									<footer style="width:100%; margin: 18px 0;">
										<table cellpadding="0" cellspacing="0" style="width:100%;">
											<tbody>
												<tr>
													<td>
														<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
															<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														'.$translations['info'].'
													</td>
												</tr>
												<tr>
													<td style="padding: 12px 0; color: #999;">
														<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['about'].'
														</a>
														<br>
														<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['privacy'].'
														</a>
														<br>
														<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['support'].'
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Register "Welcome Google/Facebook"
	function emailWelcomeSocial($email, $lang, $name, $hash, $password, $source) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> $name.' welcome to '.$nameWeb,
				'title'			=> 'Welcome',
				'hello'			=> 'Hello <b>'.$name.'</b>, thanks for creating an account. Follow other people, search an amazing songs and share your photos and videos with the rest of comunity.',
				'source'		=> 'You can continue to log in with your '.ucfirst($source).' account and we are also going to provide you with the account is own access data.',
				'email'			=> 'Email: <b>'.$email.'</b>',
				'password'		=> 'Contraseña: <b>'.$password.'</b>',
				'question' 		=> 'If you have any question, please',
				'contact'		=> 'contact us',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> $name.' bienvenido a '.$nameWeb,
				'title'			=> 'Bienvenido',
				'hello'			=> 'Hola <b>'.$name.'</b>, gracias por crear la cuenta. Sigue a otras personas, busca increíbles canciones y comparte tus fotos y videos con el resto de la comunidad.',
				'source'		=> 'Puede seguir logandose con su cuenta de '.ucfirst($source).' y tambien le vamos a proporcionar los datos de acceso propios de la cuenta.',
				'email'			=> 'Email: <b>'.$email.'</b>',
				'password'		=> 'Password: <b>'.$password.'</b>',
				'question' 		=> 'Si tiene alguna pregunta, por favor',
				'contact' 		=> 'contacta con nosotros',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> $name.' добро пожаловать в '.$nameWeb,
				'title'			=> 'Добро пожаловать',
				'hello'			=> 'Здравствуйте <b>'.$name.'</b>, спасибо за создание аккаунта. Следите за другими людьми, находите потрясающие песни и делитесь своими фотографиями и видео с остальным сообществом.',
				'source'		=> 'Вы можете продолжить вход со своей учетной записью на '.ucfirst($source).' и мы также собираемся предоставить вам учетную запись - это собственные данные для доступа.',
				'email'			=> 'Электронная почта: <b>'.$email.'</b>',
				'password'		=> 'Пароль: <b>'.$password.'</b>',
				'question' 		=> 'Если у вас есть вопросы, пожалуйста',
				'contact' 		=> 'свяжитесь с нами',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
								<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
									<div>
										<div style="text-align: right; padding: 18px 0 6px;">
											<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
												<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
											</a>
										</div>
										<table cellpadding="0" cellspacing="0" style="width: 100%;">
											<tbody>
												<tr>
													<td>
														<table cellpadding="0" cellspacing="0" style="width:100%;">
															<tbody>
																<tr>
																	<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																		'.$translations['title'].'
																	</td>
																</tr>
																<tr>
																	<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																		'.$translations['hello'].'
																	</td>
																</tr>
																<tr>
																	<td>
																		<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #09f; border-radius: 5px; box-sizing: border-box; padding: 12px; margin: 12px 0;">
																			<tbody>
																				<tr>
																					<td style="padding: 0 0 12px; font: 11px/15px Arial,Helvetica,sans-serif; color: #999;">
																						'.$translations['source'].'
																					</td>
																				</tr>
																				<tr>
																					<td style="padding: 0 0 4px; font: 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																						'.$translations['email'].'
																					</td>
																				</tr>
																				<tr>
																					<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																						'.$translations['password'].'
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
																<tr>
																	<td style="font: 11px/15px Arial,Helvetica,sans-serif; color: #999">
																		'.$translations['question'].'
																		<a href="'.$urlWeb.'support" target="_blank" style="color: #09f; text-decoration: none">
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
									<footer style="width:100%; margin: 18px 0;">
										<table cellpadding="0" cellspacing="0" style="width:100%;">
											<tbody>
												<tr>
													<td>
														<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
															<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														'.$translations['info'].'
													</td>
												</tr>
												<tr>
													<td style="padding: 12px 0; color: #999;">
														<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['about'].'
														</a>
														<br>
														<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['privacy'].'
														</a>
														<br>
														<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['support'].'
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// New login
	function emailNewLogin($email, $lang, $name, $hash, $device, $location, $date) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> $name.', new login',
				'title'			=> 'New login',
				'device'		=> 'Device',
				'location'		=> 'Location',
				'date'			=> 'Date',
				'approx'		=> 'The location is approximate according to the IP address of the login.',
				'detect'		=> 'Hello <b>@'.$name.'</b>, we have detected a new login activity on your account.',
				'safeAccount' 	=> 'If you haven\'t done this action, your account may have been compromised and should complete a few steps to make sure your account is safe, please <a href="'.$urlWeb.'reset-password/'.$hash.'"style="color:#09f;text-decoration:none" role="link" target="_blank">reset your password now</a>.',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> $name.', nuevo inicio de sesión',
				'title'			=> 'Nuevo inicio de sesión',
				'device' 		=> 'Dispositivo',
				'location' 		=> 'Ubicación',
				'date' 			=> 'Fecha',
				'approx' 		=> 'La ubicación es aproximada según la dirección IP del inicio de sesión',
				'detect' 		=> 'Hola <b>@'.$name.'</b>, hemos detectado una nueva actividad de inicio de sesión en su cuenta.',
				'safeAccount' 	=> 'Si no ha realizado esta acción, su cuenta puede haber sido comprometida y debe completar algunos pasos para asegurarse de que su cuenta esté segura, por favor <a href="'.$urlWeb.'reset-password/'.$hash.'"style="color:#09f;text-decoration:none" role="link" target="_blank">restablezca su contraseña ahora</a>.',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> $name.', новый логин.',
				'title'			=> 'Новый логин',
				'device' 		=> 'Устройство',
				'location' 		=> 'Расположение',
				'date' 			=> 'Дата',
				'approx' 		=> 'Местоположение является приблизительным в соответствии с IP-адресом для входа.',
				'detect'		=> 'Здравствуйте <b>@'.$name.'</b>, мы обнаружили новую активность входа в вашу учетную запись.',
				'safeAccount' 	=> 'Если вы не выполнили это действие, возможно, ваша учетная запись была взломана и должна выполнить несколько шагов, чтобы убедиться, что ваша учетная запись безопасна, <a href="'.$urlWeb.'reset-password/'.$hash.'"style="color:#09f;text-decoration:none" role="link" target="_blank">восстановить пароль сейчас</a>.',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
							<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
								<div>
									<div style="text-align: right; padding: 18px 0 6px;">
										<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
											<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
										</a>
									</div>
									<table cellpadding="0" cellspacing="0" style="width: 100%;">
										<tbody>
											<tr>
												<td>
													<table cellpadding="0" cellspacing="0" style="width:100%;">
														<tbody>
															<tr>
																<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																	'.$translations['title'].'
																</td>
															</tr>
															<tr>
																<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																	'.$translations['detect'].'
																</td>
															</tr>
															<tr>
																<td>
																	<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #09f; border-radius: 5px; box-sizing: border-box; padding: 12px; margin: 12px 0;">
																		<tbody>
																			<tr>
																				<td style="padding: 0 0 4px; font: 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																					<b>'.$translations['device'].'</b>: '.$device.'
																				</td>
																			</tr>
																			<tr>
																				<td style="padding: 0 0 4px; font: 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																					<b>'.$translations['location'].'</b>: '.$location.'
																				</td>
																			</tr>
																			<tr>
																				<td style="padding: 0 0 4px; font: 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																					<b>'.$translations['date'].'</b>: '.$date.'
																				</td>
																			</tr>
																			<tr>
																				<td style="padding: 8px 0 0; font: 11px/15px Arial,Helvetica,sans-serif; color: #999;">
																					'.$translations['approx'].'
																				</td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
															<tr>
																<td style="font: 11px/15px Arial,Helvetica,sans-serif; color: #333;">
																	'.$translations['safeAccount'].'
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</div>
								<footer style="width:100%; margin: 18px 0;">
									<table cellpadding="0" cellspacing="0" style="width:100%;">
										<tbody>
											<tr>
												<td>
													<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
														<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
													'.$translations['info'].'
												</td>
											</tr>
											<tr>
												<td style="padding: 12px 0; color: #999;">
													<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
														'.$translations['about'].'
													</a>
													<br>
													<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
														'.$translations['privacy'].'
													</a>
													<br>
													<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
														'.$translations['support'].'
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
													© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Forgot password
	function emailForgotPassword($email, $lang, $name, $hash) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> $name.', reset your password',
				'title'			=> 'Reset password',
				'reset'			=> 'Password reset for <b>@'.$name.'</b>, click on the button below.',
				'ignore'		=> 'If you did not request this, ignore this email, your password will not be changed.',
				'notRequest'	=> 'If you didn\'t request a password reset, please',
				'contact'		=> 'contact us',
				'button' 		=> 'Reset password',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> $name.', restablece tu contraseña',
				'title' 		=> 'Restablecer contraseña',
				'reset' 		=> 'Restablecimiento de contraseña para <b>@'.$name.'</b>, haga clic en el botón a continuación.',
				'ignore' 		=> 'Si no has solicitado recuperar la contraseña, ignora este correo electrónico, tu contraseña no será cambiada',
				'notRequest' 	=> 'Si no has solicitado recuperar la contraseña, por favor',
				'contact' 		=> 'contacta con nosotros',
				'button' 		=> 'Restablecer contraseña',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> $name.', сбросьте пароль',
				'title' 		=> 'Сбросить пароль',
				'reset' 		=> 'Сброс пароля для <b>@'.$name.'</b>, нажмите кнопку ниже.',
				'ignore' 		=> 'Если вы не запрашивали восстановление пароля, игнорируйте это письмо, ваш пароль не будет изменен.',
				'notRequest' 	=> 'Если вы не запрашивали восстановление пароля, пожалуйста',
				'contact' 		=> 'свяжитесь с нами',
				'button' 		=> 'Восстановить пароль',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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
		
		$messageContent = '<div>
								<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
									<div>
										<div style="text-align: right; padding: 18px 0 6px;">
											<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
												<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
											</a>
										</div>
										<table cellpadding="0" cellspacing="0" style="width: 100%;">
											<tbody>
												<tr>
													<td>
														<table cellpadding="0" cellspacing="0" style="width:100%;">
															<tbody>
																<tr>
																	<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																		'.$translations['title'].'
																	</td>
																</tr>
																<tr>
																	<td style="padding: 0 0 18px; font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																		'.$translations['reset'].'
																	</td>
																</tr>
																<tr>
																	<td style="padding: 0 0 18px; font: 13px/15px Arial,Helvetica,sans-serif; color: #999;">
																		'.$translations['ignore'].'
																	</td>
																</tr>
																<tr>
																	<td style="font: 11px/15px Arial,Helvetica,sans-serif; color: #999">
																		'.$translations['notRequest'].'
																		<a href="'.$urlWeb.'support" target="_blank" style="color: #09f; text-decoration: none">
																			'.$translations['contact'].'
																		</a>.
																	</td>
																</tr>
															</tbody>
														</table>
													</td>
												</tr>
												<tr> 
													<td>
														<a href="'.$urlWeb.'reset-password/'.$hash.'" target="_blank" style="background: #2196f3; color:#fff; font: bold 13px/17px Arial,Helvetica,sans-serif; border-radius:5px; text-decoration:none; text-align:center; padding:12px 0; margin: 12px 0 0; width:100%; display: block;">
															'.$translations['button'].'
														</a>
													</td> 
												</tr>
											</tbody>
										</table>
									</div>
									<footer style="width:100%; margin: 18px 0;">
										<table cellpadding="0" cellspacing="0" style="width:100%;">
											<tbody>
												<tr>
													<td>
														<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
															<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														'.$translations['info'].'
													</td>
												</tr>
												<tr>
													<td style="padding: 12px 0; color: #999;">
														<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['about'].'
														</a>
														<br>
														<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['privacy'].'
														</a>
														<br>
														<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['support'].'
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Reset password
	function emailResetPassword($email, $lang, $name, $hash) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> $name.', your password has been changed',
				'title'			=> 'New password',
				'hello'			=> 'Hello <b>@'.$name.'</b>, you reset your password successfully.',
				'password'		=> 'New password: <b>'.$hash.'</b>',
				'notRequest'	=> 'If you didn\'t request a password reset, please',
				'contact'		=> 'contact us',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> $name.', tu contraseña ha sido cambiada',
				'title' 		=> 'Nueva contraseña',
				'hello' 		=> 'Hola <b>@'.$name.'</b>, has restablecido tu contraseña correctamente.',
				'password' 		=> 'Nueva contraseña: <b>'.$hash.'</b>',
				'notRequest' 	=> 'Si no has solicitado recuperar la contraseña, por favor',
				'contact' 		=> 'contacta con nosotros',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> $name.', ваш пароль изменен',
				'title' 		=> 'Новый пароль',
				'hello' 		=> 'Здравствуйте, <b>@'.$name.'</b>, вы успешно восстановили свой пароль.',
				'password' 		=> 'Новый пароль: <b>'.$hash.'</b>',
				'notRequest' 	=> 'Если вы не запрашивали восстановление пароля, пожалуйста',
				'contact' 		=> 'свяжитесь с нами',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
								<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
									<div>
										<div style="text-align: right; padding: 18px 0 6px;">
											<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
												<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
											</a>
										</div>
										<table cellpadding="0" cellspacing="0" style="width: 100%;">
											<tbody>
												<tr>
													<td>
														<table cellpadding="0" cellspacing="0" style="width:100%;">
															<tbody>
																<tr>
																	<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																		'.$translations['title'].'
																	</td>
																</tr>
																<tr>
																	<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																		'.$translations['hello'].'
																	</td>
																</tr>
																<tr>
																	<td>
																		<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #09f; border-radius: 5px; box-sizing: border-box; padding: 12px; margin: 12px 0;">
																			<tbody>
																				<tr>
																					<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #666; padding: 0 0 4px;">
																						'.$translations['password'].'
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
																<tr>
																	<td style="font: 11px/15px Arial,Helvetica,sans-serif; color: #333">
																		'.$translations['notRequest'].'
																		<a href="'.$urlWeb.'support" target="_blank" style="color: #09f; text-decoration: none">
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
									<footer style="width:100%; margin: 18px 0;">
										<table cellpadding="0" cellspacing="0" style="width:100%;">
											<tbody>
												<tr>
													<td>
														<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
															<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														'.$translations['info'].'
													</td>
												</tr>
												<tr>
													<td style="padding: 12px 0; color: #999;">
														<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['about'].'
														</a>
														<br>
														<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['privacy'].'
														</a>
														<br>
														<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['support'].'
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Support
	function emailSupportQuestion($email, $lang, $content) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> 'Support',
				'title'			=> 'Your question',
				'hello'			=> 'Hello, recently we received a question from this email <b>'.$email.'</b> in support.',
				'copy'			=> 'We send you the copy of the requested question. We will answer your question as soon as possible.',
				'compromised' 	=> 'If you haven\'t done this action, your email has been compromised, do not leave your email in third-party pages.',
				'question' 		=> 'If you have any question, please',
				'contact'		=> 'contact us',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> 'Soporte',
				'title' 		=> 'Tu pregunta',
				'hello' 		=> 'Hola, recientemente recibimos una pregunta de este correo electrónico <b>'.$email.'</b> en soporte.',
				'copy' 			=> 'Le hemos enviado una copia con la pregunta solicitada. Responderemos a su pregunta lo antes posible.',
				'compromised' 	=> 'Si no ha realizado esta acción, su correo electrónico ha sido comprometido, no lo deje en páginas de terceros.',
				'question' 		=> 'Si tiene alguna pregunta, por favor',
				'contact' 		=> 'contacta con nosotros',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> 'Служба поддержки',
				'title' 		=> 'Ваш вопрос',
				'hello' 		=> 'Здравствуйте, недавно мы получили вопрос из этой почты <b>'.$email.'</b> в службу поддержки.',
				'copy' 			=> 'Мы отправили вам копию запрошенного вопроса. Мы ответим на ваш вопрос как можно скорее.',
				'compromised' 	=> 'Если вы не сделали этого действия, ваша электронная почта была скомпрометирована, не оставляйте вашу электронную почту на сторонних страницах.',
				'question' 		=> 'Если у вас есть вопросы, пожалуйста',
				'contact' 		=> 'свяжитесь с нами',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
								<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
									<div>
										<div style="text-align: right; padding: 18px 0 6px;">
											<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
												<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
											</a>
										</div>
										<table cellpadding="0" cellspacing="0" style="width: 100%;">
											<tbody>
												<tr>
													<td>
														<table cellpadding="0" cellspacing="0" style="width:100%;">
															<tbody>
																<tr>
																	<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																		'.$translations['title'].'
																	</td>
																</tr>
																<tr>
																	<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																		'.$translations['hello'].'
																	</td>
																</tr>
																<tr>
																	<td>
																		<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #09f; border-radius: 5px; box-sizing: border-box; padding: 12px; margin: 12px 0;">
																			<tbody>
																				<tr>
																					<td style="padding: 0 0 12px; font: 11px/15px Arial,Helvetica,sans-serif; color: #999;">
																						'.$translations['copy'].'
																					</td>
																				</tr>
																				<tr>
																					<td style="font: bold 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																						"'.$content.'"
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
																<tr>
																	<td style="font: 11px/15px Arial,Helvetica,sans-serif; color: #999">
																		'.$translations['question'].'
																		<a href="'.$urlWeb.'support" target="_blank" style="color: #09f; text-decoration: none">
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
									<footer style="width:100%; margin: 18px 0;">
										<table cellpadding="0" cellspacing="0" style="width:100%;">
											<tbody>
												<tr>
													<td>
														<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
															<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														'.$translations['info'].'
													</td>
												</tr>
												<tr>
													<td style="padding: 12px 0; color: #999;">
														<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['about'].'
														</a>
														<br>
														<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['privacy'].'
														</a>
														<br>
														<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['support'].'
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Report
	function emailReport($email, $lang, $content) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> 'Report',
				'title'			=> 'Report',
				'hello'			=> 'Hello, we have received a report of inappropriate content, this information is handled completely anonymously.',
				'copy'			=> 'We send you the copy of the report.',
				'measure'		=> 'We will take the necessary measures to resolve this matter.',
				'question' 		=> 'If you have any question, please',
				'contact'		=> 'contact us',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> 'Reporte',
				'title' 		=> 'Reporte',
				'hello' 		=> 'Hola, hemos recibido un reporte de contenido inapropiado, esta información se gestiona de manera totalmente anonima.',
				'copy' 			=> 'Le hemos enviado una copia con el reporte.',
				'measure'		=> 'Tomaremos las medidas ncesarias para resolver este asunto.',
				'question' 		=> 'Si tiene alguna pregunta, por favor',
				'contact' 		=> 'contacta con nosotros',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> 'Рапорт',
				'title' 		=> 'Рапорт',
				'hello' 		=> 'Здравствуйте, мы получили сообщение о неприемлемом содержании, эта информация обрабатывается полностью анонимно.',
				'copy' 			=> 'Мы отправили вам копию рапорта.',
				'measure'		=> 'Мы примем необходимые меры для решения этого вопроса.',
				'question' 		=> 'Если у вас есть вопросы, пожалуйста',
				'contact' 		=> 'свяжитесь с нами',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
								<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
									<div>
										<div style="text-align: right; padding: 18px 0 6px;">
											<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
												<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
											</a>
										</div>
										<table cellpadding="0" cellspacing="0" style="width: 100%;">
											<tbody>
												<tr>
													<td>
														<table cellpadding="0" cellspacing="0" style="width:100%;">
															<tbody>
																<tr>
																	<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																		'.$translations['title'].'
																	</td>
																</tr>
																<tr>
																	<td style="font: 13px/15px Arial,Helvetica,sans-serif; color: #333;">
																		'.$translations['hello'].'
																	</td>
																</tr>
																<tr>
																	<td>
																		<table border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: 1px solid #09f; border-radius: 5px; box-sizing: border-box; padding: 12px; margin: 12px 0;">
																			<tbody>
																				<tr>
																					<td style="padding: 0 0 12px; font: 11px/15px Arial,Helvetica,sans-serif; color: #999;">
																						'.$translations['measure'].'
																					</td>
																				</tr>
																				<tr>
																					<td style="font: bold 13px/15px Arial,Helvetica,sans-serif; color: #666;">
																						"'.$content.'"
																					</td>
																				</tr>
																			</tbody>
																		</table>
																	</td>
																</tr>
																<tr>
																	<td style="font: 11px/15px Arial,Helvetica,sans-serif; color: #999">
																		'.$translations['question'].'
																		<a href="'.$urlWeb.'support" target="_blank" style="color: #09f; text-decoration: none">
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
									<footer style="width:100%; margin: 18px 0;">
										<table cellpadding="0" cellspacing="0" style="width:100%;">
											<tbody>
												<tr>
													<td>
														<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
															<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														'.$translations['info'].'
													</td>
												</tr>
												<tr>
													<td style="padding: 12px 0; color: #999;">
														<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['about'].'
														</a>
														<br>
														<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['privacy'].'
														</a>
														<br>
														<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
															'.$translations['support'].'
														</a>
													</td>
												</tr>
												<tr>
													<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
														© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Cron * Recomendations (Songs, Playlists)
	function emailRecommendations($email, $lang, $name, $array) {
		$urlWeb = 'https://beatfeel.com/';
		$nameWeb = 'Beatfeel';

		$translations  = array(
			'en' => array(
				'subject'		=> $name.', we just added some songs that you might like',
				'title'			=> 'For '.$name,
				'playlist'		=> 'Playlist Nº1',
				'play'			=> 'Play',
				'hits'			=> 'Hits of the moment',
				'recommended'	=> 'Recommended playlists',
				'findout'		=> 'Find out more',
				'info'			=> 'Message sent to '.$email.'. This email is informative and is part of the privacy policies of '.$nameWeb.' Entertainment Venue, you can edit your profile or unsubscribe.',
				'about'			=> 'About',
				'privacy'		=> 'Privacy',
				'support'		=> 'Support'
			),
			'es' => array(
				'subject' 		=> $name.', acabamos de añadir unas canciones que podrían gustarte',
				'title' 		=> 'Para '.$name,
				'playlist'		=> 'Playlist Nº1',
				'play'			=> 'Reproducir',
				'hits'			=> 'Éxitos del momento',
				'recommended'	=> 'Playlists recomendadas',
				'findout'		=> 'Descubrir más',
				'info'			=> 'Mensaje enviado a '.$email.'. Este correo es informativo y forma parte de las politicas de privaticidad de '.$nameWeb.' Entertainment Venue, puedes editar tu perfil o darte de baja.',
				'about'			=> 'Sobre nosotros',
				'privacy'		=> 'Politica de privacidad',
				'support'		=> 'Soporte técnico'
			),
			'ru' => array(
				'subject' 		=> $name.', мы только что добавили несколько песен которые могут вам понравиться',
				'title' 		=> 'Для '.$name,
				'playlist'		=> 'Плейлист Nº1',
				'play'			=> 'Воспроизвести',
				'hits'			=> 'Хиты',
				'recommended'	=> 'Рекомендуемые плейлисты',
				'findout'		=> 'Узнать больше',
				'info'			=> 'Сообщение отправлено на '.$email.'. Это электронное письмо является информативным и является частью политики конфиденциальности '.$nameWeb.' Entertainment Venue, вы можете изменить свой профиль или отказаться от подписки.',
				'about'			=> 'О нас',
				'privacy'		=> 'Политика конфиденциальности',
				'support'		=> 'Служба поддержки'
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

		$messageContent = '<div>
							<div dir="ltr" style="max-width: 480px; box-sizing: border-box; margin: 0 auto; padding: 0;">
								<div>
									<div style="text-align: right; padding: 18px 0 6px;">
										<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
											<img src="'.$urlWeb.'assets/images/icons/icon-96x96.png" style="display:inline-block;height:32px;width:32px">
										</a>
									</div>
									<table cellpadding="0" cellspacing="0" style="width: 100%;">
										<tbody>
											<tr>
												<td>
													<table cellpadding="0" cellspacing="0" style="width:100%;">
														<tbody>
															<tr>
																<td style="padding: 0 0 18px; font: bold 32px/32px Arial,Helvetica,sans-serif;">
																	'.$translations['title'].'
																</td>
															</tr>
															<tr>
																<td>
																	<table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
																		<tbody>
																			<tr>
																				<td>
																					<a href="'.$urlWeb.'pl/'.$array['playlists'][0]['name'].'" target="_blank" style="text-decoration: none;">
																						<div style="width: 100%; max-height: 480px; overflow: hidden; border-collapse: collapse; display: block; border-radius: 10px; border: none; outline: none; border-style: none;">
																							<img alt="'.$array['playlists'][0]['title'].'" src="'.$urlWeb.'assets/media/audios/covers/'.$array['playlists'][0]['image'].'" style="width: 100%;">
																						</div>
																						<div style="background: '.($array['playlists'][0]['color'] ? $array['playlists'][0]['color'] : '#666').'; width: 100%; min-height: 120px; border-radius: 10px; padding: 18px 18px 12px; box-sizing: border-box; text-align: center;">
																							<div style="font: bold 11px/19px Arial,Helvetica,sans-serif; color: '.($array['playlists'][0]['color'] ? $array['playlists'][0]['color'] : '#666').'; background: rgba(255,255,255,0.5); border-radius: 3px; width: fit-content; padding: 0 12px; margin: 0 auto 18px;">
																								'.$translations['playlist'].'
																							</div>
																							<div style="width: 100%; font: bold 32px/32px Arial,Helvetica,sans-serif; color: #fff;">
																								'.$array['playlists'][0]['title'].'
																							</div>
																							<div style="margin: 18px 0 0;">
																								<img alt="player" src="'.$urlWeb.'assets/images/playlist_player_email_white.png" style="height: 56px;">
																							</div>
																						</div>
																					</a>
																				</td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
															<tr> 
																<td style="padding: 24px 0 8px; font: bold 18px/18px Arial,Helvetica,sans-serif;">
																	'.$translations['hits'].'
																</td> 
															</tr>
															<tr>
																<td>
																	<table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
																		<tbody>';

													foreach ($array['songs'] as &$song) {
														$messageContent .= '<tr>
																				<td>
																					<a href="'.$urlWeb.'s/'.explode(".", $song['name'])[0].'" target="_blank" style="text-decoration: none; outline: none; display: flex; margin: 4px 0; height: 42px;">
																						<img alt="'.$song['title'].'" src="'.($song['image'] ? $urlWeb.'assets/media/audios/thumbnails/'.$song['image'] : $urlWeb.'assets/images/default_song_cover1.png').'" style="width: 42px; border-radius: 3px; float: left;">
																						<div style="padding: 0 6px 0 12px; overflow: hidden; display: block; width: 100%;">
																							<div style="font: 15px Arial,Helvetica,sans-serif; color: #333; padding: 3px 0; max-width: 75%; height: 15px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																								'.($song['original_title'] ? (strlen($song['original_title']) > 30 ? substr($song['original_title'], 0, 30).'...' : $song['original_title']) : (strlen($song['title']) > 30 ? substr($song['title'], 0, 30).'...' : $song['title'])).'
																							</div>
																							<div style="font: 13px Arial,Helvetica,sans-serif; color: #9e9e9e; max-width: 75%; height: 13px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
																								'.($song['original_artist'] ? (strlen($song['original_artist']) > 30 ? substr($song['original_artist'], 0, 30).'...' : $song['original_artist']) : (strlen($song['title']) > 30 ? substr($song['title'], 0, 30).'...' : $song['title'])).'
																							</div>
																						</div>
																						<div style="color: #09f; padding: 0 12px; font: bold 12px/28px Arial,Helvetica,sans-serif; border-radius: 3px; margin: 6px 0; border: 1px solid #09f;">
																							'.$translations['play'].'
																						</div>
																					</a>
																				</td>
																			</tr>';
													}

													$messageContent .= '</tbody>
																	</table>
																</td>
															</tr>
															<tr> 
																<td style="padding: 20px 0 12px; font: bold 18px/18px Arial,Helvetica,sans-serif;">
																	'.$translations['recommended'].'
																</td> 
															</tr>
															<tr>
																<td>
																	<table width="100%" cellpadding="0" cellspacing="0" style="border-spacing:0">
																		<tbody>
																			<tr>
																				<td width="33%">
																					<a href="'.$urlWeb.'pl/'.$array['playlists'][1]['name'].'" target="_blank">
																						<img alt="'.$array['playlists'][1]['title'].'" src="'.$urlWeb.'assets/media/audios/covers/'.$array['playlists'][1]['image'].'" style="width: 100%; border-collapse: collapse; display: block; border-radius: 8px; border: none; outline: none; border-style: none">
																					</a>
																				</td>
																				<td width="0.5%">&nbsp;</td>
																				<td width="33%">
																					<a href="'.$urlWeb.'pl/'.$array['playlists'][2]['name'].'" target="_blank">
																						<img alt="'.$array['playlists'][2]['title'].'" src="'.$urlWeb.'assets/media/audios/covers/'.$array['playlists'][2]['image'].'" style="width: 100%; border-collapse: collapse; display: block; border-radius: 8px; border: none; outline: none; border-style: none">
																					</a>
																				</td>
																				<td width="0.5%">&nbsp;</td>
																				<td width="33%">
																					<a href="'.$urlWeb.'pl/'.$array['playlists'][3]['name'].'" target="_blank">
																						<img alt="'.$array['playlists'][3]['title'].'" src="'.$urlWeb.'assets/media/audios/covers/'.$array['playlists'][3]['image'].'" style="width: 100%; border-collapse: collapse; display: block; border-radius: 8px; border: none; outline: none; border-style: none">
																					</a>
																				</td>
																			</tr>
																		</tbody>
																	</table>
																</td>
															</tr>
															<tr> 
																<td>
																	<a href="'.$urlWeb.'" target="_blank" style="background: #e91e63; color:#fff; font: bold 13px/17px Arial,Helvetica,sans-serif; border-radius:5px; text-decoration:none; text-align:center; padding:12px 0; margin: 12px 0 0; width:100%; display: block;">
																		'.$translations['findout'].'
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
								<footer style="width:100%; margin: 18px 0;">
									<table cellpadding="0" cellspacing="0" style="width:100%;">
										<tbody>
											<tr>
												<td>
													<a href="'.$urlWeb.'" style="outline:none" role="link" target="_blank">
														<img alt="logo" src="'.$urlWeb.'assets/images/logo_text_email.png" width="100px" style="margin: 0 0 6px;">
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 2px 3px 0; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
													'.$translations['info'].'
												</td>
											</tr>
											<tr>
												<td style="padding: 12px 0; color: #999;">
													<a href="'.$urlWeb.'about" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
														'.$translations['about'].'
													</a>
													<br>
													<a href="'.$urlWeb.'privacy" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
														'.$translations['privacy'].'
													</a>
													<br>
													<a href="'.$urlWeb.'support" style="padding: 0 3px; font: 11px/15px Arial,Helvetica,sans-serif; color: #777; text-decoration: none; font-weight: bold;" role="link" target="_blank">
														'.$translations['support'].'
													</a>
												</td>
											</tr>
											<tr>
												<td style="padding: 0 3px; margin-bottom: 0; font: 11px/15px Arial,Helvetica,sans-serif; color:#999;">
													© '.date("Y").' '.$nameWeb.' Entertainment Venue
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
		$mail->Username = 'noreply.beatfeel@gmail.com';
		$mail->Password = 'Rafalskyy1991@';
		$mail->setFrom('noreply@beatfeel.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = $translations['subject'];
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}
?>
