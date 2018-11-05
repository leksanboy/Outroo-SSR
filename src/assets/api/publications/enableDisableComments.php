<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $data['user'];
	$type = $data['type'];
	$id = $data['id'];
	
	$status = ($type == false) ? 1 : 0;

	$sql = "UPDATE z_publications
			SET disabled_comments = $status, ip_address = '$ipAddress' 
			WHERE id = $id AND user = $user";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));
	
	$conn->close();
?>
