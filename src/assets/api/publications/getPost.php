<?php include "../db.php";
	$session = sessionId();
	$name = $_GET['name'];
	$id = $_GET['id'];

	if ($id) {
		$cond = "id = $id";
	} else {
		$cond = "name = '$name'";
	}

	$sql = "SELECT id,
					user,
					name,
					content,
					content_original,
					url_video as urlVideo,
					photos,
					audios,
					disabled_comments as disabledComments,
					date,
					is_deleted as d
			FROM z_publications
			WHERE $cond
			ORDER BY date DESC";
	$result = $conn->query($sql)->fetch_assoc();

	if ($result) {
		if ($result['d'] == 0 || ($result['d'] == 1 && $session == $result['user'])) {
			$result['user'] = userUsernameNameAvatar($result['user']);
			$result['content'] = trim($result['content']) ? html_entity_decode($result['content'], ENT_QUOTES) : null;
			$result['likers'] = getPublicationLikers($result['id']);
			$result['disabledComments'] = intval($result['disabledComments']) === 0 ? false : true;
			$result['countComments'] = countCommentsPublication($result['id']);
			$result['countLikes'] = countLikesPublication($result['id']);
			$result['comments'] = [];

			if ($session) {
				$result['bookmark'] = checkMarkedPublication($result['id'], $session);
				$result['liked'] = checkLikedPublication($result['id'], $session);
			}

			// Format urlVideo
			$result['urlVideo'] = json_decode($result['urlVideo']);
			if (count($result['urlVideo']) > 0) {
				$result['urlVideo']->title = html_entity_decode($result['urlVideo']->title, ENT_QUOTES);
				$result['urlVideo']->channel = html_entity_decode($result['urlVideo']->channel, ENT_QUOTES);
				$result['urlVideo']->iframe = html_entity_decode($result['urlVideo']->iframe, ENT_QUOTES);
			} else {
				$result['urlVideo'] = null;
			}

			// Format photos
			$result['photos'] = json_decode($result['photos']);
			foreach ($result['photos'] as &$p) {
				$p = getPhotoData($p);
			}

			// Format audios
			$result['audios'] = json_decode($result['audios']);
			foreach ($result['audios'] as &$a) {
				$a = getAudioData($a);
			}

			// Para recuperar la publicación si esta eliminada, solo la ve el creador del post
			if ($result['d'] == 1) {
				$result['addRemoveSession'] = true;
			}

			echo json_encode($result);
		} else {
			var_dump(http_response_code(204));
		}
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
