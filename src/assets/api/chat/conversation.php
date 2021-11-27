<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$id = $_GET['id'];

	$sql = "SELECT id,
					user,
					type,
					content,
					publication,
					date
			FROM z_chat_conversation
			WHERE chat = $id 
				AND is_deleted = 0
			ORDER BY date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['user']);

			if ($row['type'] == 'publication'){
				$row['publication'] = getPublication($row['publication']);
			} else {
				$row['content'] = trim($row['content']) ? html_entity_decode($row['content'], ENT_QUOTES) : null;
			}

			$data[] = $row;
		}

		echo json_encode(array_reverse($data));
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
