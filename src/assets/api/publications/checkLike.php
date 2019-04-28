<?php include "../db.php";
	$id = $_GET['id'];
	$session = sessionId();

	// Check if I liked a photo
	$data = array(
		'liked' => checkLikedPublication($id, $session),
		'likers' => getPublicationLikers($id)
	);

	echo json_encode($data);
?>