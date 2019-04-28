<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$theme = $data['theme'];

	// Update data
	$sql = "UPDATE z_users
			SET theme = '$theme',
				ip_address_update = '$ipAddress'
			WHERE id = $session";
	$result = $conn->query($sql);

	// Get user data
	$userData = userData($session);
	echo json_encode($userData);
	
	$conn->close();
?>
