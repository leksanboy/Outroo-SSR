<?php include "../db.php";
	$session = sessionId();
	
	$sql = "SELECT
				n.id,
				n.page_url,
				n.page_id
			FROM z_notifications n
			WHERE n.is_deleted = 0 
				AND n.receiver = $session
				AND
				(
					CASE
						WHEN n.page_url = 'publications' THEN 
							EXISTS (SELECT 1 FROM z_publications WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'photos' THEN 
							EXISTS (SELECT 1 FROM z_photos_favorites WHERE id = n.page_id and is_deleted = 0)
						WHEN n.page_url = 'audios' THEN 
							EXISTS (SELECT 1 FROM z_audios WHERE id = n.page_id and is_deleted = 0)
					END
				)
				AND n.status = 0";
	$result = $conn->query($sql);

	echo $result->num_rows;
	
	$conn->close();
?>
