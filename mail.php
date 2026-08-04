<?php
// Сюда будут приходить заявки
$to = "bezprizyvateam@gmail.com"; 
$subject = "Заявка с сайта БезПризыва Team";

// Заголовки, чтобы письмо не улетало в спам и поддерживало русский язык
$headers = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: info@bezpriziva.team\r\n"; // Тут укажите домен вашего сайта

// Читаем данные из формы (защищаем от спам-ботов)
$name = isset($_POST['user_name']) ? htmlspecialchars(trim($_POST['user_name'])) : '';
$phone = isset($_POST['user_phone']) ? htmlspecialchars(trim($_POST['user_phone'])) : '';

if (!empty($name) && !empty($phone)) {
    // Красивое HTML-письмо
    $message = "
    <h2>Новая заявка на консультацию</h2>
    <p><b>Имя призывника:</b> {$name}</p>
    <p><b>Телефон для связи:</b> {$phone}</p>
    <p>---<br>Сообщение отправлено автоматически.</p>
    ";

    // Отправляем
    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(["status" => "success"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Ошибка сервера отправки"]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Заполните все поля"]);
}
?>
