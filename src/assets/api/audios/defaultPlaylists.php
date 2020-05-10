<?php include "../db.php";
	$session = sessionId();
	$user = $_GET['user'];
	$type = $_GET['type'];

	// Playlists for list
	if ($type === 'default') {
		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						description,
						genre,
						image,
						private
				FROM z_audios_playlist
				WHERE user = $user
					AND is_deleted = 0
				ORDER BY date DESC
				LIMIT 0, 11";
		$result = $conn->query($sql);
	} else if ($type === 'session') {
		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						description,
						genre,
						image,
						private
				FROM z_audios_playlist
				WHERE user = $session
					AND is_deleted = 0
				ORDER BY date DESC";
		$result = $conn->query($sql);
	} else if ($type === 'top') {
		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						description,
						genre,
						image,
						private
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

			if ($row['type'] === 'follow') {
				$f_row = getPlaylist($row['o_id']);

				$row['name'] = $f_row['name'];
				$row['title'] = $f_row['title'];
				$row['image'] = $f_row['image'];
			}

			if ($session === $user) {
				$data[] = $row;
			} else {
				if (!$row['private']) {
					$data[] = $row;
				}
			}
		}

		if ($type === 'default') {
			$res = array(
				'list'	=> array_slice($data, 0, 10),
				'count'	=> $result->num_rows
			);

			echo json_encode($res);
		} else {
			echo json_encode($data);
		}
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
