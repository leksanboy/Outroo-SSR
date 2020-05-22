<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];

	$sql = "INSERT INTO z_publications_replays (user, publication, ip_address)
			VALUES ($session, $id, '$ipAddress')";
	$result = $conn->query($sql);

	var_dump(http_response_code(204));

	$conn->close();
?>
