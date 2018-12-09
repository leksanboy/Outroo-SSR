<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	// Parameters
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$username = $data['username'];

	// Login page & confirm email auto login
	$password = explode('-', $data['password']);
	if ($password[1]) // Came from validation email
		$password = $password[0];
	else // login page
		$password = md5($data['password']);

	// Log in and return session data
	$sql = "SELECT id, username, name, avatar, background, email, about, language, theme, official, private, reset_password as rp
			FROM z_users
			WHERE email = '$username' AND password = '$password'";
	$result = $conn->query($sql)->fetch_assoc();

	if ($result){
		$result['name'] = html_entity_decode($result['name'], ENT_QUOTES);
		$result['about'] = html_entity_decode($result['about'], ENT_QUOTES);
		$result['languages'] = getLanguages();
		$result['avatarUrl'] = $result['avatar'] ? ('./assets/media/user/'.$result['id'].'/avatar/'.$result['avatar']) : '';
		$result['backgroundUrl'] = $result['background'] ? ('./assets/media/user/'.$result['id'].'/background/'.$result['background']) : '';
		$result['theme'] = $result['theme'] ? true : false;
		$result['official'] = $result['official'] ? true : false;
		$result['private'] = $result['private'] ? true : false;
		$result['playlists'] = getPlaylists($result['id']);
		$result['countFollowing'] = countUserFollowing($result['id']);
		$result['countFollowers'] = countUserFollowers($result['id']);
		$result['countPhotos'] = countUserPhotos($result['id']);
		$result['countAudios'] = countUserAudios($result['id']);
		$result['countBookmarks'] = countUserBookmarks($result['id']);

		// Set user activity
		$result['authorization'] = userLoginActivity($result['id']);

		// Get Device
		$device = $_SERVER['HTTP_USER_AGENT'];
		$device = explode(")", $device);
		$device[0] = explode("(", $device[0])[1];
		$device = $device[0].', '.$device[2];

		// Get location
		$location = json_decode(file_get_contents("https://ipinfo.io/$ipAddress/json"));
		$location = $location->city ? ($location->city.', '.$location->region) : 'Unable to locate '.$ipAddress;

		// Date/set date by location
		$zone = date_default_timezone_get();
		$date = date('l jS\, F Y h:i:s A').' ('.$zone.')';

		// Send email
		emailNewLogin($result['username'], $result['email'], $result['rp'], $device , $location, $date);

		// Data
		echo json_encode($result);
	} else {
		var_dump(http_response_code(403));
	}

	$conn->close();
?>
