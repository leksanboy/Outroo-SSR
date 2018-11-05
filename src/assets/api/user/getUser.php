<?php include "../db.php";
	$id = userId($_GET['id']);

	if ($id) {
		$sql = "SELECT id, username, name, avatar, background, email, about, about_original as aboutOriginal, language, theme, official, private 
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				if ($id == $row['id'])
					$row['playlists'] = getPlaylists($row['id']);

				$row['avatarUrl'] = $row['avatar'] ? ('./assets/media/user/'.$row['id'].'/avatar/'.$row['avatar']) : '';
				$row['backgroundUrl'] = $row['background'] ? ('./assets/media/user/'.$row['id'].'/background/'.$row['background']) : '';
				$row['languages'] = getLanguages();
				$row['theme'] = $row['theme'] ? true : false;
				$row['official'] = $row['official'] ? true : false;
				$row['private'] = $row['private'] ? true : false;
				$row['name'] = html_entity_decode($row['name'], ENT_QUOTES);
				$row['about'] = html_entity_decode($row['about'], ENT_QUOTES);
				$row['aboutOriginal'] = html_entity_decode($row['aboutOriginal'], ENT_QUOTES);
				$row['countFollowing'] = countUserFollowing($id);
				$row['countFollowers'] = countUserFollowers($id);
				$row['countPhotos'] = countUserPhotos($id);
				$row['countAudios'] = countUserAudios($id);
				$row['countBookmarks'] = countUserBookmarks($id);
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
