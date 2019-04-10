<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$song = $_GET['song'].'.mp3';

	$sql = "SELECT id, name, title, original_title, original_artist, duration, image
			FROM z_audios
			WHERE name = '$song' AND is_deleted = 0";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
			$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
			$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
			$data[] = $row;
		}

		echo json_encode($data[0]);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>