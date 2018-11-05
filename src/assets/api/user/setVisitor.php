<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sender = $data['sender'];
	$receiver = $data['receiver'];

	if ($sender != $receiver) {
		$sql = "INSERT INTO z_users_replays (user, visitor, ip_address)
				VALUES ($sender, $receiver, '$ipAddress')";
		$result = $conn->query($sql);
	}

	var_dump(http_response_code(204));
		
	$conn->close();
?>
