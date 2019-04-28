<?php include "../db.php";
	$id = $_GET['id'];

	$sql = "SELECT s.id, 
					a.id as song, 
					a.name, 
					a.title, 
					a.original_title, 
					a.original_artist, 
					a.duration, 
					a.image
			FROM z_audios_playlist_songs s
				INNER JOIN z_audios a ON a.id = s.song
			WHERE s.playlist = $id 
				AND s.is_deleted = 0";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
			$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
			$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
