<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = $_GET['caption'];

	// Insert search data analytics
	searchPublicationAnalytics($session, $caption, 'tag');

	// Publications
	$sql = "SELECT id, hashtags
			FROM z_publications
			WHERE hashtags LIKE '%$caption%'
				AND (
						(length(photos) > 0 AND is_deleted = 0) OR
						(length(url_video) > 0 AND is_deleted = 0) OR
						((length(photos) > 0 AND length(url_video) > 0) AND is_deleted = 0)
					)
			ORDER BY date DESC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$dataHashtags = array();

		while($row = $result->fetch_assoc()) {
			$row['caption'] = json_decode($row['hashtags']);

			foreach ($row['caption'] as &$h) {
				if (strpos(strtolower($h), strtolower($caption)) !== false) {
					$tag = array(
						'caption' 	=> $h,
						'count' 	=> hashtagCount($h)
					);

					$dataHashtags[] = $tag;
				}
			}
		}

		// Order alphabetically
		sort($dataHashtags);

		// Not repeat values
		$dataHashtags = array_unique($dataHashtags, SORT_REGULAR);

		$data = array();
		foreach ($dataHashtags as &$h) {
			$data[] = $h;
		}

		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();
?>
