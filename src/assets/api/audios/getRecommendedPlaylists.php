<?php include "../db.php";
	$ipAddress = $_SERVER['REMOTE_ADDR'];
	$user = $_GET['user'];

    $sql = "SELECT id,
                    original_id as o_id,
                    type,
                    name,
                    user,
                    title,
                    image,
                    private
            FROM z_audios_playlist
            WHERE is_deleted = 0
                AND type IS NULL
            ORDER BY RAND()
                AND date DESC
            LIMIT 7";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $data = array();
        while($row = $result->fetch_assoc()) {
            $row['title'] = html_entity_decode($row['title'], ENT_QUOTES);
            $row['original_title'] = html_entity_decode($row['original_title'], ENT_QUOTES);
            $row['original_artist'] = html_entity_decode($row['original_artist'], ENT_QUOTES);
            $data[] = $row;
        }

        echo json_encode($data);
    } else {
        var_dump(http_response_code(204));
    }

    $conn->close();
?>
