<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$theme = $data['theme'];

	// update data
	$sql = "UPDATE z_users
			SET theme = '$theme',
				ip_address_update = '$ipAddress'
			WHERE id = $id";
	$result = $conn->query($sql);

	// get user data
	$userData = userData($id);
	echo json_encode($userData);
	
	$conn->close();
?>
