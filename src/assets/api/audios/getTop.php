<?php include "../db.php";
    /* https://docs.rocketship.it/php/1-0/usps-country-codes.html */
    $cuantity = 100;
    $more = 0;
	$session = sessionId();
    $id = $_GET['id'];
    $dateFrom = date('Y-m-d H:i:s', strtotime('-31 days'));
	$dateTo = date('Y-m-d H:i:s', strtotime('+1 days'));

	$sql = "SELECT a.id,
                    a.name,
                    a.title,
                    a.original_title,
                    a.original_artist,
                    a.duration,
                    a.image,
                    a.explicit,
                    COUNT(r.song) AS replays
            FROM z_audios_replays r
                INNER JOIN z_audios_playlist p ON p.id = $id
                INNER JOIN z_audios a ON a.id = r.song
            WHERE (r.date BETWEEN '$dateFrom' AND '$dateTo')
                AND a.is_deleted = 0
                AND r.country_code = p.country_code
            GROUP BY r.song
            ORDER by replays DESC
            LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();

		while($row = $result->fetch_assoc()) {
			$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
			$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
			$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
			$row['explicit'] = boolval($row['explicit']);
			$data[] = $row;
        }

        if ($result->num_rows < 100) {
            $top = getTop($dateFrom, $dateTo, $cuantity, $more);

            foreach($top as $row) {
                $row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
                $row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
                $row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
                $row['explicit'] = boolval($row['explicit']);
                $data[] = $row;
            }
        }
	} else {
		$data = getTop($dateFrom, $dateTo, $cuantity, $more);
	}

	$res = array(
		'info' 	=> getPlaylist('id', $id),
		'list' 	=> $data
	);

	echo json_encode($res);

    $conn->close();

    // Get Top if is not enought for Top100
    function getTop($dateFrom, $dateTo, $cuantity, $more) {
        global $conn;

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
				LIMIT $more, $cuantity";
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
?>
