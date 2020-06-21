<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$data['username'] = strtr($data['username'],'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ','aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
	$username = str_replace(' ', '', $data['username']);
	$name = htmlspecialchars($data['name'], ENT_QUOTES);
	$email = $data['email'];
	$password = md5($data['password']);
	$lang = $data['lang'];
	$date = time();
	$generatedHash = generateRandomString(23);

	if (checkUsername($username) || checkEmail($email)) {
		var_dump(http_response_code(403));
	} else {
		if (isset($username) && isset($name) && isset($email) && isset($password)) {
			$sql = "INSERT INTO z_users (username, name, email, password, verification_code, language, creation_date, ip_address_create)
					VALUES ('$username', '$name', '$email', '$password', '$generatedHash', '$lang', '$date', '$ipAddress')";
			$result = $conn->query($sql);
			$insertedUser = $conn->insert_id;

			if ($insertedUser) {
				// Creating folder for avatar
				mkdir('/var/www/html/assets/media/user/'.$insertedUser.'/avatar', 0777, true);

				// Send mail
				emailWelcome($email, $lang, html_entity_decode($name, ENT_QUOTES), $generatedHash);

				// Return response status
				var_dump(http_response_code(204));
			} else {
				var_dump(http_response_code(403));
			}

			$conn->close();
		} else {
			var_dump(http_response_code(404));
		}
	}
?>
