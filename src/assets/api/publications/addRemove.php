<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$type = $data['type'];
	$id = $data['id'];
	
	$status = ($type === 'remove') ? 1 : 0;

	$sql = "UPDATE z_publications
			SET is_deleted = $status, 
				ip_address = '$ipAddress' 
			WHERE id = $id 
				AND user = $session";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));
	
	$conn->close();
?>
