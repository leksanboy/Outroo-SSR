<?php include "db.php";
    /*
    1. En la maquina linux ssh lanzar comando "crontab -e"
    2. Dentro del archivo agreagar al finnal una nueva linea
        50 * * * * php /var/www/html/assets/api/cron.php
        o
        0 11 1/2 * * /usr/bin/php /var/www/html/assets/api/cron.php
    3. Crontab empezara a funcionar de manera automatica
    */
    
    // Recommended songs (5)
    function hits(){
		global $conn;

		$dateFrom = date('Y-m-d H:i:s', strtotime('-10 days'));
		$dateTo = date('Y-m-d H:i:s', strtotime('+10 days'));

		$sql = "SELECT a.id,
						a.name,
						a.title,
						a.original_title,
						a.original_artist,
						a.duration,
						a.image,
						a.explicit,
						COUNT(r.song) AS replays
				FROM z_audios a
					INNER JOIN z_audios_replays r on a.id = r.song
				WHERE (r.date BETWEEN '$dateFrom' AND '$dateTo')
					AND a.is_deleted = 0
				GROUP BY a.id
				ORDER by replays DESC
				LIMIT 5";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['song'] = $row['id'];
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
				$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
				$row['explicit'] = boolval($row['explicit']);

				$data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}

    // Recommended playlists (1+3)
	function recommended(){
		global $conn;

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
                        color,
						explicit,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
                    AND private = 0
                    AND CHAR_LENGTH(image) > 4
					AND type IS NULL
				ORDER BY RAND()
				LIMIT 10";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

                $data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}


    $resData = array(
        'songs'		=> hits(),
        'playlists' => recommended()
    );

    // Users list
    $sql = "SELECT id,
                    username,
                    name,
                    email,
                    language
            FROM z_users
            WHERE id = 1";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $email = $row['email'];
            $lang = $row['language'];
            $name = html_entity_decode($row['username'], ENT_QUOTES);

            // Send mail
            emailRecommendations($email, $lang, $name, $resData);
        }
    }

    $conn->close();
?>
