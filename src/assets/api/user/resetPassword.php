<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$code = $data['code'];

	if (isset($code)) {
		$sql = "SELECT id,
						username,
						name,
						avatar,
						email
				FROM z_users
				WHERE reset_password = '$code'";
		$result = $conn->query($sql)->fetch_assoc();

        $result['name'] = html_entity_decode($result['name'], ENT_QUOTES);
		$result['avatarUrl'] = $result['avatar'] ? ('https://cdn.beatfeel.com/users/'.$result['id'].'/avatar/'.$result['avatar']) : '';

		$array = array(
			'avatar'	 	=> $result['avatar'],
			'avatarUrl'	 	=> $result['avatarUrl'],
			'email'	 		=> $result['email'],
		    'name'	 		=> $result['name'],
			'username'	 	=> $result['username']
		);

        // Check if exist
        if ($result['id'])
            echo json_encode($array);
        else
            var_dump(http_response_code(401));

		$conn->close();
	} else {
		var_dump(http_response_code(403));
	}
?>
