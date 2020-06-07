<?php include "../db.php";
	$session = sessionId();
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = htmlspecialchars($_GET['caption'], ENT_QUOTES);
	$type = $_GET['type'] ? $_GET['type'] : 'song';

	// Insert search data analytics
	searchAudioAnalytics($session, $caption, $type);

	if ($type === 'song') { // min 4 chars to correct search
		$caption = "+".str_replace(' ', " +", $caption);

		$sql = "SELECT id,
						name,
						title,
						original_title,
						original_artist,
						duration,
						image,
						explicit,
						MATCH(`title`) AGAINST ('$caption' IN BOOLEAN MODE) * 10 as rel1,
						MATCH(`original_title`) AGAINST ('$captionn' IN BOOLEAN MODE) * 3 as rel2,
						MATCH(`original_artist`) AGAINST ('$captionn' IN BOOLEAN MODE) as rel3
				FROM `z_audios`
				WHERE MATCH (title, original_title, original_artist) AGAINST ('$caption' IN BOOLEAN MODE)
				ORDER BY (rel1)+(rel2)+(rel3) DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['song'] = $row['id'];
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
				$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
				$row['explicit'] = boolval($row['explicit']);
				$data[] = $row;
			}

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	} else if ($type === 'playlist') {
		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE (title LIKE '%$caption%' OR description LIKE '%$caption%')
					AND is_deleted = 0
					AND private = 0
					AND type IS NULL
					AND original_id IS NULL
				ORDER BY title
					AND date DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				$data[] = $row;
			}

			echo json_encode($data);
		} else {
			var_dump(http_response_code(204));
		}

		$conn->close();
	}
?>
