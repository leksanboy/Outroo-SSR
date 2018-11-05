<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$locationPathAudios = '/var/www/html/assets/media/audios/';
	$locationPathPhotos = '/var/www/html/assets/media/photos/';
	$locationPathVideos = '/var/www/html/assets/media/videos/';

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $data['user'];
	$fileType = $data['type'];
	$fileName = $data['name'];
	$id = $data['id'];
	$status = 1;

	$sql = "UPDATE z_publications_files
			SET is_deleted = $status, ip_address = '$ipAddress' 
			WHERE id = $id AND user = $user";
	$result = $conn->query($sql);

	if ($fileType == 'audio')
		unlink($locationPathAudios.$fileName);
	else if ($fileType == 'photo')
		unlink($locationPathPhotos.$fileName);
	else if ($fileType == 'video')
		unlink($locationPathVideos.$fileName);

	var_dump(http_response_code(204));
	
	$conn->close();
?>
