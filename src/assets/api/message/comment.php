<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$user = $data['user'];
	$id = $data['id'];
	$content = htmlspecialchars($data['content'], ENT_QUOTES);
	$contentOriginal = htmlspecialchars($data['content_original'], ENT_QUOTES);

	// Check if conversation exists
	if ($id) {
		// Insert message conversation
		$sqlMC = "INSERT INTO z_message_conversation (message, user, type, content, content_original, ip_address)
					VALUES ($id, $session, 'text', '$content','$contentOriginal', '$ipAddress')";
		$resultMC = $conn->query($sqlMC);
		$insertedIdMC = $conn->insert_id;

		// Get inseted
		$sql = "SELECT id, message, user, content, content_original, date
				FROM z_message_conversation
				WHERE id = $insertedIdMC";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		// Notification data
		$notification = array(
			'url' 		=> 'message',
			'type' 		=> 'comment',
			'sender' 	=> $session,
			'receiver' 	=> $user,
			'id' 		=> $insertedIdMC,
			'comment' 	=> $insertedId
		);

		generateNotification($notification);

		$comment = $result->fetch_assoc();
		$comment['user'] = userUsernameNameAvatar($comment['user']);
		echo json_encode($comment);
	} else {
		// Create message
		$sqlM = "INSERT INTO z_message (sender, receiver, ip_address)
				VALUES ($session, $user, '$ipAddress')";
		$resultM = $conn->query($sqlM);
		$insertedIdM = $conn->insert_id;

		// Insert message conversation
		$sqlMC = "INSERT INTO z_message_conversation (message, user, type, content, content_original, ip_address)
					VALUES ($insertedIdM, $session, 'text', '$content','$contentOriginal', '$ipAddress')";
		$resultMC = $conn->query($sqlMC);
		$insertedIdMC = $conn->insert_id;

		// Get inserted
		$sql = "SELECT id, message, user, content, content_original, date
				FROM z_message_conversation
				WHERE id = $insertedIdMC";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		// Notification data
		$notification = array(
			'url' 		=> 'message',
			'type' 		=> 'comment',
			'sender' 	=> $session,
			'receiver' 	=> $user,
			'id' 		=> $insertedIdMC,
			'comment' 	=> $insertedId
		);

		generateNotification($notification);

		$comment = $result->fetch_assoc();
		$comment['user'] = userUsernameNameAvatar($comment['user']);
		echo json_encode($comment);
	}

	$conn->close();
?>