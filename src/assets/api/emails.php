<?php
	// *Email sender
	require '/usr/share/php/libphp-phpmailer/PHPMailerAutoload.php';

	// Email Register "Welcome"
	function emailWelcome($name, $email, $hash){
		$urlWeb = 'https://outhroo.com/';
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
																			Welcome
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			Hello <b>'.$name.'</b>, thanks for creating an account. Follow other people, search an amazing songs and share your photos and videos with the rest of comunity.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			Confirm your email address <b>'.$email.'</b>, click on the button below.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:12px 5% 18px;">
																			<a href="'.$urlWeb.'confirm-email/'.$hash.'" style="padding:10px 14px;text-decoration:none;background:#2196f3;color:#ffffff;border-radius:5px;font:300 15px/14px Arial,Helvetica,sans-serif;">
																				<nowrap>
																					Confirm email address
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
															© '.$nameWeb.' '.date("Y").'
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
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = 'Welcome to Outroo, '.$name.'! Please confirm your email.';
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Email new login
	function emailNewLogin($name, $email, $hash, $device, $location, $date){
		$urlWeb = 'https://outhroo.com/';
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
																			New login
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 4px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			<b>Device</b>: '.$device.'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 4px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			<b>Location</b>: '.$location.'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 4px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			<b>Date</b>: '.$date.'
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:12px/18px Arial,Helvetica,sans-serif;color:#999">
																			The location is approximate according to the IP address of the login.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			Hello <b>@'.$name.'</b>, we have detected a new login activity on your account.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			If you haven\'t done this action, your account may have been compromised
																			and should complete a few steps to make sure your account is safe, please
																			<a href="'.$urlWeb.'reset-password/'.$hash.'" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				reset your password now
																			</a>
																			.
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
															© '.$nameWeb.' '.date("Y").'
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
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = "New login";
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Email forgot password
	function emailForgotPassword($name, $email, $hash){
		$urlWeb = 'https://outhroo.com/';
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
																			Reset password
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			Password reset for <b>@'.$name.'</b>, click on the button below.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 6px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			If you did not request this, ignore this email, your password will not be changed.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			If you didn\'t request a password reset, please
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				contact us
																			</a>
																			.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:12px 5% 18px;">
																			<a href="'.$urlWeb.'reset-password/'.$hash.'" style="padding:10px 14px;text-decoration:none;background:#2196f3;color:#ffffff;border-radius:5px;font:300 15px/14px Arial,Helvetica,sans-serif;">
																				<nowrap>
																					Reset password
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
															© '.$nameWeb.' '.date("Y").'
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
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = "Reset your password";
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Email reset password
	function emailResetPassword($name, $email, $hash){
		$urlWeb = 'https://outhroo.com/';
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
																			New password
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			Hello <b>@'.$name.'</b>, you reset your password successfully.
																			<br>
																			Here is your new password: <b>'.$hash.'</b>
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			If you didn\'t request a password reset, please
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				contact us
																			</a>
																			.
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
															© '.$nameWeb.' '.date("Y").'
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
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = "Your password has been changed";
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Email support question
	function emailSupportQuestion($email, $content){
		$urlWeb = 'https://outhroo.com/';
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
																			Your question
																		</td>
																	</tr>

																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			Hello, recently we received a question from this email <b>'.$email.'</b> in Support.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			We send you the copy of the requested question.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			"<b>'.$content.'</b>"
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#333">
																			We will answer your question as soon as possible.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			If you haven\'t done this action, your email has been compromised,
																			do not leave your email in third-party pages.
																		</td>
																	</tr>
																	<tr>
																		<td id="paragraph" style="padding:0 5% 18px;font:14px/18px Arial,Helvetica,sans-serif;color:#999">
																			If you have any question, please
																			<a href="'.$urlWeb.'support" style="color:#09f;text-decoration:none" role="link" target="_blank">
																				contact us
																			</a>
																			.
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
															© '.$nameWeb.' '.date("Y").'
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
		$mail->SMTPAuth = true;
		$mail->Username = 'noreply.outhroo@gmail.com';
		$mail->Password = 'Rafalskyy1991';
		$mail->setFrom('noreply.outhroo@gmail.com');
		$mail->FromName = $nameWeb;
		$mail->AddAddress($email);
		$mail->Subject = "Support";
		$mail->IsHTML(true);
		$mail->Body = $messageContent;
		$mail->Send();
	}

	// Email report
	function emailReport($email, $content){
		echo 'Working on!';
	}
?>
