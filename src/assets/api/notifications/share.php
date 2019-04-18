<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	foreach($data['receivers'] as $row){
		$notification = array(
			"sender" 	=> $data['sender'],
			"receiver" 	=> $row,
			"url" 		=> $data['url'],
			"id" 		=> $data['id'],
			"type" 		=> "share"
		);

		generateNotification($notification);
	}

	var_dump(http_response_code(204));

	$conn->close();
?>
