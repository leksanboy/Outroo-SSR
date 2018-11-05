<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$id = $_GET['id'];

	$sql = "SELECT id, user, comment, date
			FROM z_photos_comments
			WHERE photo = $id AND is_deleted = 0 
			ORDER BY date DESC 
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['user']);
			$row['comment'] = trim($row['comment']) ? html_entity_decode($row['comment'], ENT_QUOTES) : null;
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
