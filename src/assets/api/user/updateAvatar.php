<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$avatar = $data['avatar'];
	$id = $data['id'];
	$name = generateRandomString(23).'.jpg';

	// remove folder images first
	array_map('unlink', glob('/var/www/html/assets/media/user/'.$id.'/avatar/*'));

	// create image
	if ($avatar) {
		$pathAvatar = '/var/www/html/assets/media/user/'.$id.'/avatar/'.$name;
		$avatar = explode(",",$avatar);
		$avatar = str_replace(' ', '+', $avatar[1]);
		$avatar = base64_decode($avatar);
		file_put_contents($pathAvatar, $avatar);

		// update avatar
		$sql = "UPDATE z_users
				SET avatar = '$name',
					ip_address_update = '$ipAddress'
				WHERE id = $id";
	} else {
		// remove avatar
		$sql = "UPDATE z_users
				SET avatar = NULL,
					ip_address_update = '$ipAddress'
				WHERE id = $id";
	}
	
	$result = $conn->query($sql);

	// get user data
	$userData = userData($id);
	echo json_encode($userData);
	
	$conn->close();
?>
