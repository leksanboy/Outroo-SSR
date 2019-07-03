<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$avatar = $data['image'];
	$name = generateRandomString(23).'.jpg';

	// Remove folder images first
	array_map('unlink', glob('/var/www/html/assets/media/user/'.$session.'/avatar/*'));

	// Create image
	if ($avatar) {
		$pathAvatar = '/var/www/html/assets/media/user/'.$session.'/avatar/'.$name;
		$avatar = explode(",",$avatar);
		$avatar = str_replace(' ', '+', $avatar[1]);
		$avatar = base64_decode($avatar);
		file_put_contents($pathAvatar, $avatar);

		// Update avatar
		$sql = "UPDATE z_users
				SET avatar = '$name',
					ip_address_update = '$ipAddress'
				WHERE id = $session";
	} else {
		// Remove avatar
		$sql = "UPDATE z_users
				SET avatar = NULL,
					ip_address_update = '$ipAddress'
				WHERE id = $session";
	}
	
	$result = $conn->query($sql);

	// Get user data
	$userData = userData($session);
	echo json_encode($userData);
	
	$conn->close();
?>
