<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$type = $_GET['type'];
	$user = $_GET['user'];

	if ($type == 'default') {
		if ($more == 0)
			$user = userId($user);

		$sql = "SELECT f.id, f.song, m.name, m.title, m.original_title, m.original_artist, m.duration, m.image
				FROM z_audios_favorites f
					INNER JOIN z_audios m ON m.id = f.song
				WHERE f.user = $user AND f.is_deleted = 0
				ORDER BY f.date DESC
				LIMIT $more, $cuantity";
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
	} else if ($type == 'around') {
		$sql = "SELECT id, name, title, original_title, original_artist, duration, image
				FROM z_audios
				WHERE is_deleted = 0
				ORDER by inet_aton('$ipAddress')
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				$row['song'] = $row['id'];
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
	} else if ($type == 'top') {
		$dateFrom = date('Y-m-d', strtotime('-1 days'));
		$dateTo = date('Y-m-d', strtotime('+1 days'));

		$sql = "SELECT a.id, a.name, a.title, a.original_title, a.original_artist, a.duration, a.image, COUNT(r.song) AS replays
				FROM z_audios a
					INNER JOIN z_audios_replays r on a.id = r.song
				WHERE (r.date BETWEEN '$dateFrom' AND '$dateTo') AND a.is_deleted = 0
					GROUP BY a.id 
				ORDER by replays DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				$row['song'] = $row['id'];
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
	} else if ($type == 'fresh') {
		$sql = "SELECT id, name, title, original_title, original_artist, duration, image
				FROM z_audios
				WHERE is_deleted = 0
				ORDER by date DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();
			while($row = $result->fetch_assoc()) {
				$row['song'] = $row['id'];
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
	}
?>
