<?php include "../db.php";
	$name = $_GET['name'];

	$sql = "SELECT f.id, f.user, f.photo, p.name, f.date, f.disabled_comments, p.mimetype, p.duration
			FROM z_photos_favorites f 
				INNER JOIN z_photos p ON p.id = f.photo
			WHERE p.name = '$name'";
	$result = $conn->query($sql)->fetch_assoc();

	if ($result['id']){
		$result['countLikes'] = countLikesPhoto($result['id']);
		$result['countComments'] = countCommentsPhoto($result['id']);
		$result['disabledComments'] = ($result['disabled_comments'] == 0) ? true : false;

		$data = array(
			'user' => userUsernameNameAvatar($result['user']),
			'data' => $result
		);

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
