<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$code = $data['code'];

	if (isset($code)) {
		// update active status
        $sql = "UPDATE z_users
				SET active = 1,
					ip_address_update = '$ipAddress'
				WHERE verification_code = '$code'";
    	$result = $conn->query($sql);

		// get data
		$sqlGet = "SELECT username, 
							email, 
							password
					FROM z_users
					WHERE verification_code = '$code'";
		$resultGet = $conn->query($sqlGet)->fetch_assoc();

		if ($resultGet) {
			$resultGet['password'] = $resultGet['password'].'-c3';
			echo json_encode($resultGet);
		} else {
			var_dump(http_response_code(403));
		}

		$conn->close();
	} else {
		var_dump(http_response_code(403));
	}
?>
