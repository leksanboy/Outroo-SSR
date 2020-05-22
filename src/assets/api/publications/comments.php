<?php include "../db.php";
	$cuantity = $_GET['cuantity'];
	$more = $_GET['rows']*$cuantity;
	$id = $_GET['id'];

	$sql = "SELECT id,
					user,
					comment,
					comment_reply_parent_id,
					comment_reply_child_id,
					date
			FROM z_publications_comments
			WHERE publication = $id
				AND is_deleted = 0
			ORDER BY date ASC
			LIMIT $more, $cuantity";
	$result = $conn->query($sql);

	if ($result->num_rows > 0) {
		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['user'] = userUsernameNameAvatar($row['user']);
			$row['comment'] = trim($row['comment']) ? html_entity_decode($row['comment'], ENT_QUOTES) : null;
			$data[] = $row;
		}

		$dataRes = array();
		foreach($data as $row){
			if (!$row['comment_reply_parent_id']) {
				$row['list'] = getReplyComments($row['id'], $data);
				$dataRes[] = $row;
			}
		}

		echo json_encode($dataRes);
	} else {
		var_dump(http_response_code(204));
	}

	$conn->close();

	function getReplyComments($id, $list) {
		$dataReply = array();

		foreach($list as $row){
			if ($row['comment_reply_parent_id']) {
				if ($row['comment_reply_parent_id'] == $id) {
					$dataReply[] = $row;
				}
			}
		}

		return $dataReply;
	}
?>
