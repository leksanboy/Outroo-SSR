<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
	$id = $data['id'];
	$item = $data['item'];
	$type = $data['type'];

	if ($id) {
		$status = ($type === 'remove') ? 1 : 0;

		$sql = "UPDATE z_bookmarks
				SET is_deleted = $status,
					ip_address = '$ipAddress'
				WHERE id = $id
					AND user = $session";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));

		$conn->close();
	} else {
		$sql = "INSERT INTO z_bookmarks (user, post, ip_address)
				VALUES ($session, $item, '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		echo $insertedId;

		$conn->close();
	}
?>
