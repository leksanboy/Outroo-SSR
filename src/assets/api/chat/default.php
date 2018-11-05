<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$user = $_GET['user'];

	$sql = "SELECT c.id
			FROM z_chat c
				INNER JOIN z_chat_users u ON c.id = u.chat
			WHERE u.user = $user AND u.is_deleted = 0 AND c.initialized = 1 
			ORDER BY c.date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['users'] = getChatConversationUsers($row['id'], $user);
			$row['last'] = getChatConversationLastComment($row['id']);
			$row['list'] = [];
			
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
