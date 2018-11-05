<?php include "../db.php";
	$id = $_GET['id'];
	$user = $_GET['user'];

	// Check if I liked a photo
	$data = array(
		'liked' => checkLikedPhoto($id, $user),
		'likers' => getPhotoLikers($id)
	);

	echo json_encode($data);
?>