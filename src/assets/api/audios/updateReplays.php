<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$countryCode = geoip_country_code_by_name($_SERVER['REMOTE_ADDR']);
	$session = sessionId();
	$id = $data['id'];
	$location = $data['location'];
	$locationId = $data['locationId'];

	$sql = "INSERT INTO z_audios_replays (user, song, location, location_id, ip_address, country_code)
			VALUES ($session, $id, '$location', $locationId, '$ipAddress', '$countryCode')";
	$conn->query($sql);

	var_dump(http_response_code(204));

	$conn->close();
?>
