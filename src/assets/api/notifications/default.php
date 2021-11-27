<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = sessionId();
	$type = $_GET['type'];

	$sql = "SELECT
				n.id,
				n.sender,
				n.receiver,
				n.is_seen,
				n.date,
				n.page_id as page,
				n.page_url as url,
				n.page_type as type,
				n.comment_id as comment
			FROM z_notifications n
			WHERE n.is_deleted = 0
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
						WHEN n.page_url = 'user' THEN
							EXISTS (SELECT 1 FROM z_users WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'followers' THEN
							EXISTS (SELECT 1 FROM z_following WHERE receiver = n.receiver and is_deleted = 0)
					END
				)
			ORDER BY n.date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();

		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['sender']);

			// Upgrade status
			if ($type !== 'box') {
				if ($row['is_seen'] == 0) {
					updateNotificationStatus($row['id']);
				}
			}

			// Followers
			if ($row['url'] === 'followers') {
				$row['status'] = checkFollowingStatus($session, $row['sender']);
				$row['private'] = checkUserPrivacy($row['sender']);
			}

			// Publications
			if ($row['url'] === 'publication') {
				$row['contentData'] = getIdNameContentMediaCommentFromPublicationById($row['page'], $row['comment']);
			}

			// Audios
			if ($row['url'] === 'audio') {
				$row['contentData'] = getSongById($row['page']);
			}

			// Playlist
			if ($row['url'] === 'playlist') {
				$row['contentData'] = getPlaylist('id', $row['page']);
			}

			// User
			if ($row['url'] === 'user') {
				$row['contentData'] = userUsernameNameAvatar($row['page']);
			}

			// Message
			/* if ($row['url'] === 'message') {
				$row['contentData'] = getMessageById($row['page']);
			} */

			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
