<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = htmlspecialchars($_GET['caption'], ENT_QUOTES);

	// Insert search data analytics
	searchPublicationAnalytics($session, $caption, 'publication');

	// Publications
	$sql = "SELECT id,
					name,
					photos as contentData
			FROM z_publications
			WHERE hashtags LIKE '%$caption%'
				AND (
						(length(photos) > 0 AND is_deleted = 0)
					)
			ORDER BY date DESC
			LIMIT $more, $cuantity";

	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			// Format photos
			$row['contentData'] = json_decode($row['contentData']);
			foreach ($row['contentData'] as &$p) {
				$p = getPhotoData($p);
			}

			if ($row['contentData']) {
				$row['contentData'] = $row['contentData'][0];
			}

			$data[] = $row;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>