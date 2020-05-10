<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = $_GET['caption'];

	$sql = "SELECT id,
					name,
					title,
					original_title,
					original_artist,
					duration,
					image
			FROM z_audios
			WHERE title LIKE '%$caption%' OR
					original_title LIKE '%$caption%' OR
					original_artist LIKE '%$caption%'
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
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
