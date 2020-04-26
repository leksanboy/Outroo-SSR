<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = $_GET['caption'];

	// Insert search data analytics
	searchPublicationAnalytics($session, $caption, 'top');

	// Users
	$sqlUsers = "SELECT id, about, official, private 
				FROM z_users 
				WHERE (username LIKE '%$caption%' OR name LIKE '%$caption%') 
					AND is_deleted = 0 
				ORDER by username ASC, name ASC 
				LIMIT $more, $cuantity";
	$resultUsers = $conn->query($sqlUsers);

	$dataUsers = array();
	if ($resultUsers->num_rows > 0) {
		while($row = $resultUsers->fetch_assoc()) {
			$row['type'] = 'user';
			$row['user'] = userUsernameNameAvatar($row['id']);
			$row['about'] = html_entity_decode($row['about'], ENT_QUOTES);
			$row['status'] = checkFollowingStatus($session, $row['id']);
			$row['private'] = $row['private'] ? true : false;
			$dataUsers[] = $row;
		}
	}

	// Hashtags
	$sqlHashtags = "SELECT id, hashtags
			FROM z_publications
			WHERE hashtags LIKE '%$caption%' 
				AND (
						(length(photos) > 0 AND is_deleted = 0) OR  
						(length(url_video) > 0 AND is_deleted = 0) OR 
						((length(photos) > 0 AND length(url_video) > 0) AND is_deleted = 0)
					)
			ORDER BY date DESC 
			LIMIT $more, $cuantity";
	$resultHashtags = $conn->query($sqlHashtags);

	$dataHashtags = array();
	if ($resultHashtags->num_rows > 0) {
		while($row = $resultHashtags->fetch_assoc()) {
			$row['caption'] = json_decode($row['hashtags']);
			
			foreach ($row['caption'] as &$h) {
				if (strpos(strtolower($h), strtolower($caption)) !== false) {
					$tag = array(
						'caption' 	=> $h,
						'type' 		=> 'hashtag',
						'count' 	=> hashtagCount($h)
					);

					$dataHashtags[] = $tag;
				}
			}
		}
	}

	// Data
	if ($resultUsers->num_rows === 0 && $resultHashtags->num_rows === 0) {
		var_dump(http_response_code(204));
	} else {
		// Order alphabetically
		sort($dataHashtags);

		// Not repeat values
		$dataHashtags = array_unique($dataHashtags, SORT_REGULAR);

		foreach ($dataHashtags as &$h) {
			$dataUsers[] = $h;
		}

		echo json_encode($dataUsers);
	}

	$conn->close();
?>
