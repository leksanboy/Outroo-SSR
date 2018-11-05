<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sender = $data['sender'];
	$receivers = $data['receivers'];
	$publication = $data['publication'];

	// Create chat
	$sql = "INSERT INTO z_chat (user, ip_address)
			VALUES ($sender, '$ipAddress')";
	$result = $conn->query($sql);
	$insertedChatId = $conn->insert_id;

	// Create chat users
	foreach($receivers as $row){
		$sqlRow = "INSERT INTO z_chat_users (chat, user, ip_address)
					VALUES ($insertedChatId, '$row', '$ipAddress')";
		$result = $conn->query($sqlRow);
	}

	// Insert shared publication
	if ($publication) {
		$sql = "INSERT INTO z_chat_conversation (chat, user, type, publication, ip_address)
				VALUES ($insertedChatId, $sender, 'publication', $publication, '$ipAddress')";
		$result = $conn->query($sql);

		// Init chat
		$sql = "UPDATE z_chat
				SET initialized = 1, ip_address = '$ipAddress' 
				WHERE id = $insertedChatId";
		$result = $conn->query($sql);
	}

	echo json_encode($insertedChatId);
	
	$conn->close();
?>
