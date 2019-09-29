<?php include "../db.php";
	$session = sessionId();
	$user = $_GET['user'];
	$type = $_GET['type'];

	// Playlists for list or combo
	if ($type === 'default') {
		$sql = "SELECT id, 
						title, 
						image, 
						private,
						user
				FROM z_audios_playlist
				WHERE user = $user 
					AND is_deleted = 0 
				ORDER BY date DESC";
		$result = $conn->query($sql);
	} else if ($type === 'session') {
		$sql = "SELECT id, 
						title, 
						image, 
						private
				FROM z_audios_playlist
				WHERE user = $session 
					AND is_deleted = 0 
				ORDER BY date DESC";
		$result = $conn->query($sql);
	} else if ($type === 'top') {
		$sql = "SELECT id, 
						title, 
						image, 
						private, 
						user 
				FROM z_audios_playlist
				WHERE is_deleted = 0 
				ORDER BY RAND() 
					AND date DESC
				LIMIT 10";
		$result = $conn->query($sql);
	}

	// Result
	if ($result->num_rows > 0) {
		$data = array();
		
		while($row = $result->fetch_assoc()) {
			$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
			$row['private'] = $row['private'] ? true : false;
			$row['idPlaylist'] = $row['id'];
			
			if ($row['user'])
				$row['user'] = userUsernameNameAvatar($row['user']);
			
			// if ($session === $user)
			// 	$data[] = $row;
			// else
			// 	if (!$row['private'])
			// 		$data[] = $row;

			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>
