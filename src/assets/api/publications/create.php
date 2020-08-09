<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$name = generateRandomString(23);
	$content = htmlspecialchars($data['content'], ENT_QUOTES);
	$contentOriginal = htmlspecialchars($data['contentOriginal'], ENT_QUOTES);
	$hashtags = count($data['hashtags']) > 0 ? json_encode($data['hashtags']) : null;
	$mentions = count($data['mentions']) > 0 ? json_encode($data['mentions']) : null;
	$mentionsNotificate = $data['mentions'];
	$photos = $data['photos'];
	$audios = $data['audios'];
	$disabledComments = $data['disabledComments'] ? 1 : 0;
	$publicationDate = $data['publicationDate'] ? $data['publicationDate'] : null;
	$cDate = time();
	$date = date('Y-m-d H:i:s');

	// Create new array and insert photo & video files on table
	if ($photos) {
		$photosArray = array();

		foreach($photos as $row){
			if ($row['uploaded'])
				$insertedPhoto = uploadPhotosPublication($session,
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
			if ($row['uploaded']) {
				$insertedAudio = uploadAudiosPublication($session,
														$row['name'].'.mp3',
														$row['mimetype'],
														htmlspecialchars($row['title'], ENT_QUOTES),
														htmlspecialchars($row['original_title'], ENT_QUOTES),
														htmlspecialchars($row['original_artist'], ENT_QUOTES),
														$row['genre'],
														$row['image'],
														$row['duration']);
			}

			$newAudio = ($row['uploaded'] ? $insertedAudio : $row['song']);
			$audiosArray[] = $newAudio;
		}

		$audiosArray = json_encode($audiosArray);
	} else {
		$audiosArray = null;
	}

	// Set query
	$sql = "INSERT INTO z_publications (user,
										name,
										content,
										content_original,
										mentions,
										hashtags,
										photos,
										audios,
										disabled_comments,
										".($publicationDate ? 'publication_date, is_deleted,' : '')."
										creation_date,
										date,
										ip_address)
								VALUES ($session,
										'$name',
										'$content',
										'$contentOriginal',
										'$mentions',
										'$hashtags',
										'$photosArray',
										'$audiosArray',
										'$disabledComments',
										".($publicationDate ? '$publicationDate, 2,' : '')."
										'$cDate',
										'$date',
										'$ipAddress')";

	$result = $conn->query($sql);
	$insertedId = $conn->insert_id;

	// Notificate mentioned friends on publication
	foreach($mentionsNotificate as $row){
		$rcv = userId(substr($row, 1));

		if ($rcv) {
			$notification = array(
				'url' 		=> 'publication',
				'type' 		=> 'mention',
				'sender' 	=> $session,
				'receiver' 	=> $rcv,
				'id' 		=> $insertedId
			);

			generateNotification($notification);
		}
	}

	$inserted = getPublication($insertedId);
	echo json_encode($inserted);

	$conn->close();
?>
