<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$item = $data['item'];
	$playlist = $data['playlist'];
	$type = $data['type'];
	$location = $data['location'];

	if ($location === 'session') { // Update on session page
		$status = ($type == 'remove') ? 1 : 0;

		$sql = "UPDATE z_audios_favorites
				SET is_deleted = $status,
					ip_address = '$ipAddress'
				WHERE id = $id
					AND user = $session";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));

		$conn->close();
	} else if ($location === 'user') { // Add/Remove
		if ($type == 'add') {
			$sql = "INSERT INTO z_audios_favorites (user, song, ip_address)
					VALUES ($session, $item, '$ipAddress')";
			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			echo $insertedId;

			$conn->close();
		} else if ($type == 'remove') {
			$sql = "UPDATE z_audios_favorites
					SET is_deleted = 1
					WHERE id = $id
						AND user = $session";
			$result = $conn->query($sql);

			var_dump(http_response_code(204));

			$conn->close();
		}
	} else if ($location === 'playlist') { // Add/Remove
		if ($type == 'add') {
			$sql = "INSERT INTO z_audios_playlist_songs (playlist, song, ip_address)
					VALUES ($playlist, $item, '$ipAddress')";
			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			echo $insertedId;
			
			$conn->close();
		} else if ($type == 'remove') {
			$sql = "UPDATE z_audios_playlist_songs
					SET is_deleted = 1
					WHERE id = $id";
			$result = $conn->query($sql);

			var_dump(http_response_code(204));
			
			$conn->close();
		}
	}
?>
