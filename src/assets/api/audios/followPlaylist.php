<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$title = $data['title'];
	$type = $data['type'];
	$location = $data['location'];
	$imageName = $data['image'] ? $data['image'] : '';
	$insertedPlaylist = $data['insertedPlaylist'];

	if (!$insertedPlaylist) {
		$sql = "INSERT INTO z_audios_playlist (original_id, type, user, ip_address)
				VALUES ($id, 'follow', $session, '$ipAddress')";
		$conn->query($sql);
		$insertedId = $conn->insert_id;

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
?>
