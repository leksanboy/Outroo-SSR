<?php include "../db.php";
	$session = sessionId();
	$type = $_GET['type'];

	$sql = "SELECT
				n.id,
				n.page_url,
				n.page_id
			FROM z_notifications n
			WHERE n.is_deleted = 0
				AND n.is_seen = 0
				AND n.receiver = $session
				AND
				(
					CASE
						WHEN n.page_url = 'publication' THEN
							EXISTS (SELECT 1 FROM z_publications WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'audio' THEN
							EXISTS (SELECT 1 FROM z_audios WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'playlist' THEN
							EXISTS (SELECT 1 FROM z_audios_playlist WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'followers' THEN
							EXISTS (SELECT 1 FROM z_following WHERE receiver = n.receiver and is_deleted = 0)
					END
				)";
	$result = $conn->query($sql);

	if ($type === 'default') {
		echo $result->num_rows;
	} else if ($type === 'update') {
		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				if ($row['is_seen'] == 0) {
					updateNotificationStatus($row['id']);
				}
			}
		}

		var_dump(http_response_code(204));
	}

	$conn->close();
?>
