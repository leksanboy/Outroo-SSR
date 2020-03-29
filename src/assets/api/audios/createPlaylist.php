<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$name = generateRandomString(23);
	$title = htmlspecialchars($data['title'], ENT_QUOTES);
	$type = $data['type'];
	$subtype = $data['subtype'];
	$image = $data['image'];
	$imageName = '';

	if ($image) {
		$imageName = generateRandomString(23);
		$imageNameJpg = $imageName.'.jpg';
		$imagePath = '/var/www/html/assets/media/audios/covers/'.$imageNameJpg;
		$image = explode(',', $image);
		$image = str_replace(' ', '+', $image[1]);
		$image = base64_decode($image);
		file_put_contents($imagePath, $image);
	}

	if ($type === 'create') {
		$sql = "INSERT INTO z_audios_playlist (name, user, title, image, ip_address)
				VALUES ('$name', $session, '$title', '$imageNameJpg', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		$res = getPlaylist($insertedId);
		$res['user'] = userUsernameNameAvatar($session);
		echo json_encode($res);
		
		$conn->close();
	} else if ($type === 'update') {
		if ($subtype === 'updateTitle') {
			$sql = "UPDATE z_audios_playlist
					SET title = '$title', 
						ip_address = '$ipAddress' 
					WHERE id = $id 
						AND user = $session";
			$result = $conn->query($sql);

			$res = getPlaylist($id);
			echo json_encode($res);
			
			$conn->close();
		} else if ($subtype === 'updateTitleImage') {
			$sql = "UPDATE z_audios_playlist
					SET title = '$title', 
						image = '', 
						ip_address = '$ipAddress' 
					WHERE id = $id 
						AND user = $session";
			$result = $conn->query($sql);

			$res = getPlaylist($id);
			echo json_encode($res);
			
			$conn->close();
		} else if ($subtype === 'updateNewImage') {
			$sql = "UPDATE z_audios_playlist
					SET title = '$title', 
						image = '$imageNameJpg', 
						ip_address = '$ipAddress' 
					WHERE id = $id 
						AND user = $session";
			$result = $conn->query($sql);

			$res = getPlaylist($id);
			echo json_encode($res);
			
			$conn->close();
		}
	}
?>
