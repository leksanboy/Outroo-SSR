<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = $_GET['session'];
	$user = $_GET['user'];
	$caption = $_GET['caption'];

	$sql = "SELECT u.id, u.about, u.official, u.private
			FROM z_following f
				INNER JOIN z_users u ON f.receiver = u.id
			WHERE f.sender = $user 
				AND (u.username LIKE '%$caption%' OR u.name LIKE '%$caption%') 
				AND f.is_deleted = 0
			ORDER by u.username ASC, u.name ASC
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
