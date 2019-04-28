<?php include "../db.php";
	$sender = sessionId();
	$receiver = $_GET['receiver'];

	// Check if I'm following
	$data = checkFollowingStatus($sender, $receiver);
	
	echo json_encode($data);
?>
