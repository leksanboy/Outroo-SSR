<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$user = $_GET['user'];

	if ($more == 0)
		$user = userId($user);

	$sql = "SELECT f.id, f.photo, p.name, f.date, f.disabled_comments, p.mimetype, p.duration
			FROM z_photos_favorites f 
				INNER JOIN z_photos p ON p.id = f.photo
			WHERE f.user = $user AND f.is_deleted = 0 
			ORDER BY f.date DESC 
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['countLikes'] = countLikesPhoto($row['id']);
			$row['countComments'] = countCommentsPhoto($row['id']);
			$row['disabledComments'] = ($row['disabled_comments'] == 0) ? true : false;
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>
