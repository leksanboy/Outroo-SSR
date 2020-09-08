<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$session = sessionId();
    $pageId = $data['pageId'];
    $pageType = $data['pageType'];
	$content = $data['content'];
	$lang = $data['lang'];

	// Get user data
	$user = $session ? userData($session) : null;

	if (isset($session) && isset($user)) {
        // Create question
        $sql = "INSERT INTO z_report (user, page_id, page_type, content, ip_address)
				VALUES ($session, $pageId, '$pageType',  '$content', '$ipAddress')";
		$result = $conn->query($sql);

        // Send email
		emailReport($user['email'], $lang, $content);

		// return response status
		var_dump(http_response_code(204));

		$conn->close();
	} else {
		var_dump(http_response_code(403));
	}
?>
