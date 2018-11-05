<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$user = $_GET['user'];
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
				AND
				(
					EXISTS (SELECT 1 FROM z_publications     WHERE id    = n.page_id and is_deleted = 0)
					OR
					EXISTS (SELECT 1 FROM z_photos_favorites WHERE photo = n.page_id and is_deleted = 0)
				)
				AND n.receiver = $user 
			ORDER BY n.date DESC 
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['sender']);

			// Upgrade status
			if ($row['type'] != 'box')
				if ($row['status'] == '0')
					updateNotificationStatus($row['id']);

			// Followers
			if ($row['url'] == 'followers') {
				$row['statusFollowing'] = checkFollowingStatus($user, $row['sender']);
				$row['private'] = checkUserPrivacy($row['sender']);
			}

			// Photos
			if ($row['url'] == 'photos')
				$row['contentData'] = getIdNameContentMediaCommentFromPhotoById($row['page'], $row['comment']);

			// Publications
			if ($row['url'] == 'publications')
				$row['contentData'] = getIdNameContentMediaCommentFromPublicationById($row['page'], $row['comment']);

			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>
