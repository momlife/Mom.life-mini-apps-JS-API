<?php
    $data = '{"status": 201}';

    header('Content-Type: application/json');
    echo json_encode($data);
?>