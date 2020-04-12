<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = sessionId();
	$type = $_GET['type'];

	$sql = "SELECT 
				n.id, 
				n.sender, 
				n.receiver, 
				n.status, 
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
						WHEN n.page_url = 'publications' THEN 
							EXISTS (SELECT 1 FROM z_publications WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'audios' THEN 
							EXISTS (SELECT 1 FROM z_audios WHERE id = n.page_id and is_deleted = 0)
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
			if ($row['type'] !== 'box')
				if ($row['status'] == '0')
					updateNotificationStatus($row['id']);

			// Followers
			if ($row['url'] === 'followers') {
				$row['statusFollowing'] = checkFollowingStatus($session, $row['sender']);
				$row['private'] = checkUserPrivacy($row['sender']);
			}

			/*
			// Photos
			if ($row['url'] === 'photos')
				$row['contentData'] = getIdNameContentMediaCommentFromPhotoById($row['page'], $row['comment']);
			*/

			// Publications
			if ($row['url'] === 'publications') {
				$row['contentData'] = getIdNameContentMediaCommentFromPublicationById($row['page'], $row['comment']);
			}

			// Audios
			if ($row['url'] === 'audios') {
				$row['contentData'] = getSongById($row['page']);
			}

			// Message
			if ($row['url'] === 'message') {
				$row['contentData'] = getMessageById($row['page']);
			}

			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>
