<?php include "../db.php";
	$user = $_POST['user'];
	$category = $_POST['category'];
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$fileName = generateRandomString(23);
	$fileNameJpg = $fileName.".jpg";
	$fileNameMp4 = $fileName.".mp4";
	$fileType = $_FILES["fileUpload"]["type"];
	$fileTmpLoc = $_FILES["fileUpload"]["tmp_name"];
	$locationPathPhotos = '/var/www/html/assets/media/photos/';
	$locationPathVideos = '/var/www/html/assets/media/videos/';
	
	// If not files to update (count files = 0)
	if (!$fileTmpLoc) exit();

	// Start to upload
	if ($category == 'image') {
		if (move_uploaded_file($fileTmpLoc, $locationPathPhotos.$fileNameJpg)) {
			$inFile = $locationPathPhotos."$fileNameJpg";
			$outFile = $locationPathPhotos."thumbnails/$fileNameJpg";
			$image = new Imagick($inFile);
			$image->thumbnailImage(0, 240, false);
			$image->writeImage($outFile);

			// Insert file
			$sql = "INSERT INTO z_photos (user, name, mimetype, ip_address)
					VALUES ($user, '$fileNameJpg', '$fileType', '$ipAddress')";
			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			// Insert to user
			$sqlFav = "INSERT INTO z_photos_favorites (user, photo, ip_address)
					VALUES ($user, $insertedId, '$ipAddress')";
			$resultFav = $conn->query($sqlFav);

		    var_dump(http_response_code(204));
			$conn->close();
		} else {
			var_dump(http_response_code(400));
		}
	} else if ($category == 'video') {
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
			} else { // MP4
				// Get video duration
				$duration = exec("ffprobe $locationPathVideos/$fileNameMp4 -show_format 2>&1 | sed -n 's/duration=//p'");
				
				// Get video poster
				$frameTime = intval($duration/4);
				exec("ffmpeg -i $locationPathVideos/$fileNameMp4 -ss $frameTime -s:v:1 320x240 -vframes 1 $locationPathVideos/thumbnails/$fileNameJpg");
			}

			// Video duration
			$duration = timeFormat($duration);

			// Insert file
			$sql = "INSERT INTO z_photos (user, name, mimetype, duration, ip_address)
					VALUES ($user, '$fileNameJpg', '$fileType', '$duration', '$ipAddress')";
			$result = $conn->query($sql);
			$insertedId = $conn->insert_id;

			// Insert to user
			$sqlFav = "INSERT INTO z_photos_favorites (user, photo, ip_address)
					VALUES ($user, $insertedId, '$ipAddress')";
			$resultFav = $conn->query($sqlFav);

			// Remove file from folder fisically (without .mp4)
			if ($fileType != 'video/mp4')
				unlink($locationPathVideos.$FILE_NAME);

		    var_dump(http_response_code(204));
			
			$conn->close();
		} else {
			var_dump(http_response_code(400));
		}
	}
?>