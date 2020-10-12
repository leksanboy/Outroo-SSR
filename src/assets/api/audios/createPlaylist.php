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
	$genre = $data['genre'];
	$description = $data['description'];
	$color = $data['color'];
	$explicit = $data['explicit'] ? 1 : 0;

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
		$sql = "INSERT INTO z_audios_playlist (name, user, color, title, description, genre, image, explicit, ip_address)
				VALUES ('$name', $session, '$color', '$title', '$description', '$genre', '$imageNameJpg', '$explicit', '$ipAddress')";
		$conn->query($sql);
		$insertedId = $conn->insert_id;

		$sqlUpdate = "UPDATE z_audios_playlist
						SET original_id = '$insertedId',
							ip_address = '$ipAddress'
						WHERE id = $id
							AND user = $session";
		$conn->query($sqlUpdate);

		$res = getPlaylist('id', $insertedId);
		echo json_encode($res);

		$conn->close();
	} else if ($type === 'update') {
		$image = $image ? "image = '$imageNameJpg'," : "";
		$color = $color ? "color = '$color'," : "";

		$sql = "UPDATE z_audios_playlist
				SET title = '$title',
					description = '$description',
					genre = '$genre',
					$image
					$color
					explicit = '$explicit',
					ip_address = '$ipAddress'
				WHERE id = $id
					AND user = $session";
		$result = $conn->query($sql);

		$res = getPlaylist('id', $id);
		echo json_encode($res);

		$conn->close();
	}
?>
