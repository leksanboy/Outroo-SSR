<?php include "../db.php";
	$session = sessionId();
	$user = $_GET['user'];

	function hits(){
		global $conn;

		$dateFrom = date('Y-m-d H:i:s', strtotime('-5 days'));
		$dateTo = date('Y-m-d H:i:s', strtotime('+5 days'));

		$sql = "SELECT a.id,
						a.name,
						a.title,
						a.original_title,
						a.original_artist,
						a.duration,
						a.image,
						COUNT(r.song) AS replays
				FROM z_audios a
					INNER JOIN z_audios_replays r on a.id = r.song
				WHERE (r.date BETWEEN '$dateFrom' AND '$dateTo')
					AND a.is_deleted = 0
				GROUP BY a.id
				ORDER by replays DESC
				LIMIT 8";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['song'] = $row['id'];
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
				$row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
				$data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}

	function recommended(){
		global $conn;

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
					AND type IS NULL
				ORDER BY RAND()
					AND date DESC
				LIMIT 13";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = $row['private'] ? true : false;
				$row['idPlaylist'] = $row['id'];

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist($row['o_id']);

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

	function favourites(){
		global $conn;

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
					AND type IS NULL
				GROUP BY original_id
				ORDER BY Count(*) DESC
				LIMIT 6";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = $row['private'] ? true : false;
				$row['idPlaylist'] = $row['id'];

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist($row['o_id']);

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

	function genres(){
		global $conn;

		$sql = "SELECT id,
						title
				FROM z_audios_genres
				WHERE is_deleted = 0
				ORDER BY RAND()
				LIMIT 6";
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

	function mostPlayed(){
		global $conn;

		$dateFrom = date('Y-m-d H:i:s', strtotime('-2 days'));
		$dateTo = date('Y-m-d H:i:s', strtotime('+2 days'));

		$sql = "SELECT a.id,
						a.name,
						a.title,
						a.original_title,
						a.original_artist,
						a.duration,
						a.image,
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
				$data[] = $row;
			}

			return $data;
		} else {
			return null;
		}
	}

	function ost(){
		global $conn;

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						private
				FROM z_audios_playlist
				WHERE type = 'ost'
					AND is_deleted = 0
				ORDER BY id ASC
				LIMIT 6";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = $row['private'] ? true : false;
				$row['idPlaylist'] = $row['id'];

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist($row['o_id']);

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

	function top100(){
		global $conn;

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						private
				FROM z_audios_playlist
				WHERE type = 'top100'
					AND is_deleted = 0
				ORDER BY id ASC
				LIMIT 6";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = $row['private'] ? true : false;
				$row['idPlaylist'] = $row['id'];

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist($row['o_id']);

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

	function enjoyWith(){
		global $conn;

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						image,
						private
				FROM z_audios_playlist
				WHERE is_deleted = 0
					AND type IS NULL
				ORDER BY RAND()
					AND date DESC
				LIMIT 20";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			$data = array();

			while($row = $result->fetch_assoc()) {
				$row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
				$row['private'] = $row['private'] ? true : false;
				$row['idPlaylist'] = $row['id'];

				if ($row['type'] === 'follow') {
					$f_row = getPlaylist($row['o_id']);

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

	$res = array(
		'hits'			=> hits(),
		'recommended'	=> recommended(),
		'favourites'	=> favourites(),
		'genres'		=> genres(),
		'mostPlayed'	=> mostPlayed(),
		'ost'			=> ost(),
		'top100'		=> top100(),
		'enjoyWith'		=> enjoyWith()
	);

	echo json_encode($res);
?>
