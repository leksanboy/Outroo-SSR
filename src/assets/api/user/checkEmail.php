<?php include "../db.php";
	$email = strtolower($_GET['email']);
	$status = null;

	$sql = "SELECT id
			FROM z_users
			WHERE email LIKE '$email'";
	$result = $conn->query($sql);

	$status = ($result->num_rows === 0) ? false : true;
	echo json_encode($status);

	$conn->close();
?>
