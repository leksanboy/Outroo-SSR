<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$user = $data['user'];

	$sql = "INSERT INTO z_users_dismiss_recommended (sender, receiver, ip_address)
			VALUES ($session, $user, '$ipAddress')";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));

	$conn->close();
?>
