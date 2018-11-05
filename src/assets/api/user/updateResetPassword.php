<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$code = $data['code'];
	$password = $data['password'];
    $newPassword = md5($data['password']);
	$username = $data['username'];
	$email = $data['email'];

    if (isset($code)) {
		// Set new pasword
    	$sql = "UPDATE z_users
                SET password = '$newPassword',
    				ip_address_update = '$ipAddress'
                WHERE reset_password = '$code'";
    	$result = $conn->query($sql);

		// Send mail
		emailResetPassword($username, $email, $password);

		// Return response status
        var_dump(http_response_code(204));

		$conn->close();
    } else {
    	var_dump(http_response_code(403));
    }
?>
