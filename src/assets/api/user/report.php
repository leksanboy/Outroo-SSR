<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
    $pageId = $data['pageId'];
    $pageType = $data['pageType'];
    $content = $data['content'];

	if (isset($session)) {
        // create question
        $sql = "INSERT INTO z_report (user, page_id, page_type, content, ip_address)
				VALUES ($session, $pageId, '$pageType',  '$content', '$ipAddress')";
		$result = $conn->query($sql);

        // Send email
		// emailSupportQuestion($email, $content);

		// return response status
		var_dump(http_response_code(204));

		$conn->close();
	} else {
		var_dump(http_response_code(403));
	}
?>
