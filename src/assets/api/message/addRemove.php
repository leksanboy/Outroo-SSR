<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$type = $data['type'];
	$id = $data['id'];

	$status = ($type === 'remove') ? 1 : 0;

	$sql = "UPDATE z_message_conversation
			SET is_deleted = $status, 
				ip_address = '$ipAddress' 
			WHERE id = $id 
				AND user = $session";
	$result = $conn->query($sql);

	if ($type === 'remove') {
		// Remove notification
		$notification = array(
			'url' 		=> 'message',
			'type' 		=> 'remove',
			'id' 		=> $id
		);
		generateNotification($notification);
	} else {
		// Restore notification
		$notification = array(
			'url' 		=> 'message',
			'type' 		=> 'add',
			'id' 		=> $id
		);
		generateNotification($notification);
	}

	var_dump(http_response_code(204));
	
	$conn->close();
?>
