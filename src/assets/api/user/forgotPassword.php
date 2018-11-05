<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$email = $_GET['email'];

	$sql = "SELECT username
			FROM z_users
			WHERE email = '$email'";
	$result = $conn->query($sql)->fetch_assoc();

	// get username
	$username = $result['username'];

	if ($username) {
		// generated password
		$generatedHash = generateRandomString(23);

		// Update cell reset_password on DDBB
		$sqlUpdate = "UPDATE z_users
						SET reset_password = '$generatedHash',
							ip_address_update = '$ipAddress'
						WHERE email = '$email'";
		$resultUpdate = $conn->query($sqlUpdate);

		// Send email
		emailForgotPassword($username, $email , $generatedHash);

		// return response status
		var_dump(http_response_code(204));
	} else {
		var_dump(http_response_code(403));
	}

	$conn->close();
?>
