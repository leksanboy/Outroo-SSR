<?php include "../db.php";
	// Get file information with getid3
    require '/usr/share/php/getid3/getid3.php';

	$ipAddress = $_SERVER['REMOTE_ADDR'];
    $session = sessionId();
	$fileName = generateRandomString(23);
	$fileNameMp3 = $fileName.'.mp3';
	$fileNameJpg = $fileName.'.jpg';
	$fileTitle = htmlspecialchars($_POST['title'], ENT_QUOTES);
	$fileType = $_FILES["fileUpload"]["type"];
	$fileTmpLoc = $_FILES["fileUpload"]["tmp_name"];
	$locationPath = '/var/www/html/assets/media/audios/';
	$explicit = $_POST['explicit'] ? 1 : 0;

    // If not files to update (count files = 0)
	if (!$fileTmpLoc) exit();

	// Start to upload
	if (move_uploaded_file($fileTmpLoc, $locationPath.$fileNameMp3)) {
        // Song duration
        $duration = exec("ffprobe $locationPath/$fileNameMp3 -show_format 2>&1 | sed -n 's/duration=//p'");
        $duration = timeFormat($duration);

        // Get song's image if exist
        $songLoc = $locationPath.$fileNameMp3;
        $songImageLoc = $locationPath.'thumbnails/'.$fileNameJpg;
        exec("ffmpeg -i $songLoc $songImageLoc", $output, $returnIfSongHasImage);
        if (!$returnIfSongHasImage)
        	$image = $fileNameJpg;
        else
        	$image = '';

        // Song information
        $getid3 = new getID3;
        $getid3->encoding = 'UTF-8';
        $info = $getid3->analyze($locationPath.$fileNameMp3);
        $originalTitle = htmlspecialchars($info['tags']['id3v2']['title'][0], ENT_QUOTES);
        $originalArtist = htmlspecialchars($info['tags']['id3v2']['artist'][0], ENT_QUOTES);
        $genre = $info['tags']['id3v2']['genre'][0];

        // Insert file
		$sql = "INSERT INTO z_audios (user, name, mimetype, title, original_title, original_artist, genre, image, explicit, duration, ip_address)
				VALUES ($session, '$fileNameMp3', '$fileType', '$fileTitle', '$originalTitle', '$originalArtist', '$genre', '$image', $explicit, '$duration', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		// Insert to user
		$sqlFav = "INSERT INTO z_audios_favorites (user, song, ip_address)
					VALUES ($session, $insertedId, '$ipAddress')";
		$resultFav = $conn->query($sqlFav);

	    var_dump(http_response_code(204));

		$conn->close();
	}  else {
		var_dump(http_response_code(400));
	}
?>
