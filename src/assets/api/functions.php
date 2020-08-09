<?php
	////////////
	// COMMON //
	////////////

	function arrayRemoveDuplicates($array, $key) {
		$temp_array = array();
		$key_array = array();
		$i = 0;

		foreach($array as $val) {
			if (!in_array($val[$key], $key_array)) {
				$key_array[$i] = $val[$key];
				$temp_array[$i] = $val;
			}

			$i++;
		}

		return $temp_array;
	}

	// Get user id from headers Authorization
	function sessionId(){
		global $conn;

		foreach (getallheaders() as $name => $value) {
			if ($name === 'Authorization') {
				$auth = $value;
			}

			if ($name === 'Sec-Fetch-Dest') {
				$secFetchDest = $value;
			}

			if ($name === 'Sec-Fetch-Mode') {
				$secFetchMode = $value;
			}
		}

		/* Return error | when try access by url with params  */
		if ($secFetchDest === 'document' && $secFetchMode === 'navigate') {
			echo " ( ._.) Sorry";
			http_response_code(401);
			var_dumpvar_dump(http_response_code(401));
		}

		if (isset($auth)) {
			$sql = "SELECT user
					FROM z_logins
					WHERE authorization = '$auth'";
			$result = $conn->query($sql)->fetch_assoc();

			if ($result['user']) {
				$result = $result['user'];
			} else {
				$result = 0;
			}
		} else {
			$result = 0;
		}

		return $result;
	}

	// Get languages
	function getLanguages(){
		global $conn;

		$sql = "SELECT id, caption
				FROM z_languages
				WHERE is_deleted = 0
				ORDER BY caption ASC";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			$data[] = $row;
		}

		return $data;
	}

	// Time format for videos
	function timeFormat($timeInSeconds) {
		$timeInSeconds = round($timeInSeconds);
		$timeInSeconds = abs($timeInSeconds);
		$hours = floor($timeInSeconds / 3600) . ':';
		$minutes = floor(($timeInSeconds / 60) % 60). ':';
		$seconds = substr('00' . $timeInSeconds % 60, -2);

		if ($hours === '0:') {
			$hours = '';
		}

		return $hours.$minutes.$seconds;
	}

	// Generate random string
	function generateRandomString($length) {
		$characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$charactersLength = strlen($characters);
		$randomString = '';

		for ($i = 0; $i < $length; $i++) {
			$randomString .= $characters[rand(0, $charactersLength - 1)];
		}

		return $randomString;
	}

	//////////
	// USER //
	//////////

	// Get user id by username
	function userLoginActivity($user){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		// Browser
		$browser = $_SERVER['HTTP_USER_AGENT'];

		// Authorization
		$authorization = generateRandomString(23*3);

		$sql = "INSERT INTO z_logins (user, authorization, browser, ip_address)
				VALUES ($user, '$authorization', '$browser', '$ipAddress')";
		$result = $conn->query($sql);

		return $authorization;
	}

	// Get user id by username
	function userId($username){
		global $conn;

		$sql = "SELECT id
				FROM z_users
				WHERE username LIKE '$username'";
		$result = $conn->query($sql)->fetch_assoc();

		if ($result['id']) {
			$result = $result['id'];
		} else {
			$result = "";
		}

		return $result;
	}

	// Get user name by id
	function userName($id){
		global $conn;

		$sql = "SELECT name
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		return html_entity_decode($result['name'], ENT_QUOTES);
	}

	// Get user username by id
	function userUsername($id){
		global $conn;

		$sql = "SELECT username
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		return $result['username'];
	}

	// Get user avatar by id
	function userAvatar($id){
		global $conn;

		$sql = "SELECT avatar
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		return $result['avatar'];
	}

	// Get user avatar by id
	function userPassword($id){
		global $conn;

		$sql = "SELECT password
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		return $result['password'];
	}

	// Get user data by id
	function userData($id){
		global $conn;

		$sql = "SELECT id,
						username,
						name,
						avatar,
						background,
						email,
						about,
						language,
						theme,
						official,
						private
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		if ($result){
			$result['avatarUrl'] 			= $result['avatar'] ? ('https://outroo.com/assets/media/user/'.$result['id'].'/avatar/'.$result['avatar']) : '';
			$result['languages'] 			= getLanguages();
			$result['theme'] 				= intval($result['theme']);
			$result['official'] 			= $result['official'] ? true : false;
			$result['private'] 				= $result['private'] ? true : false;
			$result['name'] 				= html_entity_decode($result['name'], ENT_QUOTES);
			$result['about'] 				= html_entity_decode($result['about'], ENT_QUOTES);
			$result['countFollowing'] 		= countUserFollowing($result['id']);
			$result['countFollowers'] 		= countUserFollowers($result['id']);
			$result['countAudios'] 			= countUserAudios($result['id']);
			$result['countBookmarks'] 		= countUserBookmarks($result['id']);
		}

		return $result;
	}

	// Get user triplete data by id
	function userUsernameNameAvatar($id){
		global $conn;

		$sql = "SELECT id, username, name, avatar, official
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['name'] = html_entity_decode($result['name'], ENT_QUOTES);
		$result['avatarUrl'] = $result['avatar'] ? ('https://outroo.com/assets/media/user/'.$result['id'].'/avatar/'.$result['avatar']) : '';

		return $result;
	}

	// Check username
	function checkUsername($username){
		global $conn;

		$inUse = array("outroo", "outhroo", "sasa", "oleksandr", "vitaliy", "vitaly", "vitali", "rafalsky", "rafalskyy",
						"user", "audios", "bookmarks", "saved", "followers", "following", "home", "main", "news",
						"notifications", "photos", "settings",
						"index", "web", "about", "confirm-email", "error", "forgot-password", "logout", "privacy", "terms",
						"reset-password", "signin", "login", "signup", "support", "help", "blog", "press", "developer",
						"jobs", "core", "pages", "assets", "environments", "ssl-https", "api");
		$username = strtolower($username);

		if (in_array($username, $inUse)) {
			return true;
		} else {
			if (substr($username, 0, strlen('asset')) === 'asset') {
				return true;
			} else {
				$sql = "SELECT id
						FROM z_users
						WHERE username LIKE '$username'";
				$result = $conn->query($sql);

				$status = ($result->num_rows == 0) ? false : true;

				return $status;
			}
		}
	}

	function checkEmail($email) {
		global $conn;

		$sql = "SELECT id
				FROM z_users
				WHERE email LIKE '$email'";
		$result = $conn->query($sql);

		$status = ($result->num_rows == 0) ? false : true;

		return $status;
	}

	// Get user private
	function checkUserPrivacy($id){
		global $conn;

		$sql = "SELECT private
				FROM z_users
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['private'] = $result['private'] ? true : false;

		return $result['private'];
	}

	// Check if I'm following my follower
	function checkFollowingStatus($sender, $receiver){
		global $conn;

		if ($sender !== $receiver) {
			$sql = "SELECT status
					FROM z_following
					WHERE sender = $sender
						AND receiver = $receiver
						AND is_deleted = 0";
			$result = $conn->query($sql)->fetch_assoc();

			if ($result)
				$result = intval($result['status']) === 1 ? 'pending' : 'following';
			else
				$result = 'unfollow';

			return $result;
		} else {
			return null;
		}
	}

	// Count following
	function countUserFollowing($id){
		global $conn;

		$sql = "SELECT id
				FROM z_following
				WHERE sender = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count followers
	function countUserFollowers($id){
		global $conn;

		$sql = "SELECT id
				FROM z_following
				WHERE receiver = $id
					AND is_deleted = 0
					AND status = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count photos
	function countUserPhotos($id){
		global $conn;

		$sql = "SELECT id
				FROM z_photos_favorites
				WHERE user = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count audios
	function countUserAudios($id){
		global $conn;

		$sql = "SELECT id
				FROM z_audios_favorites
				WHERE user = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count bookmarks
	function countUserBookmarks($id){
		global $conn;

		$sql = "SELECT b.id
				FROM z_bookmarks b
					INNER JOIN z_publications p ON p.id = b.post
				WHERE b.user = $id
					AND b.is_deleted = 0
					AND p.is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Set visitor
	function setVisitor($sender, $receiver){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		if ($sender != $receiver) {
			$sql = "INSERT INTO z_users_replays (sender, receiver, ip_address)
					VALUES ($sender, $receiver, '$ipAddress')";
			$result = $conn->query($sql);

			return $result;
		}
	}

	////////////
	// AUDIOS //
	////////////

	// Get audio data
	function getAudioData($id){
		global $conn;

		$sql = "SELECT id,
						name,
						title,
						original_title,
						original_artist,
						image,
						explicit,
						duration
				FROM z_audios
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['song'] = $result['id'];
		$result['title'] = html_entity_decode($result['title'], ENT_QUOTES);
		$result['original_title'] = html_entity_decode($result['original_title'], ENT_QUOTES);
		$result['original_artist'] = html_entity_decode($result['original_artist'], ENT_QUOTES);
		$result['explicit'] = boolval($result['explicit']);

		return $result;
	}

	// Get inserted playlist
	function getPlaylist($type, $value) {
		global $conn;

		if ($type === 'id') {
			$cond = "id = $value";
		} else if ($type === 'name') {
			$cond = "name = '$value'";
		}

		$sql = "SELECT id,
						original_id as o_id,
						type,
						name,
						user,
						title,
						description,
						genre,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE $cond";
		$result = $conn->query($sql)->fetch_assoc();

		$result['user'] = userUsernameNameAvatar($result['user']);
		$result['title'] = html_entity_decode($result['title'], ENT_QUOTES);
		$result['private'] = boolval($result['private']);
		$result['idPlaylist'] = $result['id'];
		$result['explicit'] = boolval($result['explicit']);

		if ($result['type'] === 'follow') {
			$o_result = getPlaylist('id', $result['o_id']);

			$result['name'] = $o_result['name'];
			$result['title'] = $o_result['title'];
			$result['image'] = $o_result['image'];
			$result['idPlaylist'] = $o_result['idPlaylist'];
		}

		return $result;
	}

	/* // Get playlists
	function getPlaylists($user){
		global $conn;

		$sql = "SELECT id, title, private
				FROM z_audios_playlist
				WHERE user = $user
					AND is_deleted = 0
				ORDER BY date DESC";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['private'] = $row['private'] ? true : false;
			$row['idPlaylist'] = $row['id'];
			$data[] = $row;
		}

		return $data;
	} */

	// Get playlists for select
	function getPlaylistsSelect($user){
		global $conn;

		$sql = "SELECT id,
						type,
						title,
						image,
						explicit,
						private
				FROM z_audios_playlist
				WHERE user = $user
					AND is_deleted = 0
				ORDER BY date DESC";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			if ($row['type'] !== 'follow') {
				$row['private'] = $row['private'] ? true : false;
				$row['idPlaylist'] = $row['id'];
				$row['explicit'] = boolval($row['explicit']);
				$data[] = $row;
			}
		}

		return $data;
	}

	// Get genre data
	function getGenre($id) {
		global $conn;

		$sql = "SELECT id,
						title,
						image
				FROM z_audios_genres
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		return $result;
	}

	// Count replays
	function counSongReplays($id){
		global $conn;

		$sql = "SELECT id
				FROM z_audios_replays
				WHERE song = $id";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count times added
	function counSongTimesAdded($id){
		global $conn;

		$sql = "SELECT id
				FROM z_audios_favorites
				WHERE song = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Get publication data for notification
	function getSongById($id){
		global $conn;

		$sql = "SELECT id,
						name,
						title,
						original_title,
						original_artist,
						duration,
						image,
						explicit
				FROM z_audios
				WHERE id = $id AND is_deleted = 0";
		$result = $conn->query($sql)->fetch_assoc();

		$result['title'] = html_entity_decode($result['title'], ENT_QUOTES);
		$result['original_title'] = html_entity_decode($result['original_title'], ENT_QUOTES);
		$result['original_artist'] = html_entity_decode($result['original_artist'], ENT_QUOTES);
		$result['imageSrc'] = 'https://outroo.com/assets/media/audios/thumbnails/'.$result['image'];
		$result['explicit'] = boolval($result['explicit']);

		return $result;
	}

	/* // Get id by name
	function getPlaylistIdByName($name){
		global $conn;

		$sql = "SELECT id
				FROM z_audios_playlist
				WHERE name = '$name'";
		$result = $conn->query($sql)->fetch_assoc();

		return $result['id'];
	} */

	// Search analytics
	function searchAudioAnalytics($user, $caption, $type){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		$sql = "INSERT INTO z_audios_search (user, caption, type, ip_address)
				VALUES ($user, '$caption', '$type', '$ipAddress')";
		$result = $conn->query($sql);
	}

	////////////
	// PHOTOS //
	////////////

	// Get photo data
	function getPhotoData($id){
		global $conn;

		$sql = "SELECT id,
						name,
						mimetype,
						duration
				FROM z_photos
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		return $result;
	}

	// Check if I liked photo
	function checkLikedPhoto($photo, $user){
		global $conn;

		$sql = "SELECT id
				FROM z_photos_likes
				WHERE photo = '$photo'
					AND user = $user";
		$result = $conn->query($sql)->num_rows;

		if ($result)
			$result = true;
		else
			$result = false;

		return $result;
	}

	// Get inserted comment in photo
	function getPhotoComment($id){
		global $conn;

		$sql = "SELECT id, user, photo, comment, date
				FROM z_photos_comments
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['user'] = userUsernameNameAvatar($result['user']);
		$result['comment'] = trim($result['comment']) ? html_entity_decode($result['comment'], ENT_QUOTES) : null;

		return $result;
	}

	// Get photo likers
	function getPhotoLikers($id){
		global $conn;

		$sql = "SELECT user
				FROM z_photos_likes
				WHERE photo = $id
				ORDER BY RAND()
				LIMIT 2";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['id'] = $row['user'];
			$row['username'] = userUsername($row['user']);
			$data[] = $row;
		}

		return $data;
	}

	// Count likes photo
	function countLikesPhoto($id){
		global $conn;

		$sql = "SELECT id
				FROM z_photos_likes
				WHERE photo = $id";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count comments photo
	function countCommentsPhoto($id){
		global $conn;

		$sql = "SELECT id
				FROM z_photos_comments
				WHERE photo = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Get photo data for notification
	function getIdNameContentMediaCommentFromPhotoById($id, $commentId){
		global $conn;

		$sql = "SELECT p.id, p.name, p.mimetype, p.duration
				FROM z_photos_favorites f
					INNER JOIN z_photos p ON p.id = f.photo
				WHERE f.id = '$id'";
		$result = $conn->query($sql)->fetch_assoc();

		$result['comment'] = ($commentId ? getPhotoComment($commentId) : null);

		// Media
		if(strrpos($result['mimetype'], "image") !== false)
			$result['media'] = ($result['name'] ? 'https://outroo.com/assets/media/photos/thumbnails/'.$result['name'] : null);
		else if(strrpos($result['mimetype'], "video") !== false)
			$result['media'] = ($result['name'] ? 'https://outroo.com/assets/media/videos/thumbnails/'.$result['name'] : null);
		else
			$result['media'] = null;

		return $result;
	}

	//////////////////
	// PUBLICATIONS //
	//////////////////

	// Get publication
	function getPublication($id){
		global $conn;

		$sql = "SELECT id,
						name,
						photos as contentData
				FROM z_publications
				WHERE id = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->fetch_assoc();

		if ($result) {
			// Format photos
			$result['contentData'] = json_decode($result['contentData']);
			foreach ($result['contentData'] as &$p) {
				$p = getPhotoData($p);
			}

			if ($result['contentData']) {
				$result['contentData'] = $result['contentData'][0];
			}

			return $result;
		} else {
			return null;
		}
	}

	// Count likes publication
	function countLikesPublication($id){
		global $conn;

		$sql = "SELECT id
				FROM z_publications_likes
				WHERE publication = $id";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Count comments publication
	function countCommentsPublication($id){
		global $conn;

		$sql = "SELECT id
				FROM z_publications_comments
				WHERE publication = $id
					AND is_deleted = 0";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Check if I liked a publication
	function checkLikedPublication($publication, $user){
		global $conn;

		$sql = "SELECT id
				FROM z_publications_likes
				WHERE publication = '$publication'
					AND user = $user";
		$result = $conn->query($sql)->num_rows;

		if ($result)
			$result = true;
		else
			$result = false;

		return $result;
	}

	// Check if I marked a publication
	function checkMarkedPublication($publication, $user){
		global $conn;

		$sql = "SELECT id
				FROM z_bookmarks
				WHERE post = $publication
					AND user = $user
					AND is_deleted = 0";
		$result = $conn->query($sql)->fetch_assoc();

		$result['id'] = $result['id'] ? $result['id'] : null;
		$result['checked'] = $result['id'] ? true : false;

		return $result;
	}

	// Get inserted comment in publication
	function getPublicationComment($id){
		global $conn;

		$sql = "SELECT id, user, publication, comment, date
				FROM z_publications_comments
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['user'] = userUsernameNameAvatar($result['user']);
		$result['comment'] = trim($result['comment']) ? html_entity_decode($result['comment'], ENT_QUOTES) : null;

		return $result;
	}

	// Get inserted comment in publication
	function getPublicationLikers($id){
		global $conn;

		$sql = "SELECT user
				FROM z_publications_likes
				WHERE publication = $id
				ORDER BY RAND()
				LIMIT 2";
		$result = $conn->query($sql);

		$data = array();
		while($row = $result->fetch_assoc()) {
			$row['id'] = $row['user'];
			$row['username'] = userUsername($row['user']);
			$data[] = $row;
		}

		return $data;
	}

	// Upload audio files on post
	function uploadAudiosPublication($user, $name, $mimetype, $title, $original_title, $original_artist, $genre, $image, $duration){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		// Insert file
		$sql = "INSERT INTO z_audios (user, name, mimetype, title, original_title, original_artist, genre, image, duration, ip_address)
				VALUES ($user, '$name', '$mimetype', '$title', '$original_title', '$original_artist', '$genre', '$image', '$duration', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		// Insert to user
		$sqlFav = "INSERT INTO z_audios_favorites (user, song, ip_address)
					VALUES ($user, $insertedId, '$ipAddress')";
		$resultFav = $conn->query($sqlFav);

		return $insertedId;
	}

	// Upload photo & video files on publications
	function uploadPhotosPublication($user, $name, $mimetype, $duration){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		// Insert file
		$sql = "INSERT INTO z_photos (user, name, mimetype, duration, ip_address)
				VALUES ($user, '$name', '$mimetype', '$duration', '$ipAddress')";
		$result = $conn->query($sql);
		$insertedId = $conn->insert_id;

		// Insert to user
		$sqlFav = "INSERT INTO z_photos_favorites (user, photo, ip_address)
					VALUES ($user, $insertedId, '$ipAddress')";
		$resultFav = $conn->query($sqlFav);

		return $insertedId;
	}

	// Get publication data for notification
	function getIdNameContentMediaCommentFromPublicationById($id, $commentId){
		global $conn;

		$sql = "SELECT id,
						name,
						content,
						url_video as urlVideo,
						photos
				FROM z_publications
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['content'] = html_entity_decode($result['content'], ENT_QUOTES);
		$result['comment'] = ($commentId ? getPublicationComment($commentId) : null);

		// Media
		$result['urlVideo'] = json_decode($result['urlVideo']);
		$result['photos'] = json_decode($result['photos']);

		if (count($result['photos']) > 0) {
			$result['media'] = getPhotoData($result['photos'][0]);

			if (strrpos($result['media']['mimetype'], "image") !== false && strlen($result['media']['duration']) == 0) {
				$result['media'] = ($result['media']['name'] ? 'https://outroo.com/assets/media/photos/thumbnails/'.$result['media']['name'] : null);
			} else if (strrpos($result['media']['mimetype'], "video") !== false || strlen($result['media']['duration']) > 0) {
				$result['media'] = ($result['media']['name'] ? 'https://outroo.com/assets/media/videos/thumbnails/'.$result['media']['name'] : null);
			} else {
				$result['media'] = null;
			}
		} else {
			if (count($result['urlVideo']) > 0) {
				$result['media'] = $result['urlVideo']->thumbnail;
			} else {
				$result['media'] = null;
			}
		}

		return $result;
	}

	// Get hashtag count
	function hashtagCount($caption){
		global $conn;

		$sql = "SELECT id
				FROM z_publications
				WHERE hashtags LIKE '%$caption%'
					AND (
							(length(photos) > 0 AND is_deleted = 0) OR
							(length(url_video) > 0 AND is_deleted = 0) OR
							((length(photos) > 0 AND length(url_video) > 0) AND is_deleted = 0)
						)
				ORDER BY id";
		$result = $conn->query($sql)->num_rows;

		return $result;
	}

	// Search analitics
	function searchPublicationAnalytics($user, $caption, $type){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		$sql = "INSERT INTO z_publications_search (user, caption, type, ip_address)
				VALUES ($user, '$caption', '$type', '$ipAddress')";
		$result = $conn->query($sql);
	}

	// Update publication date
	function updatePublicationDate(){
		global $conn;

		$date = date('Y-m-d H:i:s');

		$sql = "SELECT id
				FROM z_publications
				WHERE publication_date <= $date
					AND is_deleted = 2
				ORDER BY date DESC
				LIMIT 0, 100";
		$result = $conn->query($sql);

		if ($result->num_rows > 0) {
			while($row = $result->fetch_assoc()) {
				$id = $row['id'];

				$sqlU = "UPDATE z_publications
						SET is_deleted = 0
						WHERE id = $id";
				$conn->query($sqlU);
			}
		}
	}

	///////////////////
	// NOTIFICATIONS //
	///////////////////

	// Update notification status
	function updateNotificationStatus($id){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		$sql = "UPDATE z_notifications
				SET is_seen = 1, ip_address = '$ipAddress'
				WHERE id = $id";
		$result = $conn->query($sql);

		return true;
	}

	// Insert notification
	function generateNotification($data){
		global $conn;
		$ipAddress = $_SERVER['REMOTE_ADDR'];

		$id = $data['id'];
		$url = $data['url'];
		$type = $data['type'];
		$sender = $data['sender'];
		$receiver = $data['receiver'];
		$comment = $data['comment'];

		switch ($url) {
			case 'followers':
				if ($type === 'startFollowing') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_url = '$url'
								AND is_deleted = 0";
					$result = $conn->query($sql);

					$sqlInsert = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
									VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
					$resultInsert = $conn->query($sqlInsert);
				} else if ($type === 'stopFollowing') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_url = '$url'
								AND is_deleted = 0";
					$result = $conn->query($sql);
				} else if ($type === 'startFollowingPrivate') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_url = '$url'
								AND page_type = 'acceptRequest'
								AND is_deleted = 0";
					$result = $conn->query($sql);

					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
					$result = $conn->query($sql);
				} else if ($type === 'acceptRequest') {
					$sql = "UPDATE z_notifications
							SET page_type = 'startFollowingPrivateAccepted', ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_url = '$url'
								AND is_deleted = 0";
					$result = $conn->query($sql);

					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $receiver
								AND receiver = $sender
								AND page_url = '$url'
								AND is_deleted = 0";
					$result = $conn->query($sql);

					$sqlInsert = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
									VALUES ($receiver, $sender, $id, '$url', '$type', '$ipAddress')";
					$resultInsert = $conn->query($sqlInsert);
				} else if ($type === 'declineRequest') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_url = '$url'
								AND page_type = 'startFollowingPrivate'
								AND is_deleted = 0";
					$result = $conn->query($sql);
				}
				break;
			case 'publication':
				if ($type === 'like') {
					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
					$result = $conn->query($sql);
				} else if ($type === 'unlike') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_id = $id
								AND page_url = '$url'
								AND page_type = 'like'";
					$result = $conn->query($sql);
				} else if ($type === 'comment') {
					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, comment_id, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', $comment, '$ipAddress')";
					$result = $conn->query($sql);
				} else if ($type === 'uncomment') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_id = $id
								AND page_url = '$url'
								AND comment_id = $comment";
					$result = $conn->query($sql);
				} else if ($type === 'commentUncommented') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 0, ip_address = '$ipAddress'
							WHERE sender = $sender
								AND receiver = $receiver
								AND page_id = $id
								AND page_url = '$url'
								AND comment_id = $comment";
					$result = $conn->query($sql);
				} else if ($type === 'mention') {
					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
					$result = $conn->query($sql);
				} else if ($type === 'mentionComment') {
					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, comment_id, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', $comment, '$ipAddress')";
					$result = $conn->query($sql);
				} else if ($type === 'share') {
					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
					$result = $conn->query($sql);
				}
				break;
			case 'audio':
				$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
						VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
				$result = $conn->query($sql);
				break;
			case 'playlist':
				$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
						VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
				$result = $conn->query($sql);
				break;
			case 'user':
				$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
						VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
				$result = $conn->query($sql);
				break;
			case 'message':
				if ($type === 'comment') {
					$sql = "INSERT INTO z_notifications (sender, receiver, page_id, page_url, page_type, ip_address)
							VALUES ($sender, $receiver, $id, '$url', '$type', '$ipAddress')";
					$result = $conn->query($sql);
				} else if ($type === 'add') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 0, ip_address = '$ipAddress'
							WHERE page_id = $id";
					$result = $conn->query($sql);
				} else if ($type === 'remove') {
					$sql = "UPDATE z_notifications
							SET is_deleted = 1, ip_address = '$ipAddress'
							WHERE page_id = $id";
				}
				break;
		}
	}

	/////////////
	// MESSAGE //
	/////////////

	// // Get conversation users
	// function getChatConversationUsers($id, $user){
	// 	global $conn;

	// 	$sql = "SELECT user
	// 			FROM z_chat_users
	// 			WHERE chat = $id
	// 				AND is_deleted = 0
	// 			ORDER BY date DESC
	// 			LIMIT 100";
	// 	$result = $conn->query($sql);

	// 	$dataAll = array();
	// 	$dataExcluded = array();
	// 	while($row = $result->fetch_assoc()) {
	// 		$row['user'] = userUsernameNameAvatar($row['user']);
	// 		$dataAll[] = $row;

	// 		if ($user != $row['user']['id'])
	// 			$dataExcluded[] = $row;
	// 	}

	// 	$data = array(
	// 		"all" 	=> $dataAll,
	// 		"excluded" 	=> $dataExcluded
	// 	);

	// 	return $data;
	// }

	// // Get last inserted comment
	// function getChatConversationLastComment($id){
	// 	global $conn;

	// 	$sql = "SELECT content, date, type
	// 			FROM z_chat_conversation
	// 			WHERE chat = $id
	// 				AND is_deleted = 0
	// 			ORDER BY date DESC
	// 			LIMIT 1";
	// 	$result = $conn->query($sql)->fetch_assoc();
	// 	$result['content'] = trim($result['content']) ? html_entity_decode($result['content'], ENT_QUOTES) : null;

	// 	return $result;
	// }

	// Get inserted comment in conversation
	function getMessageById($id){
		global $conn;

		$sql = "SELECT id, user, message, content, content_original, date
				FROM z_message_conversation
				WHERE id = $id";
		$result = $conn->query($sql)->fetch_assoc();

		$result['user'] = userUsernameNameAvatar($result['user']);
		$result['content'] = trim($result['content']) ? html_entity_decode($result['content'], ENT_QUOTES) : null;

		return $result;
	}
?>
