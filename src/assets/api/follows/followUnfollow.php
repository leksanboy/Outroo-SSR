<?php include "../db.php";
	$data = json_decode(file_get_contents('php://input'), true);

	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$type = $data['type'];

	if ($type === 'pending') { // Follow private
		$sender = sessionId();
		$receiver = $data['receiver'];
		$status = 1;

		// Reset first
		$sql = "UPDATE z_following
				SET is_deleted = 1 
				WHERE sender = '$sender' 
					AND receiver = '$receiver'";
		$result = $conn->query($sql);

		$sql = "INSERT INTO z_following (sender, receiver, status, ip_address)
				VALUES ($sender, $receiver, $status, '$ipAddress')";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'id' 		=> $receiver,
			'url' 		=> 'followers',
			'type' 		=> 'startFollowingPrivate',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver
		);

		// Check to not notificate myself
		if ($sender != $receiver)  {
			generateNotification($notification);
		}

		var_dump(http_response_code(204));
		
		$conn->close();
	} else if ($type === 'following') { // Follow normal
		$sender = sessionId();
		$receiver = $data['receiver'];
		$status = 0;

		// Reset first
		$sql = "UPDATE z_following
				SET is_deleted = 1 
				WHERE sender = '$sender' 
					AND receiver = '$receiver'";
		$result = $conn->query($sql);

		$sql = "INSERT INTO z_following (sender, receiver, status, ip_address)
				VALUES ($sender, $receiver, $status, '$ipAddress')";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'id' 		=> $receiver,
			'url' 		=> 'followers',
			'type' 		=> 'startFollowing',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver
		);
		
		// Check to not notificate myself
		if ($sender != $receiver) {
			generateNotification($notification);
		}

		var_dump(http_response_code(204));
		$conn->close();
	} else if ($type === 'unfollow') { // Unfollow
		$sender = sessionId();
		$receiver = $data['receiver'];

		$sql = "UPDATE z_following
				SET is_deleted = 1,
					ip_address = '$ipAddress'
				WHERE sender = '$sender' 
					AND receiver = '$receiver'";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'id' 		=> $receiver,
			'url' 		=> 'followers',
			'type' 		=> 'stopFollowing',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver
		);
		
		// Check to not notificate myself
		if ($sender != $receiver) {
			generateNotification($notification);
		}

		var_dump(http_response_code(204));
		$conn->close();
	} else if ($type === 'accept') { // Accept request
		$receiver = sessionId();
		$sender = $data['sender'];

		$sql = "UPDATE z_following
				SET status = 0,
					ip_address = '$ipAddress'
				WHERE sender = '$sender'
					AND receiver = '$receiver'";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'id' 		=> $receiver,
			'url' 		=> 'followers',
			'type' 		=> 'acceptRequest',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver
		);

		// Check to not notificate myself
		if ($sender != $receiver) {
			generateNotification($notification);
		}

		$status = checkFollowingStatus($receiver, $sender);
		echo json_encode($status);

		$conn->close();
	} else if ($type === 'decline') { // Decline request
		$receiver = sessionId();
		$sender = $data['sender'];

		$sql = "UPDATE z_following
				SET is_deleted = 1,
					ip_address = '$ipAddress'
				WHERE sender = $sender
					AND receiver = $receiver";
		$result = $conn->query($sql);

		// Notification data
		$notification = array(
			'id' 		=> $receiver,
			'url' 		=> 'followers',
			'type' 		=> 'declineRequest',
			'sender' 	=> $sender,
			'receiver' 	=> $receiver
		);
		
		// Check to not notificate myself
		if ($sender != $receiver) {
			generateNotification($notification);
		}

		var_dump(http_response_code(204));
		
		$conn->close();
	}
?>
