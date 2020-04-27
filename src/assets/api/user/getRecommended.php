<?php include "../db.php";
    $cuantity = 100;
    $more = 0;
	$session = sessionId();
	$user = $_GET['user'];

    $sql = "SELECT u.id,
                    u.private
            FROM z_following f
                INNER JOIN z_users u ON f.receiver = u.id
            WHERE f.sender = $user
                AND f.is_deleted = 0
                AND u.id <> $session
                AND
                (
                    CASE
						WHEN u.id <> $session THEN
							NOT EXISTS (SELECT 1 FROM z_users_dismiss_recommended WHERE sender = $session and receiver = u.id and is_deleted = 0)
                            AND
							NOT EXISTS (SELECT 1 FROM z_following WHERE sender = $session and receiver = u.id and is_deleted = 0)
					END
                )
            ORDER BY RAND()
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
    } else {
        $data = array();
    }

    /* Si no llego al minimo busco más usuarios */
    if ($result->num_rows < 30) {
        $sql2 = "SELECT u.id,
                        u.private
                FROM z_users u
                WHERE u.is_deleted = 0
                    AND u.id <> $session
                    AND
                    (
                        CASE
                            WHEN u.id <> $session THEN
                                NOT EXISTS (SELECT 1 FROM z_users_dismiss_recommended WHERE sender = $session and receiver = u.id and is_deleted = 0)
                                AND
                                NOT EXISTS (SELECT 1 FROM z_following WHERE sender = $session and receiver = u.id and is_deleted = 0)
                        END
                    )
                ORDER BY RAND()
                LIMIT $more, $cuantity";
        $result2 = $conn->query($sql2);

        if ($result2->num_rows > 0) {
            while($row = $result2->fetch_assoc()) {
                $row['user'] = userUsernameNameAvatar($row['id']);
                $row['status'] = checkFollowingStatus($session, $row['id']);
                $row['private'] = $row['private'] ? true : false;
                $data[] = $row;
            }

            $data = arrayRemoveDuplicates($data, 'id');

            echo json_encode(array_slice($data, 0, 20));
        } else {
            if ($result->num_rows == 0) {
                var_dump(http_response_code(204));
            } else {
                echo json_encode(array_slice($data, 0, 20));
            }
        }
    } else {
        echo json_encode(array_slice($data, 0, 20));
    }

    $conn->close();
?>
