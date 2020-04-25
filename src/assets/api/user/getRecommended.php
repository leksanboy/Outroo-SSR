<?php include "../db.php";
    $cuantity = 30;
    $more = 0;
	$session = sessionId();
	$user = $_GET['user'];

    $sql = "SELECT u.id, 
                    u.private 
            FROM z_following f 
                INNER JOIN z_users u ON f.receiver = u.id 
            WHERE f.sender = $user 
                AND f.is_deleted = 0 
            ORDER by u.username ASC 
            LIMIT $more, $cuantity";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();

        while($row = $result->fetch_assoc()) {
            $row['user'] = userUsernameNameAvatar($row['id']);
            $row['status'] = checkFollowingStatus($session, $row['id']);
            $row['private'] = $row['private'] ? true : false;
            $data[] = $row;
        }

        echo json_encode($data);
    } else {
        var_dump(http_response_code(204));
    }

    $conn->close();
?>
