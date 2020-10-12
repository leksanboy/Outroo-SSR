<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$title = $data['title'];
	$name = generateRandomString(23);
	$type = $data['type'];
	$location = $data['location'];
	$imageName = $data['image'] ? $data['image'] : '';
	$insertedPlaylist = $data['insertedPlaylist'];

	if ($location === 'session') { // Update on session page
		$status = ($type == 'remove') ? 1 : 0;

		$sql = "UPDATE z_audios_playlist
				SET is_deleted = $status,
					ip_address = '$ipAddress'
				WHERE id = $id
					AND user = $session";
		$conn->query($sql);

		var_dump(http_response_code(204));

		$conn->close();
	} else if ($location === 'user') { // Add/Remove
		if (!$insertedPlaylist) {
			$sql = "INSERT INTO z_audios_playlist (original_id, user, title, name, image, ip_address)
					VALUES ($id, $session, '$title', '$name', '$imageName', '$ipAddress')";
			$conn->query($sql);
			$insertedId = $conn->insert_id;

			// Get songs from one playlist and insert on another
			$sqlSongs = "INSERT INTO z_audios_playlist_songs (playlist, song, ip_address)
							SELECT $insertedId,
									s.song,
									'$ipAddress'
							FROM z_audios_playlist_songs s
							WHERE s.playlist = $id
								AND s.is_deleted = 0";
			$conn->query($sqlSongs);

			echo json_encode($insertedId);

			$conn->close();
		} else {
			$status = ($type == 'remove') ? 1 : 0;

			$sql = "UPDATE z_audios_playlist
					SET is_deleted = $status,
						ip_address = '$ipAddress'
					WHERE id = $insertedPlaylist
						AND user = $session";
			$conn->query($sql);

			echo json_encode($insertedPlaylist);

			$conn->close();
		}
	}
?>
