<?php include "../db.php";
	$type = $_GET['type'];
	$url = $_GET['url'];

	if ($type === 'youtube') { // YouTube: all url types
		$data = file_get_contents("https://www.youtube.com/oembed?url=". $url ."&format=json");
		// Decode json to array
		$data = json_decode($data);

		// Get data from url
		// Split data->html to get src
		$split = explode(" ", $data->html);
		// Creating new string for iframe
		$newConcat = '';
		// Find src to add autoplay
		foreach ($split as &$a) {
			if (strpos($a, 'src') !== false)
    			$a = substr($a, 0, -1).'&autoplay=1"';

    		$newConcat = $newConcat.$a.' ';
		}
		// Concat iframe
		$data->iframe = substr($newConcat, 0, -1);

		// Encode array to json
		$data = json_encode($data);
	} else if ($type === 'vimeo') { // Vimeo: check url on preg_match()
		$regs = array();

        if (preg_match('%^https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)(?:[?]?.*)$%im', $url, $regs)) {
            $video_id = $regs[3];
            $data = unserialize(file_get_contents("http://vimeo.com/api/v2/video/$video_id.php"));
            $data[0]['iframe'] = '<iframe src="https://player.vimeo.com/video/'.$video_id.'?autoplay=1" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>';

			$data = json_encode($data[0]);
        } else { // video not exists or expired or indefined
        	$data = null;
        }
	} else { // Invalid URL
		$data = null;
	}

	echo $data;
?>
