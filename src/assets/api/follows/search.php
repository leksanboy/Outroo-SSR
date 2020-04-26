<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = sessionId();
	$caption = $_GET['caption'];

	$sql = "SELECT id,
					about,
					official,
					private
			FROM z_users
			WHERE (username LIKE '%$caption%' OR name LIKE '%$caption%')
				AND is_deleted = 0
			ORDER by username ASC, name ASC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['id']);
			$row['about'] = html_entity_decode($row['about'], ENT_QUOTES);
			$row['status'] = checkFollowingStatus($session, $row['id']);
			$row['private'] = $row['private'] ? true : false;
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
