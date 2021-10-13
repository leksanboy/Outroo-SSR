<?php include "../db.php";
	$user = userId($_GET['id']);
	$session = sessionId();

	if ($user) {
		$sql = "SELECT id,
						username,
						name,
						avatar,
						background,
						email,
						about,
						language,
						theme,
						mini_player as mp,
						email_promos as ep,
						official,
						private
				FROM z_users
				WHERE id = $user";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				$row['avatarUrl'] 			= $row['avatar'] ? ('https://beatfeel.com/assets/media/user/'.$row['id'].'/avatar/'.$row['avatar']) : '';
				$row['languages'] 			= getLanguages();
				$row['theme'] 				= intval($row['theme']);
				$row['mp'] 					= $row['mp'] ? true : false;
				$row['ep'] 					= $row['ep'] ? true : false;
				$row['official'] 			= $row['official'] ? true : false;
				$row['private'] 			= $row['private'] ? true : false;
				$row['name'] 				= html_entity_decode($row['name'], ENT_QUOTES);
				$row['about'] 				= html_entity_decode($row['about'], ENT_QUOTES);
				$row['countFollowing'] 		= countUserFollowing($row['id']);
				$row['countFollowers'] 		= countUserFollowers($row['id']);
				$row['countAudios'] 		= countUserAudios($row['id']);
				$row['countBookmarks'] 		= countUserBookmarks($row['id']);

				if ($session) {
					$row['status'] = checkFollowingStatus($session, $row['id']);

					// Set who vist my page
					setVisitor($session, $row['id']);
				}

				if ($session === $row['id']) {
					$row['playlists'] 		= getPlaylistsSelect($row['id']);
				}

				$data = $row;
			}

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	} else {
		echo json_encode('');
	}
?>
