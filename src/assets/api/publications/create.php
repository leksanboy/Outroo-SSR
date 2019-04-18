<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $data['user'];
	$name = generateRandomString(23);
	$content = htmlspecialchars($data['content'], ENT_QUOTES);
	$contentOriginal = htmlspecialchars($data['contentOriginal'], ENT_QUOTES);
	$hashtags = count($data['hashtags']) > 0 ? json_encode($data['hashtags']) : null;
	$mentions = count($data['mentions']) > 0 ? json_encode($data['mentions']) : null;
	$mentionsNotificate = $data['mentions'];
	$urlVideo = $data['urlVideo'];
	$photos = $data['photos'];
	$audios = $data['audios'];

	// Scape special chars in urlVideo array
	if ($urlVideo) {
		$urlVideo['title'] = htmlspecialchars($urlVideo['title'], ENT_QUOTES);
		$urlVideo['channel'] = htmlspecialchars($urlVideo['channel'], ENT_QUOTES);
		$urlVideo['iframe'] = htmlspecialchars($urlVideo['iframe'], ENT_QUOTES);
		$urlVideo = json_encode($urlVideo);
	} else {
		$urlVideo = null;
	}

	// Create new array and insert photo & video files on table
	if ($photos) {
		$photosArray = array();
		
		foreach($photos as $row){
			if ($row['uploaded'])
				$insertedPhoto = uploadPhotosPublication($user,
														$row['name'],
														($row['mimetype'] ? $row['mimetype'] : 'image/jpeg'),
														$row['duration']);

			$newPhoto = ($row['uploaded'] ? $insertedPhoto : $row['id']);
			$photosArray[] = $newPhoto;
		}

		$photosArray = json_encode($photosArray);
	} else {
		$photosArray = null;
	}

	// Create new array and insert audio files on table
	if ($audios) {
		$audiosArray = array();
		foreach($audios as $row){
			if ($row['uploaded'])
				$insertedAudio = uploadAudiosPublication($user,
														$row['up_name'].'.mp3',
														$row['mimetype'],
														htmlspecialchars($row['title'], ENT_QUOTES),
														htmlspecialchars($row['up_original_title'], ENT_QUOTES),
														htmlspecialchars($row['up_original_artist'], ENT_QUOTES),
														$row['up_genre'],
														$row['up_image'],
														$row['up_duration']);

			$newAudio = ($row['uploaded'] ? $insertedAudio : $row['song']);
			$audiosArray[] = $newAudio;
		}

		$audiosArray = json_encode($audiosArray);
	} else {
		$audiosArray = null;
	}

	// Set query
	$sql = "INSERT INTO z_publications (user, name, content, content_original, mentions, hashtags, url_video, photos, audios, ip_address)
			VALUES ($user, '$name', '$content', '$contentOriginal', '$mentions', '$hashtags', '$urlVideo', '$photosArray', '$audiosArray', '$ipAddress')";
	$result = $conn->query($sql);
	$insertedId = $conn->insert_id;

	// Notificate mentioned friends on publication
	foreach($mentionsNotificate as $row){
		$rcv = userId(substr($row, 1));
	
		if ($rcv) {
			$notification = array(
				"url" 		=> 'publications',
				"type" 		=> 'mention',
				"sender" 	=> $user,
				"receiver" 	=> $rcv,
				"id" 		=> $insertedId
			);

			generateNotification($notification);
		}
	}

	$inserted = getPublication($insertedId);
	echo json_encode($inserted);
	
	$conn->close();
?>
