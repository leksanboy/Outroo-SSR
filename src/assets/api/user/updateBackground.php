<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$background = $data['background'];
	$id = $data['id'];
	$name = generateRandomString(23).'.jpg';

	// remove folder images first
	array_map('unlink', glob('/var/www/html/assets/media/user/'.$id.'/background/*'));

	// create image
	if ($background) {
		$pathBackground = '/var/www/html/assets/media/user/'.$id.'/background/'.$name;
		$background = explode(",", $background);
		$background = str_replace(' ', '+', $background[1]);
		$background = base64_decode($background);
		file_put_contents($pathBackground, $background);

		// update background
		$sql = "UPDATE z_users
				SET background = '$name',
					ip_address_update = '$ipAddress'
				WHERE id = $id";
	} else {
		// remove background
		$sql = "UPDATE z_users
				SET background = NULL,
					ip_address_update = '$ipAddress'
				WHERE id = $id";
	}
	
	$result = $conn->query($sql);

	// get user data
	$userData = userData($id);
	echo json_encode($userData);
	
	$conn->close();
?>
