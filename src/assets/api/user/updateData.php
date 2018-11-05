<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$username = $data['username'];
	$name = htmlspecialchars($data['name'], ENT_QUOTES);
	$language = $data['language'];
	$about = htmlspecialchars($data['about'], ENT_QUOTES);
	$aboutOriginal = htmlspecialchars($data['aboutOriginal'], ENT_QUOTES);

	// update data
	$sql = "UPDATE z_users
			SET username = '$username',
				name = '$name',
				language = $language,
				about = '$about',
				about_original = '$aboutOriginal',
				ip_address_update = '$ipAddress'
			WHERE id = $id";
	$result = $conn->query($sql);

	// get user data
	$userData = userData($id);
	echo json_encode($userData);
	
	$conn->close();
?>
