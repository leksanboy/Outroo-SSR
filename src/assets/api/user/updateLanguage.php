<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sessoin = sessionId();
	$language = $data['language'];

	// Update data
	$sql = "UPDATE z_users
			SET language = '$language',
				ip_address_update = '$ipAddress'
			WHERE id = $sessoin";
	$result = $conn->query($sql);

	// Get user data
	$userData = userData($sessoin);
	echo json_encode($userData);
	
	$conn->close();
?>
