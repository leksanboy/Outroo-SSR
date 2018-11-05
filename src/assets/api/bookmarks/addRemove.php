<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);
	
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$item = $data['item'];
	$id = $data['id'];
	$user = $data['user'];
	$type = $data['type'];

	if ($id) {
		$status = ($type == 'remove') ? 1 : 0;

		$sql = "UPDATE z_bookmarks
				SET is_deleted = $status, ip_address = '$ipAddress'
				WHERE id = $id AND user = $user";
		$result = $conn->query($sql);

		var_dump(http_response_code(204));
		
		$conn->close();
	} else {
		$sql = "INSERT INTO z_bookmarks (user, post, ip_address)
				VALUES ($user, $item, '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		echo $insertedId;
		
		$conn->close();
	}
?>
