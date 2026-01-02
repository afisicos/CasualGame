<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);

    if ($data !== null) {
        $timestamp = isset($data['timestamp']) ? $data['timestamp'] : date('d/m/Y, H:i:s');
        $money = isset($data['money']) ? $data['money'] : '0';
        $playTime = isset($data['playTime']) ? $data['playTime'] : '60';

        // Obtener información del navegador si está disponible
        $browserInfo = isset($data['browserInfo']) ? $data['browserInfo'] : null;
        $deviceStr = "";
        if ($browserInfo) {
            $device = isset($browserInfo['device']) ? $browserInfo['device'] : 'Desconocido';
            $country = isset($browserInfo['country']) ? trim($browserInfo['country']) : 'Desconocido';
            $lang = isset($browserInfo['language']) ? $browserInfo['language'] : '??';
            $screen = isset($browserInfo['screen']) ? $browserInfo['screen'] : '??x??';
            $deviceStr = " - Dispositivo: $device (País: $country, Idioma: $lang, Res: $screen)";
        }

        // Usamos una cadena simple para evitar problemas de encoding con el símbolo € si el server no es UTF-8
        $logEntry = "[" . $timestamp . "] Puntos: " . $money . " - Tiempo: " . $playTime . "s" . $deviceStr . PHP_EOL;

        $filename = 'game_sessions.txt';

        if (file_put_contents($filename, $logEntry, FILE_APPEND)) {
            echo json_encode(["status" => "success", "money_received" => $money]);
        } else {
            echo json_encode(["status" => "error", "message" => "Permission denied on file_put_contents"]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "JSON decode failed", "raw_input" => $json]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Only POST allowed"]);
}
?>
