<?php include "../db.php";
	$session = sessionId();
	$user = $_GET['user'];
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$type = $_GET['type'];

	// Update scheduled publication
	updatePublicationDate();

	if ($type === 'user') {
		if ($more === 0) {
			$user = userId($user);
		}

		if ($session == $user) {
			$sql = "SELECT id,
						name,
						photos as contentData,
						publication_date as pDate,
						is_deleted as isD
				FROM z_publications
				WHERE user = $user
					AND is_deleted = 0
					OR is_deleted = 2
				ORDER BY date DESC
				LIMIT $more, $cuantity";
		} else {
			$sql = "SELECT id,
							name,
							photos as contentData
					FROM z_publications
					WHERE user = $user
						AND is_deleted = 0
					ORDER BY date DESC
					LIMIT $more, $cuantity";
		}

		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				// Format photos
				$row['contentData'] = json_decode($row['contentData']);
				foreach ($row['contentData'] as &$p) {
					$p = getPhotoData($p);
				}

				if ($row['contentData']) {
					$row['contentData'] = $row['contentData'][0];
				}

				// Update
				if ($row['isD'] == 2) {
					if ($row['pDate'] <= date("Y-m-d H:i:s")) {
						$id = $row['id'];

						$sqlU = "UPDATE z_publications
								SET is_deleted = 0
								WHERE id = $id";
						$conn->query($sqlU);

						$row['pDate'] = null;
					}
				} else {
					$row['pDate'] = null;
				}

				$data[] = $row;
			}

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	} else if ($type === 'home') {
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
				WHERE (user IN (SELECT
									CASE
										WHEN f.sender = $user THEN f.receiver
									END
									FROM z_following f WHERE f.sender = $user AND status = 0 AND is_deleted = 0)
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
				$row['disabledComments'] = intval($row['disabledComments']) === 0 ? false : true;
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
	} else if ($type === 'news') {
		$sql = "SELECT id,
						name,
						photos as contentData
				FROM z_publications
				WHERE (length(photos) > 0 AND is_deleted = 0)
				ORDER BY rand()
				LIMIT $more, $cuantity";

		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				// Format photos
				$row['contentData'] = json_decode($row['contentData']);
				foreach ($row['contentData'] as &$p) {
					$p = getPhotoData($p);
				}

				if ($row['contentData']) {
					$row['contentData'] = $row['contentData'][0];
				}

				$data[] = $row;
			}

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	} else if ($type === 'bookmarks') {
		$sql = "SELECT p.id,
						p.name,
						p.photos as contentData
				FROM z_bookmarks b
					INNER JOIN z_publications p ON p.id = b.post
				WHERE b.user = $session
					AND b.is_deleted = 0
					AND p.is_deleted = 0
				ORDER BY b.id DESC
				LIMIT $more, $cuantity";

		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				// Format photos
				$row['contentData'] = json_decode($row['contentData']);
				foreach ($row['contentData'] as &$p) {
					$p = getPhotoData($p);
				}

				if ($row['contentData']) {
					$row['contentData'] = $row['contentData'][0];
				}

				$data[] = $row;
			}

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	}
?>
