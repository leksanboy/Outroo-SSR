<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $_GET['id'];
	$name = $_GET['name'].'.mp3';

	if ($id) {
		$cond = "id = '$id'";
	} else if ($name) {
		$cond = "name = '$name'";
	}

	$sql = "SELECT id,
					user,
					name,
					title,
					original_title,
					original_artist,
					duration,
					image,
					explicit
			FROM z_audios
			WHERE $cond
				AND is_deleted = 0";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['song'] = $row['id'];
			$row['user'] = userUsernameNameAvatar($row['user']);
			$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
			$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
			$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
			$row['replays'] = counSongReplays($row['id']);
			$row['timesAdded'] = counSongTimesAdded($row['id']);
			$row['imageSrc'] = 'https://cdn.beatfeel.com/audios/thumbnails/'.$row['image'];
			$row['explicit'] = boolval($row['explicit']);
			$data[] = $row;
		}

		echo json_encode($data[0]);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
