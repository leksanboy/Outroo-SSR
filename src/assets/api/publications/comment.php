<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$sender = sessionId();
	$receiver = $data['receiver'];
	$type = $data['type'];
	$id = $data['id'];

	if ($type === "create") {
		$comment = htmlspecialchars($data['comment'], ENT_QUOTES);
		$commentOriginal = htmlspecialchars($data['comment_original'], ENT_QUOTES);
		$mentions = count($data['mentions']) > 0 ? json_encode($data['mentions']) : null;
		$mentionsNotificate = $data['mentions'];

		// Insert new comment
		$sql = "INSERT INTO z_publications_comments (user, publication, comment, comment_original, mentions, ip_address) 
				VALUES ($sender, $id, '$comment', '$commentOriginal', '$mentions', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;
		$inserted = getPublicationComment($insertedId);

		// Notification data
		$notification = array(
			'url' 		=> 'publications',
			'type' 		=> 'comment',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver,
			'id' 		=> $id,
			'comment' 	=> $insertedId
		);
		
		// Check to not notificate myself
		if ($sender != $receiver)
			generateNotification($notification);

		// Notificate mentioned friends on comment
		foreach($mentionsNotificate as $row){
			$rcv = userId(substr($row, 1));
		
			if ($rcv) {
				$notification = array(
					'url' 		=> 'publications',
					'type' 		=> 'mentionComment',
					'sender' 	=> $sender,
					'receiver' 	=> $rcv,
					'id' 		=> $id,
					'comment' 	=> $insertedId
				);

				generateNotification($notification);
			}
		}
		
		echo json_encode($inserted);

		$conn->close();
	} else if ($type === 'add' || $type === 'remove') {
		$status = ($type === 'remove') ? 1 : 0;
		$comment = $data['comment'];

		$sql = "UPDATE z_publications_comments
				SET is_deleted = $status, 
					ip_address = '$ipAddress' 
				WHERE id = $comment";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'url' 		=> 'publications',
			'type' 		=> ($status ? 'uncomment' : 'commentUncommented'),
			'sender' 	=> $sender,
			'receiver' 	=> $receiver,
			'id' 		=> $id,
			'comment' 	=> $comment
		);

		generateNotification($notification);

		var_dump(http_response_code(204));
		
		$conn->close();
	}
?>