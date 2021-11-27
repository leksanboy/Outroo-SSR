<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	
	$id = $data['id'];
	$type = $data['type'];

	$publication = $data['publication'];
	$reply = $data['reply'];

	$content = htmlspecialchars($data['content'], ENT_QUOTES);
	$contentOriginal = htmlspecialchars($data['content_original'], ENT_QUOTES);

	$sql = "INSERT INTO z_chat_conversation (chat, user, type, content, content_original, ip_address ".($reply ? ', reply' : '').")
			VALUES ($id, $session, '$type', '$content', '$contentOriginal', '$ipAddress' ".($reply ? ', $reply' : '').")";
	$result = $conn->query($sql);
	$insertedId = $conn->insert_id;

	$inserted = getChatConversationComment($insertedId);
	echo json_encode($inserted);
	
	$conn->close();
?>
