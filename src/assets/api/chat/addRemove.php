<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$id = $data['id'];
	$type = $data['type'];
	$user = $data['user'];

	$status = ($type == 'remove') ? 1 : 0;

	$sql = "UPDATE z_chat_users
			SET is_deleted = $status, ip_address = '$ipAddress' 
			WHERE chat = $id AND user = $user";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));
	
	$conn->close();
?>
