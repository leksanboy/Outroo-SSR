<?php include "db.php";
    /*
    1. En la maquina linux ssh lanzar comando "crontab -e"
    2. Dentro del archivo agreagar al final una nueva linea
        50 * * * * php /var/www/html/assets/api/cron_something.php
        o
        0 11 1/2 * * /usr/bin/php /var/www/html/assets/api/cron_something.php
    3. Crontab empezara a funcionar de manera automatica
    */


    // Users list
    $sql = "SELECT id,
                    username,
                    name,
                    email,
                    language
            FROM z_users
			WHERE is_deleted = 0
				AND LENGTH(deletion_date)";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $email = $row['email'];
            $lang = $row['language'];
            $name = html_entity_decode($row['username'], ENT_QUOTES);

            // Send mail
			/* try {
				emailDeletion($email, $lang, $name, $resData);
			} catch (Exception $e) {
				print $e->getMessage();
			} */
        }
    }

    $conn->close();
?>
