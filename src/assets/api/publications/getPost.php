<?php include "../db.php";
	$name = $_GET['name'];
	$session = sessionId();

	$sql = "SELECT id, 
					user, 
					name, 
					content, 
					content_original, 
					url_video as urlVideo, 
					photos, 
					audios, 
					disabled_comments as disabledComments, 
					date
			FROM z_publications
			WHERE name = '$name' 
				AND is_deleted = 0
			ORDER BY date DESC";
	$result = $conn->query($sql);

	if ($result->num_rows){
		$data = array();
		
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['user']);
			$row['content'] = trim($row['content']) ? html_entity_decode($row['content'], ENT_QUOTES) : null;
			$row['likers'] = getPublicationLikers($row['id']);
			$row['disabledComments'] = intval($row['disabledComments']) === 0 ? false : true;
			$row['countComments'] = countCommentsPublication($row['id']);
			$row['countLikes'] = countLikesPublication($row['id']);
			$row['comments'] = [];

			if ($session) {
				$row['bookmark'] = checkMarkedPublication($row['id'], $session);
				$row['liked'] = checkLikedPublication($row['id'], $session);
			}

			// Format urlVideo
			$row['urlVideo'] = json_decode($row['urlVideo']);
			if (count($row['urlVideo']) > 0) {
				$row['urlVideo']->title = html_entity_decode($row['urlVideo']->title, ENT_QUOTES);
				$row['urlVideo']->channel = html_entity_decode($row['urlVideo']->channel, ENT_QUOTES);
				$row['urlVideo']->iframe = html_entity_decode($row['urlVideo']->iframe, ENT_QUOTES);
			} else {
				$row['urlVideo'] = null;
			}

			// Format photos
			$row['photos'] = json_decode($row['photos']);
			foreach ($row['photos'] as &$p) {
				$p = getPhotoData($p);
			}

			// Format audios
			$row['audios'] = json_decode($row['audios']);
			foreach ($row['audios'] as &$a) {
				$a = getAudioData($a);
			}

			$data[] = $row;
		}

		echo json_encode($data[0]);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
