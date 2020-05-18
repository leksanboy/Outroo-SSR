<?php include "../db.php";
	$session = sessionId();
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = $_GET['caption'];
	$type = $_GET['type'] ? $_GET['type'] : 'song';

	// Insert search data analytics
	searchAudioAnalytics($session, $caption, $type);

	$sql = "SELECT id,
					name,
					title,
					original_title,
					original_artist,
					duration,
					image,
					explicit
			FROM z_audios
			WHERE title LIKE '%$caption%'
				OR
				original_title LIKE '%$caption%'
				OR
				original_artist LIKE '%$caption%'
				AND is_deleted = 0
			ORDER by title ASC,
					original_title ASC,
					original_artist ASC
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
?>
