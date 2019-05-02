<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$type = $data['type'];
	
	$status = $type === false ? 0 : 1;

	$sql = "UPDATE z_publications
			SET disabled_comments = $status, 
				ip_address = '$ipAddress' 
			WHERE id = $id 
				AND user = $session";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));
	
	$conn->close();
?>
