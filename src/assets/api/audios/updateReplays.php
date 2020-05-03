<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$playlistId = $data['playlistId'];

	$sql = "INSERT INTO z_audios_replays (user, song, ip_address)
			VALUES ($session, $id, '$ipAddress')";
	$conn->query($sql);

	if ($playlistId) {
		$sqlPlaylist = "INSERT INTO z_audios_playlist_replays (user, song, playlist, ip_address)
			VALUES ($session, $id, $playlistId, '$ipAddress')";
		$conn->query($sqlPlaylist);
	}

	var_dump(http_response_code(204));

	$conn->close();
?>
