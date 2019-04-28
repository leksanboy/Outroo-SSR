<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
    $oldPassword = md5($data['oldPassword']);
    $newPassword = md5($data['newPassword']);
    $currentPassword = userPassword($session);

    if ($oldPassword == $currentPassword) {
		$sql = "UPDATE z_users
	            SET password = '$newPassword',
					ip_address_update = '$ipAddress'
	            WHERE id = $session";
		$result = $conn->query($sql);

	    var_dump(http_response_code(204));
	    
		$conn->close();
    } else {
    	var_dump(http_response_code(403));
    }
?>
