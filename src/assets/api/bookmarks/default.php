<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$user = $_GET['session'];

	$sql = "SELECT b.id, b.user, p.name, p.url_video as urlVideo, p.photos
			FROM z_bookmarks b
				INNER JOIN z_publications p ON p.id = b.post 
			WHERE b.user = $user 
				AND b.is_deleted = 0 
				AND p.is_deleted = 0
			ORDER BY b.id DESC 
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
