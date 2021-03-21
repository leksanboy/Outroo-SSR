<?php include "../db.php";
	$session = sessionId();
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $_GET['user'];
	$type = $_GET['type'];
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;

	$params = array(
		'ipAddress'	=> $ipAddress,
		'session'	=> $session,
		'user'		=> $user,
		'type'		=> $type,
		'cuantity'	=> $cuantity,
		'more'		=> $more
	);

	function hits($params){
		global $conn;

		$dateFrom = date('Y-m-d H:i:s', strtotime('-5 days'));
		$dateTo = date('Y-m-d H:i:s', strtotime('+5 days'));
		$cuantity = $params['cuantity'] == 0 ? 8 : $params['cuantity'];
		$more = $params['more'];

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

	function recommended($params){
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 13 : $params['cuantity'];
		$more = $params['more'];
		$session = $params['session'];
		$user = $params['user'];

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
					AND type IS NULL
				ORDER BY RAND()
					AND date DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist('id', $row['o_id']);

					$row['name'] = $f_row['name'];
					$row['title'] = $f_row['title'];
					$row['image'] = $f_row['image'];
				}

				if ($session === $user) {
					$data[] = $row;
				} else {
					if (!$row['private']) {
						$data[] = $row;
					}
				}
			}

			return $data;
		} else {
			return null;
		}
	}

	function favourites($params){
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 6 : $params['cuantity'];
		$more = $params['more'];
		$session = $params['session'];
		$user = $params['user'];

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
					AND type IS NULL
				GROUP BY original_id
				ORDER BY Count(*) DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist('id', $row['o_id']);

					$row['name'] = $f_row['name'];
					$row['title'] = $f_row['title'];
					$row['image'] = $f_row['image'];
				}

				if ($session === $user) {
					$data[] = $row;
				} else {
					if (!$row['private']) {
						$data[] = $row;
					}
				}
			}

			return $data;
		} else {
			return null;
		}
	}

	function genres($params){
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 6 : $params['cuantity'];
		$more = $params['more'];
		$order = $params['cuantity'] == 0 ? 'RAND()' : 'title ASC';

		$sql = "SELECT id,
						title,
						image
				FROM z_audios_genres
				WHERE is_deleted = 0
				ORDER BY $order
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}

	function mostPlayed($params){
		global $conn;

		$dateFrom = date('Y-m-d H:i:s', strtotime('-2 days'));
		$dateTo = date('Y-m-d H:i:s', strtotime('+2 days'));
		$cuantity = $params['cuantity'] == 0 ? 5 : $params['cuantity'];
		$more = $params['more'];

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

	function ost($params){
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 6 : $params['cuantity'];
		$more = $params['more'];

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE (type = 'ost' OR genre = 28)
					AND is_deleted = 0
				ORDER BY id ASC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist('id', $row['o_id']);

					$row['name'] = $f_row['name'];
					$row['title'] = $f_row['title'];
					$row['image'] = $f_row['image'];
				}

				$data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}

	function top100($params){
		/* https://docs.rocketship.it/php/1-0/usps-country-codes.html */
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 6 : $params['cuantity'];
		$more = $params['more'];

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE type = 'top100'
					AND is_deleted = 0
				ORDER BY id ASC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist('id', $row['o_id']);

					$row['name'] = $f_row['name'];
					$row['title'] = $f_row['title'];
					$row['image'] = $f_row['image'];
				}

				$data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}

	function enjoyWith($params){
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 20 : $params['cuantity'];
		$more = $params['more'];
		$session = $params['session'];
		$user = $params['user'];

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
					AND type IS NULL
				ORDER BY RAND()
					AND date DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist('id', $row['o_id']);

					$row['name'] = $f_row['name'];
					$row['title'] = $f_row['title'];
					$row['image'] = $f_row['image'];
				}

				if ($session === $user) {
					$data[] = $row;
				} else {
					if (!$row['private']) {
						$data[] = $row;
					}
				}
			}

			return $data;
		} else {
			return null;
		}
	}

	function userPlaylists($params){
		global $conn;

		$cuantity = $params['cuantity'] == 0 ? 20 : $params['cuantity'];
		$more = $params['more'];
		$session = $params['session'];
		$user = $params['user'];

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE user = $user
					AND is_deleted = 0
				LIMIT $more, $cuantity";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = boolval($row['private']);
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist('id', $row['o_id']);

					$row['name'] = $f_row['name'];
					$row['title'] = $f_row['title'];
					$row['image'] = $f_row['image'];
				}

				if ($session === $user) {
					$data[] = $row;
				} else {
					if (!$row['private']) {
						$data[] = $row;
					}
				}
			}

			return $data;
		} else {
			return null;
		}
	}

	if ($type === 'general') {
		$res = array(
			'hits'			=> hits($params),
			'recommended'	=> recommended($params),
			'favourites'	=> favourites($params),
			'genres'		=> genres($params),
			'mostPlayed'	=> mostPlayed($params),
			'ost'			=> ost($params),
			'top100'		=> top100($params),
			'enjoyWith'		=> enjoyWith($params),
			'CNT'			=> geoip_country_code_by_name($ipAddress)
		);

		echo json_encode($res);
	} else if ($type === 'hits') {
		echo json_encode(hits($params));
	} else if ($type === 'recommended') {
		echo json_encode(recommended($params));
	} else if ($type === 'favourites') {
		echo json_encode(favourites($params));
	} else if ($type === 'genres') {
		echo json_encode(genres($params));
	} else if ($type === 'mostPlayed') {
		echo json_encode(mostPlayed($params));
	} else if ($type === 'ost') {
		echo json_encode(ost($params));
	} else if ($type === 'top100') {
		echo json_encode(top100($params));
	} else if ($type === 'enjoyWith') {
		echo json_encode(enjoyWith($params));
	} else if ($type === 'userPlaylists') {
		echo json_encode(userPlaylists($params));
	}
?>
