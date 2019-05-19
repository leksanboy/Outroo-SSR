<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$session = sessionId();
	$user = $_GET['user'];
	$id = $_GET['id'];
	$ipAddress = $_SERVER['REMOTE_ADDR'];

	if ($more === 0) {
		$sqlM = "SELECT id
				FROM z_message
				WHERE sender = $session AND receiver = $user
					OR
					sender = $user AND receiver = $session";
		$resultM = $conn->query($sqlM)->fetch_assoc();

		if ($resultM['id']) {
			$id = $resultM['id'];

			$sql = "SELECT id,
							message,
							user,
							content,
							content_original,
							date
					FROM z_message_conversation
					WHERE message = $id
						AND is_deleted = 0
					ORDER BY date DESC
					LIMIT $more, $cuantity";
			$result = $conn->query($sql);

			if ($result->num_rows > 0) {
				$list = array();

				while($row = $result->fetch_assoc()) {
					$list[] = $row;
				}

				$res = array(
					'id' => $id,
					'list' => $list
				);

				echo json_encode($res);
			} else {
				var_dump(http_response_code(204));
			}
		} else {
			var_dump(http_response_code(204));
		}
	} else {
		$sql = "SELECT id,
						message,
						user,
						content,
						content_original,
						date
				FROM z_message_conversation
				WHERE message = $id
					AND is_deleted = 0
				ORDER BY date DESC
				LIMIT $more, $cuantity";
		$result = $conn->query($sql)->fetch_assoc();

		if ($result->num_rows > 0) {
			$list = array();

			while($row = $result->fetch_assoc()) {
				$list[] = $row;
			}

			$res = array(
				'id' => $id,
				'list' => $list
			);

			echo json_encode($res);
		} else {
			var_dump(http_response_code(204));
		}
	}

	$conn->close();
?>
