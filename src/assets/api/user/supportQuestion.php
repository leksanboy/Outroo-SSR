<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$email = $data['email'];
    $content = $data['content'];

	if (isset($email)) {
        // create question
        $sql = "INSERT INTO z_support_questions (email, content, ip_address)
				VALUES ('$email',  '$content', '$ipAddress')";
		$result = $conn->query($sql);

        // Send email
		emailSupportQuestion($email, $content);

		// return response status
		var_dump(http_response_code(204));
		
		$conn->close();
	} else {
		var_dump(http_response_code(403));
	}
?>
