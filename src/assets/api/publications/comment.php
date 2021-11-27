<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();

	$id = $data['id'];
	$receiver = $data['receiver'];
	$reply = $data['reply'];
	$replyChild = $data['reply_child'];

	$content = htmlspecialchars(str_replace("\\","\\\\", $data['content']), ENT_QUOTES);
	$contentOriginal = htmlspecialchars(str_replace("\\","\\\\", $data['content_original']), ENT_QUOTES);
	$mentions = count($data['mentions']) > 0 ? json_encode($data['mentions']) : null;
	$mentionsNotificate = $data['mentions'];

	// Insert new comment
	$sql = "INSERT INTO z_publications_comments (user, publication, content, content_original, reply, reply_child".($mentions ? ', mentions' : '').", ip_address)
			VALUES ($session, $id, '$content', '$contentOriginal', '$reply', '$replyChild'".($mentions ? ','.'\''.$mentions.'\'' : '').", '$ipAddress')";
	$result = $conn->query($sql);

	$insertedId = $conn->insert_id;
	$inserted = getPublicationComment($insertedId);

	// Notification data
	$notification = array(
		'url' 		=> 'publication',
		'type' 		=> 'comment',
		'sender' 	=> $session,
		'receiver' 	=> $receiver,
		'id' 		=> $id,
		'comment' 	=> $insertedId
	);

	// Check to not notificate myself
	if ($session != $receiver)
		generateNotification($notification);

	// Notificate mentioned friends on comment
	foreach($mentionsNotificate as $row){
		$rcv = userId(substr($row, 1));

		if ($rcv) {
			$notification = array(
				'url' 		=> 'publication',
				'type' 		=> 'mentionComment',
				'sender' 	=> $session,
				'receiver' 	=> $rcv,
				'id' 		=> $id,
				'comment' 	=> $insertedId
			);

			generateNotification($notification);
		}
	}

	echo json_encode($inserted);

	$conn->close();
?>
