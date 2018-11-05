<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = $_GET['session'];
	$id = $_GET['id'];

	$sql = "SELECT u.id, u.private
			FROM z_photos_likes p
				INNER JOIN z_users u ON p.user = u.id 
			WHERE photo = $id
			ORDER BY date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();

		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['id']);
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
