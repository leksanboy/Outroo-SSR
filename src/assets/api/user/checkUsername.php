<?php include "../db.php";
	$inUse = array("outhroo", "sasa", "vitaliy", "oleksandr", "rafalsky", "rafalskyy", "audios", "followers", "following", "main", "notifications", "photos", "settings", "error", "forgot-password", "reset-password", "confirm-email", "signin", "login", "signup", "user", "web", "core", "pages", "assets", "environments", "ssl-https", "about", "support", "help", "blog", "press", "api", "developer", "jobs", "privacy", "terms");
	$username = strtolower($_GET['username']);
	$status = null;

	if (in_array($username, $inUse)) {
		echo json_encode(true);
	} else {
		$sql = "SELECT id
				FROM z_users
				WHERE username LIKE '$username'";
		$result = $conn->query($sql);

		$status = ($result->num_rows == 0) ? false : true;
		echo json_encode($status);

		$conn->close();
	}
?>
