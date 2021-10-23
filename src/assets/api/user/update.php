<?php include "../db.php";
    $data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
    $session = sessionId();
    $type = $data['type'];

    if ($type === 'data') {
        $username = $data['username'];
        $name = htmlspecialchars($data['name'], ENT_QUOTES);
        $lang = $data['language'];
        $about = htmlspecialchars($data['about'], ENT_QUOTES);

        if ((strtolower(userUsername($session)) === strtolower($username)) || !checkUsername($username)) {
            $sql = "UPDATE z_users
                    SET username = '$username',
                        name = '$name',
                        language = $lang,
                        about = '$about',
                        ip_address_update = '$ipAddress'
                    WHERE id = $session";
            $result = $conn->query($sql);

            $userData = userData($session);
            echo json_encode($userData);

            // History
            $sqlH = "INSERT INTO z_users_updates (type, user, username, name, language, about, ip_address)
                    VALUES ('$type', $session, '$username', '$name', '$lang', '$about', '$ipAddress')";
            $conn->query($sqlH);

            $conn->close();
        } else {
            var_dump(http_response_code(403));
        }
    } else if ($type === 'avatar') {
        $avatar = $data['image'];
        $name = generateRandomString(23).'.jpg';

        // Remove folder images first
        array_map('unlink', glob('/var/www/html/assets/media/user/'.$session.'/avatar/*'));

        if ($avatar) {
            // Create image
            $pathAvatar = '/var/www/html/assets/media/user/'.$session.'/avatar/'.$name;
            $avatar = explode(",",$avatar);
            $avatar = str_replace(' ', '+', $avatar[1]);
            $avatar = base64_decode($avatar);
            file_put_contents($pathAvatar, $avatar);

            $sql = "UPDATE z_users
                    SET avatar = '$name',
                        ip_address_update = '$ipAddress'
                    WHERE id = $session";
        } else {
            // Remove avatar
            $sql = "UPDATE z_users
                    SET avatar = NULL,
                        ip_address_update = '$ipAddress'
                    WHERE id = $session";
        }

        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, avatar, ip_address)
                VALUES ('$type', $session, '$name', '$ipAddress')";
        $conn->query($sqlH);

        $conn->close();
    } else if ($type === 'language') {
        $lang = $data['language'];

        $sql = "UPDATE z_users
                SET language = '$lang',
                    ip_address_update = '$ipAddress'
                WHERE id = $session";
        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, language, ip_address)
				VALUES ('$type', $session, '$lang', '$ipAddress')";
		$conn->query($sqlH);

        $conn->close();
    } else if ($type === 'password') {
        $oldPassword = md5($data['oldPassword']);
        $newPassword = md5($data['newPassword']);
        $currentPassword = userPassword($session);

        if ($oldPassword == $currentPassword) {
            $sql = "UPDATE z_users
                    SET password = '$newPassword',
                        ip_address_update = '$ipAddress'
                    WHERE id = $session";
            $result = $conn->query($sql);

            $userData = userData($session);
            echo json_encode($userData);

            // History
            $sqlH = "INSERT INTO z_users_updates (type, user, password, ip_address)
                    VALUES ('$type', $session, '$newPassword', '$ipAddress')";
            $conn->query($sqlH);

            $conn->close();
        } else {
            var_dump(http_response_code(403));
        }
    } else if ($type === 'private') {
        $private = $data['private'];

        $sql = "UPDATE z_users
                SET private = '$private',
                    ip_address_update = '$ipAddress'
                WHERE id = $session";
        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, private, ip_address)
                VALUES ('$type', $session, '$private', '$ipAddress')";
        $conn->query($sqlH);

        $conn->close();
    } else if ($type === 'theme') {
        $theme = $data['theme'];

        $sql = "UPDATE z_users
                SET theme = '$theme',
                    ip_address_update = '$ipAddress'
                WHERE id = $session";
        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, theme, ip_address)
                VALUES ('$type', $session, '$theme', '$ipAddress')";
        $conn->query($sqlH);

        $conn->close();
    } else if ($type === 'miniPlayer') {
        $miniPlayer = $data['miniPlayer'];

        $sql = "UPDATE z_users
                SET mini_player = '$miniPlayer',
                    ip_address_update = '$ipAddress'
                WHERE id = $session";
        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, mini_player, ip_address)
                VALUES ('$type', $session, '$miniPlayer', '$ipAddress')";
        $conn->query($sqlH);

        $conn->close();
    } else if ($type === 'emailPromos') {
        $emailPromos = $data['emailPromos'];

        $sql = "UPDATE z_users
                SET email_promos = '$emailPromos',
                    ip_address_update = '$ipAddress'
                WHERE id = $session";
        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, email_promos, ip_address)
                VALUES ('$type', $session, '$emailPromos', '$ipAddress')";
        $conn->query($sqlH);

        $conn->close();
    } else if ($type === 'deleteAccount') {
        $deletionDate = $data['deleteAccount'] === 1 ? date("Y-m-d H:i:s", strtotime("+30 days",time())) : NULL;

        $sql = "UPDATE z_users
                SET deletion_date = '$deletionDate',
                    ip_address_update = '$ipAddress'
                WHERE id = $session";
        $result = $conn->query($sql);

        $userData = userData($session);
        echo json_encode($userData);

        // History
        $sqlH = "INSERT INTO z_users_updates (type, user, language, ip_address)
				VALUES ('$type', $session, '$lang', '$ipAddress')";
		$conn->query($sqlH);

        $conn->close();
    }
?>
