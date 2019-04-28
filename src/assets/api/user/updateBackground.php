<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$background = $data['background'];
	$name = generateRandomString(23).'.jpg';

	// Remove folder images first
	array_map('unlink', glob('/var/www/html/assets/media/user/'.$session.'/background/*'));

	// create image
	if ($background) {
		$pathBackground = '/var/www/html/assets/media/user/'.$session.'/background/'.$name;
		$background = explode(",", $background);
		$background = str_replace(' ', '+', $background[1]);
		$background = base64_decode($background);
		file_put_contents($pathBackground, $background);

		// Update background
		$sql = "UPDATE z_users
				SET background = '$name',
					ip_address_update = '$ipAddress'
				WHERE id = $session";
	} else {
		// Remove background
		$sql = "UPDATE z_users
				SET background = NULL,
					ip_address_update = '$ipAddress'
				WHERE id = $session";
	}
	
	$result = $conn->query($sql);

	// Get user data
	$userData = userData($session);
	echo json_encode($userData);
	
	$conn->close();
?>
