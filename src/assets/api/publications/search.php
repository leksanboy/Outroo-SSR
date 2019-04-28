<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$caption = $_GET['caption'];

	// Insert search data analytics
	searchPublicationAnalytics($session, $caption, 'publication');

	// Publications
	$sql = "SELECT id, 
					user, 
					name, 
					url_video as urlVideo, 
					photos, 
					date
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
		$data = array();
		
		while($row = $result->fetch_assoc()) {
			// Check if publication contains photos or photos + urlvideo
			if (count(json_decode($row['photos'])) > 0 || 
			   (count(json_decode($row['photos'])) > 0 && count(json_decode($row['urlVideo'])) > 0)
			) {
				$row['type'] = 'photo';
				$row['photos'] = getPhotoData(json_decode($row['photos'])[0]);
				$row['urlVideo'] = null;
			} else { 
				if (count(json_decode($row['urlVideo'])) > 0) {
					$row['type'] = 'url';
					$row['photos'] = null;

					// Format urlVideo
					$row['urlVideo'] = json_decode($row['urlVideo']);
					$row['urlVideo']->title = html_entity_decode($row['urlVideo']->title, ENT_QUOTES);
					$row['urlVideo']->channel = html_entity_decode($row['urlVideo']->channel, ENT_QUOTES);
					$row['urlVideo']->iframe = html_entity_decode($row['urlVideo']->iframe, ENT_QUOTES);
				} else {
					$row['type'] = 'other';
					$row['urlVideo'] = null;
					$row['photos'] = null;
				}
			}
			
			// Get user information
			$row['user'] = userUsernameNameAvatar($row['user']);
			$data[] = $row;
		}

		$data = array_chunk($data, 3);
		
		echo json_encode($data);
	} else {
		var_dump(http_response_code(204));
	}
	
	$conn->close();
?>