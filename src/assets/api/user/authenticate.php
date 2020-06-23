<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	// Parameters
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$type = $data['type'];
	$username = $data['username'];
	$password = explode('-', $data['password']); // Login page & confirm email auto login
	if ($password[1]) { // Came from validation email
		$password = $password[0];
	} else { // login page
		$password = md5($data['password']);
	}
	$id = $data['id'];
	$name = $data['name'];
	$email = $data['email'];
	$avatar = $data['avatar'];
	$lang = $data['lang'];

	// Login and get session data
	if ($type === 'normal') {
		$cond = strrpos($username, '@') ? 'email' : 'username';
		$sql = "SELECT id,
						username,
						name,
						avatar,
						background,
						email,
						about,
						language,
						theme,
						official,
						private,
						reset_password as rp
				FROM z_users
				WHERE $cond = '$username'
					AND password = '$password'";
		$result = $conn->query($sql)->fetch_assoc();
	} else if (($type === 'facebook' || $type === 'google') && $id) {
		$sql = "SELECT id,
						username,
						name,
						avatar,
						background,
						email,
						about,
						language,
						theme,
						official,
						private,
						reset_password as rp
				FROM z_users
				WHERE email = '$email'";
		$result = $conn->query($sql)->fetch_assoc();

		// If not exists then create an account
		if (!$result['id']) {
			$u = strtr($name,'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ','aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY');
			$u = str_replace(' ', '', $u);
			$u = checkUsername($u) ? ($u.generateRandomString(6)) : $u;
			$password = generateRandomString(10);
			$generatedHash = generateRandomString(23);
			$date = time();

			// Create new one
			$sql = "INSERT INTO z_users (username, name, email, password, verification_code, language, creation_date, ip_address_create, source, source_user_id)
					VALUES ('$u', '$name', '$email', '$password', '$generatedHash', '$lang', '$date', '$ipAddress', '$type', '$id')";
			$conn->query($sql);
			$insertedUser = $conn->insert_id;

			if ($insertedUser) {
				// Creating folder for avatar
				mkdir('/var/www/html/assets/media/user/'.$insertedUser.'/avatar', 0777, true);

				// Insert image
				$nameAvatar = generateRandomString(23).'.jpg';
				$pathAvatar = '/var/www/html/assets/media/user/'.$insertedUser.'/avatar/'.$nameAvatar;
				file_put_contents($pathAvatar, file_get_contents($avatar));

				$sql = "UPDATE z_users
						SET avatar = '$nameAvatar',
							ip_address_update = '$ipAddress'
						WHERE id = $insertedUser";
				$conn->query($sql);

				// Send mail
				emailWelcomeSocial($email, $lang, html_entity_decode($name, ENT_QUOTES), $generatedHash, $password);

				// Login data
				$sql = "SELECT id,
								username,
								name,
								avatar,
								background,
								email,
								about,
								language,
								theme,
								official,
								private,
								reset_password as rp
						FROM z_users
						WHERE id = $insertedUser";
				$result = $conn->query($sql)->fetch_assoc();
			}
		}
	}

	if ($result) {
		$result['avatarUrl'] 			= $result['avatar'] ? ('https://outroo.com/assets/media/user/'.$result['id'].'/avatar/'.$result['avatar']) : '';
		$result['languages'] 			= getLanguages();
		$result['theme'] 				= intval($result['theme']);
		$result['official'] 			= $result['official'] ? true : false;
		$result['private'] 				= $result['private'] ? true : false;
		$result['name'] 				= html_entity_decode($result['name'], ENT_QUOTES);
		$result['about'] 				= html_entity_decode($result['about'], ENT_QUOTES);
		$result['countFollowing'] 		= countUserFollowing($result['id']);
		$result['countFollowers'] 		= countUserFollowers($result['id']);
		$result['countAudios'] 			= countUserAudios($result['id']);
		$result['countBookmarks'] 		= countUserBookmarks($result['id']);

		// Set user activity
		$result['authorization'] 		= userLoginActivity($result['id']);

		// Get playlists
		$result['playlists'] 			= getPlaylistsSelect($result['id']);

		/* --- Set info --- */

		// Get Device
		$device 						= $_SERVER['HTTP_USER_AGENT'];
		$device 						= explode(")", $device);
		$device[0] 						= explode("(", $device[0])[1];
		$device 						= $device[0].', '.$device[2];

		// Get location
		$location 						= json_decode(file_get_contents("https://ipinfo.io/$ipAddress/json"));
		$location 						= $location->city ? ($location->city.', '.$location->region) : 'Unable to locate '.$ipAddress;

		// Set date by location
		$zone 							= date_default_timezone_get();
		$date 							= date('l jS\, F Y h:i:s A').' ('.$zone.')';

		// Send email
		emailNewLogin($result['email'], $result['languages'], $result['username'], $result['rp'], $device , $location, $date);

		// Return data
		echo json_encode($result);
	} else {
		var_dump(http_response_code(403));
	}

	$conn->close();
?>
