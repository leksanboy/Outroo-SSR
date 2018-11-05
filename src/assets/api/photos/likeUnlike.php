<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$type = $data['type'];
	$sender = $data['sender'];
	$receiver = $data['receiver'];

	if ($type == "like") { // Add
		$sql = "INSERT INTO z_photos_likes (user, photo, ip_address)
				VALUES ($sender, $id, '$ipAddress')";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			"url" 		=> 'photos',
			"type" 		=> 'like',
			"sender" 	=> $sender,
			"receiver" 	=> $receiver,
			"id" 		=> $id
		);

		// Check to not notificate myself
		if ($sender != $receiver)
			generateNotification($notification);
		
		var_dump(http_response_code(204));
		
		$conn->close();
	} else if ($type == "unlike") { // Remove
		$sql = "DELETE FROM z_photos_likes
				WHERE user = $sender AND photo = $id";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			"url" 		=> 'photos',
			"type" 		=> 'unlike',
			"sender" 	=> $sender,
			"receiver" 	=> $receiver,
			"id" 		=> $id
		);
		
		// Check to not notificate myself
		if ($sender != $receiver)
			generateNotification($notification);

		var_dump(http_response_code(204));
		
		$conn->close();
	}
?>
