<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	$session = sessionId();
	$url = $data['url'];
	$id = $data['id'];

	foreach($data['receivers'] as $row){
		$notification = array(
			'sender' 	=> $session,
			'receiver' 	=> $row,
			'url' 		=> $url,
			'id' 		=> $id,
			'type' 		=> "share"
		);

		generateNotification($notification);
	}

	var_dump(http_response_code(204));

	$conn->close();
?>
