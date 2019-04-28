<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sender = sessionId();
	$receiver = $data['receiver'];
	$id = $data['id'];
	$type = $data['type'];

	if ($type === 'like') { // Add
		$sql = "INSERT INTO z_publications_likes (user, publication, ip_address)
				VALUES ($sender, $id, '$ipAddress')";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'url' 		=> 'publications',
			'type' 		=> 'like',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver,
			'id' 		=> $id
		);

		// Check to not notificate myself
		if ($sender != $receiver)
			generateNotification($notification);
		
		var_dump(http_response_code(204));

		$conn->close();
	} else if ($type === 'unlike') { // Remove
		$sql = "DELETE FROM z_publications_likes
				WHERE user = $sender 
					AND publication = $id";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'url' 		=> 'publications',
			'type' 		=> 'unlike',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver,
			'id' 		=> $id
		);

		// Check to not notificate myself
		if ($sender != $receiver)
			generateNotification($notification);

		var_dump(http_response_code(204));

		$conn->close();
	}
?>
