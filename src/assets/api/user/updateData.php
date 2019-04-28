<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sessioin = sessionId();
	$username = $data['username'];
	$name = htmlspecialchars($data['name'], ENT_QUOTES);
	$language = $data['language'];
	$about = htmlspecialchars($data['about'], ENT_QUOTES);
	$aboutOriginal = htmlspecialchars($data['aboutOriginal'], ENT_QUOTES);

	// Update data
	$sql = "UPDATE z_users
			SET username = '$username',
				name = '$name',
				language = $language,
				about = '$about',
				about_original = '$aboutOriginal',
				ip_address_update = '$ipAddress'
			WHERE id = $sessioin";
	$result = $conn->query($sql);

	// Get user data
	$userData = userData($sessioin);
	echo json_encode($userData);
	
	$conn->close();
?>
