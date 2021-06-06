<?php include "../db.php";
	$inUse = array("beatfeel", "outroo", "outhroo", "sasa", "oleksandr", "vitaliy", "vitaly", "vitali", "rafalsky", "rafalskyy",
					"user", "audios", "bookmarks", "saved", "followers", "following", "home", "main", "news",
					"notifications", "photos", "settings",
					"index", "web", "about", "confirm-email", "error", "forgot-password", "logout", "privacy", "terms",
					"reset-password", "signin", "login", "signup", "support", "help", "blog", "press", "developer",
					"jobs", "core", "pages", "assets", "environments", "ssl-https", "api",
					".maintenance.html");
	$username = strtolower($_GET['username']);

	if (in_array($username, $inUse)) {
		echo json_encode(true);
	} else {
		if (substr($username, 0, strlen('asset')) === 'asset') {
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
	}
?>
