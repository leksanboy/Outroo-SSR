<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$type = $_GET['type'];
	$session = $_GET['session'];
	$user = $_GET['user'];

	if ($type == 'user') {
		if ($more == 0)
			$user = userId($user);

		$sql = "SELECT id, user, name, content, content_original, url_video as urlVideo, photos, audios, disabled_comments as disabledComments, date
				FROM z_publications
				WHERE user = $user AND is_deleted = 0
				ORDER BY date DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				$row['user'] = userUsernameNameAvatar($row['user']);
				$row['content'] = trim($row['content']) ? html_entity_decode($row['content'], ENT_QUOTES) : null;
				$row['bookmark'] = checkMarkedPublication($row['id'], $session);
				$row['liked'] = checkLikedPublication($row['id'], $session);
				$row['likers'] = getPublicationLikers($row['id']);
				$row['disabledComments'] = ($row['disabledComments'] == 0) ? true : false;
				$row['countComments'] = countCommentsPublication($row['id']);
				$row['countLikes'] = countLikesPublication($row['id']);
				$row['comments'] = [];

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

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	} else if ($type == 'home') {
		$sql = "SELECT id, user, name, content, content_original, url_video as urlVideo, photos, audios, disabled_comments as disabledComments, date
				FROM z_publications
				WHERE (user IN (SELECT
									CASE
										WHEN f.sender = $user THEN f.receiver
									END
									FROM z_following f WHERE f.sender = $user AND is_deleted = 0)
						OR user = $user) AND is_deleted = 0
				ORDER BY id DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				$row['user'] = userUsernameNameAvatar($row['user']);
				$row['content'] = trim($row['content']) ? html_entity_decode($row['content'], ENT_QUOTES) : null;
				$row['bookmark'] = checkMarkedPublication($row['id'], $session);
				$row['liked'] = checkLikedPublication($row['id'], $session);
				$row['likers'] = getPublicationLikers($row['id']);
				$row['disabledComments'] = ($row['disabledComments'] == 0) ? true : false;
				$row['countComments'] = countCommentsPublication($row['id']);
				$row['countLikes'] = countLikesPublication($row['id']);
				$row['comments'] = [];

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

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	} else if ($type == 'news') {
		$sql = "SELECT id, user, name, url_video as urlVideo, photos, date
				FROM z_publications
				WHERE (length(photos) > 0 AND is_deleted = 0) OR  
						(length(url_video) > 0 AND is_deleted = 0) OR 
						((length(photos) > 0 AND length(url_video) > 0) AND is_deleted = 0)
				ORDER BY rand() 
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				// Check if publication contains photos or photos + urlvideo
				if (count(json_decode($row['photos'])) > 0 || 
				   (count(json_decode($row['photos'])) > 0 && count(json_decode($row['urlVideo'])) > 0)
				) {
					$row['type'] = 'photo';
					$row['photos'] = getPhotoData(json_decode($row['photos'])[0]);
					$row['urlVideo'] = null;
				} else { 
					if (count(json_decode($row['urlVideo'])) > 0) {
						$row['type'] = 'url';
						$row['photos'] = null;

						// Format urlVideo
						$row['urlVideo'] = json_decode($row['urlVideo']);
						$row['urlVideo']->title = html_entity_decode($row['urlVideo']->title, ENT_QUOTES);
						$row['urlVideo']->channel = html_entity_decode($row['urlVideo']->channel, ENT_QUOTES);
						$row['urlVideo']->iframe = html_entity_decode($row['urlVideo']->iframe, ENT_QUOTES);
					} else {
						$row['type'] = 'other';
						$row['urlVideo'] = null;
						$row['photos'] = null;
					}
				}
				
				// Get user information
				$row['user'] = userUsernameNameAvatar($row['user']);
				$data[] = $row;
			}

			$data = array_chunk($data, 3);
			
			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}
		
		$conn->close();
	}
?>
