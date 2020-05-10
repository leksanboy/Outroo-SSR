<?php include "../db.php";

	$sql = "SELECT id,
					title
			FROM z_audios_genres
			ORDER by title ASC";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
