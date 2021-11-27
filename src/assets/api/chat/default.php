<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = sessionId();

	$sql = "SELECT c.id
			FROM z_chat c
				INNER JOIN z_chat_users u ON c.id = u.chat
			WHERE u.user = $session
				AND u.is_deleted = 0
				AND c.initialized = 1 
			ORDER BY c.date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['users'] = getChatUsers($row['id'], $session);
			$row['last'] = getChatConversationLastComment($row['id']);
			
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
