<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$email = $data['email'];

	$sql = "SELECT username, language
			FROM z_users
			WHERE email = '$email'";
	$result = $conn->query($sql)->fetch_assoc();

	// get username
	$username = $result['username'];
	$lang = $result['language'];

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
		emailForgotPassword($email, $lang, $username, $generatedHash);

		// return response status
		var_dump(http_response_code(204));
	} else {
		var_dump(http_response_code(403));
	}

	$conn->close();
?>
