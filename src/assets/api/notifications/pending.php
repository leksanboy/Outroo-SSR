<?php include "../db.php";
	$user = $_GET['id'];
	
	$sql = "SELECT n.id 
			FROM z_notifications n
			WHERE n.is_deleted = 0
				AND
				(
					EXISTS (SELECT 1 FROM z_publications     WHERE id    = n.page_id and is_deleted = 0)
					OR
					EXISTS (SELECT 1 FROM z_photos_favorites WHERE photo = n.page_id and is_deleted = 0)
				)
				AND n.receiver = $user 
				AND n.status = 0";
	$result = $conn->query($sql);

	echo $result->num_rows;
	
	$conn->close();
?>
