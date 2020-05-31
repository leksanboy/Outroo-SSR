<?php include "../db.php";
	// Get file information with getid3
    require '/usr/share/php/getid3/getid3.php';

	$session = sessionId();
	$category = $_POST['category'];
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$fileName = generateRandomString(23);
	$fileNameMp3 = $fileName.'.mp3';
	$fileNameJpg = $fileName.'.jpg';
	$fileNameMp4 = $fileName.'.mp4';
	$fileType = $_FILES["fileUpload"]["type"];
	$fileTmpLoc = $_FILES["fileUpload"]["tmp_name"];
	$locationPathAudios = '/var/www/html/assets/media/audios/';
	$locationPathPhotos = '/var/www/html/assets/media/photos/';
	$locationPathVideos = '/var/www/html/assets/media/videos/';

	// If not files to update (count files = 0)
	if (!$fileTmpLoc) exit();

	// Start to upload
	if ($category === 'audio') {
		$fileTitle = htmlspecialchars($_POST['title'], ENT_QUOTES);

		if (move_uploaded_file($fileTmpLoc, $locationPathAudios.$fileNameMp3)) {
	        // Song duration
	        $duration = exec("ffprobe $locationPathAudios/$fileNameMp3 -show_format 2>&1 | sed -n 's/duration=//p'");
	        $duration = timeFormat($duration);

	        // Get song's image if exist
	        $songLoc = $locationPathAudios.$fileNameMp3;
	        $songImageLoc = $locationPathAudios.'thumbnails/'.$fileNameJpg;
	        exec("ffmpeg -i $songLoc $songImageLoc", $output, $returnIfSongHasImage);
	        if (!$returnIfSongHasImage)
	        	$image = $fileNameJpg;
	        else
	        	$image = '';

	        // Song information
	        $getid3 = new getID3;
	        $getid3->encoding = 'UTF-8';
	        $info = $getid3->analyze($locationPathAudios.$fileNameMp3);
	        $originalTitle = htmlspecialchars($info['tags']['id3v2']['title'][0], ENT_QUOTES);
	        $originalArtist = htmlspecialchars($info['tags']['id3v2']['artist'][0], ENT_QUOTES);
	        $genre = $info['tags']['id3v2']['genre'][0];

	        // Insert file
			$sql = "INSERT INTO z_publications_files (user, name, mimetype, title, original_title, original_artist, genre, image, duration, ip_address)
					VALUES ($session, '$fileNameMp3', '$fileType', '$fileTitle', '$originalTitle', '$originalArtist', '$genre', '$image', '$duration', '$ipAddress')";
			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			// Return data
		    $data = array(
    			'name' 				=> $fileName,
    			'mimetype'			=> $fileType,
    			'title' 			=> $fileTitle,
    			'original_title' 	=> $originalTitle,
    			'original_artist' 	=> $originalArtist,
    			'genre' 			=> $genre,
    			'image' 			=> $image,
    			'duration' 			=> $duration
    		);

			echo json_encode($data);
			$conn->close();
		}  else {
			var_dump(http_response_code(400));
		}
	} else if ($category === 'image') {
		if (move_uploaded_file($fileTmpLoc, $locationPathPhotos.$fileNameJpg)) {
			$inFile = $locationPathPhotos.$fileNameJpg;
			$outFile = $locationPathPhotos.'thumbnails/'.$fileNameJpg;
			$image = new Imagick($inFile);
			$image->thumbnailImage(0, 480, false);
			$image->writeImage($outFile);

			// Insert file
			$sql = "INSERT INTO z_publications_files (user, name, mimetype, ip_address)
					VALUES ($session, '$fileNameJpg', '$fileType', '$ipAddress')";
			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			// Return data
			$data = array(
    			'name' 		=> $fileNameJpg,
    			'mimetype' 	=> $fileType
    		);

			echo json_encode($data);
			$conn->close();
		} else {
			var_dump(http_response_code(400));
		}
	} else if ($category === 'video') {
		if ($fileType != 'video/mp4')
			$locationFolder = $locationPathVideos.$fileName;
		else
			$locationFolder = $locationPathVideos.$fileNameMp4;

		// Upload video physically
		if(move_uploaded_file($fileTmpLoc, $locationFolder)){
			if ($fileType != 'video/mp4') { // Other format video
				// Transform video (to .mp4)
				exec("ffmpeg -i $locationPathVideos/$fileName $locationPathVideos/$fileNameMp4");

				// Get video duration
				$duration = exec("ffprobe $locationPathVideos/$fileNameMp4 -show_format 2>&1 | sed -n 's/duration=//p'");

				// Get video poster
				$frameTime = intval($duration/4);
				exec("ffmpeg -i $locationPathVideos/$fileNameMp4 -ss $frameTime -s:v:1 320x240 -vframes 1 $locationPathVideos/thumbnails/$fileNameJpg");

				// File type
				$fileType = 'video/mp4';
			} else { // MP4
				// Get video duration
				$duration = exec("ffprobe $locationPathVideos/$fileNameMp4 -show_format 2>&1 | sed -n 's/duration=//p'");

				// Get video poster
				$frameTime = intval($duration/4);
				exec("ffmpeg -i $locationPathVideos/$fileNameMp4 -ss $frameTime -s:v:1 320x240 -vframes 1 $locationPathVideos/thumbnails/$fileNameJpg");

				// File type
				$fileType = 'video/mp4';
			}

			// Video duration
			$duration = timeFormat($duration);

			// Insert file
			$sql = "INSERT INTO z_publications_files (user, name, mimetype, duration, ip_address)
					VALUES ($session, '$fileNameJpg', '$fileType', '$duration', '$ipAddress')";

			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			// Remove file from folder fisically (without .mp4)
			if ($fileType != 'video/mp4') {
				unlink($locationPathVideos.$FILE_NAME);
			}

			// Return data
		    $data = array(
    			'name' 		=> $fileNameJpg,
    			'mimetype' 	=> $fileType,
    			'duration' 	=> $duration
    		);

			echo json_encode($data);

			$conn->close();
		} else {
			var_dump(http_response_code(400));
		}
	}
?>
