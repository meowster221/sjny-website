<?php
/* ==========================================================================
   SJNY Construction - estimate request mailer
   Receives the website quote form and emails a structured message with
   photo attachments. Change $TO to redirect where requests are delivered.
   ========================================================================== */

$TO = 'danny@sjnyconstruction.com, admin@sjnyconstruction.com';

header('Content-Type: application/json');

function clean_line($v) {
    $v = isset($v) ? trim((string) $v) : '';
    return str_replace(array("\r", "\n", '%0a', '%0d'), ' ', $v);
}

function esc($v) {
    return htmlspecialchars($v, ENT_QUOTES, 'UTF-8');
}

if (!isset($_SERVER['REQUEST_METHOD']) || $_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(array('ok' => false, 'error' => 'method'));
    exit;
}

/* Honeypot: humans never see this field. If it is filled, pretend
   success so the bot moves on, and send nothing. */
if (!empty($_POST['company'])) {
    echo json_encode(array('ok' => true));
    exit;
}

$name    = clean_line(isset($_POST['name']) ? $_POST['name'] : '');
$phone   = clean_line(isset($_POST['phone']) ? $_POST['phone'] : '');
$email   = clean_line(isset($_POST['email']) ? $_POST['email'] : '');
$address = clean_line(isset($_POST['address']) ? $_POST['address'] : '');
$service = clean_line(isset($_POST['service']) ? $_POST['service'] : '');
$details = isset($_POST['details']) ? trim((string) $_POST['details']) : '';

if ($name === '' || $phone === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(422);
    echo json_encode(array('ok' => false, 'error' => 'fields'));
    exit;
}

/* ----- photos: up to 10 images, 8 MB each, 20 MB combined ----- */
$attachments = array();
$skipped = 0;
if (!empty($_FILES['photos']) && is_array($_FILES['photos']['name'])) {
    $count = count($_FILES['photos']['name']);
    $total = 0;
    for ($i = 0; $i < $count && count($attachments) < 10; $i++) {
        $err = $_FILES['photos']['error'][$i];
        if ($err === UPLOAD_ERR_NO_FILE) { continue; }
        if ($err !== UPLOAD_ERR_OK) { $skipped++; continue; }
        $tmp  = $_FILES['photos']['tmp_name'][$i];
        $size = (int) $_FILES['photos']['size'][$i];
        if (!is_uploaded_file($tmp)) { $skipped++; continue; }
        if ($size <= 0 || $size > 8 * 1024 * 1024 || $total + $size > 20 * 1024 * 1024) { $skipped++; continue; }
        $mime = function_exists('mime_content_type') ? mime_content_type($tmp) : '';
        if (strpos((string) $mime, 'image/') !== 0) { $skipped++; continue; }
        $orig = preg_replace('/[^A-Za-z0-9._-]/', '_', clean_line($_FILES['photos']['name'][$i]));
        if ($orig === '' || $orig === false) { $orig = 'photo-' . ($i + 1) . '.jpg'; }
        $attachments[] = array('name' => $orig, 'mime' => $mime, 'data' => file_get_contents($tmp));
        $total += $size;
    }
}

/* ----- structured message body ----- */
$rows = array(
    'Name'             => $name,
    'Phone'            => $phone,
    'Email'            => $email,
    'Property address' => $address !== '' ? $address : 'Not provided',
    'Type of work'     => $service !== '' ? $service : 'Not provided',
);

$html  = '<div style="font-family:Georgia,serif;color:#0D1321;max-width:560px">';
$html .= '<h2 style="margin:0 0 4px;font-size:22px">New estimate request</h2>';
$html .= '<p style="margin:0 0 18px;color:#3E5C76;font-size:13px">Sent from the SJNY Construction website</p>';
$html .= '<table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;font-size:15px">';
foreach ($rows as $label => $value) {
    $html .= '<tr>'
           . '<td style="padding:9px 16px 9px 0;border-bottom:1px solid #d8d3c2;color:#3E5C76;white-space:nowrap;vertical-align:top">' . esc($label) . '</td>'
           . '<td style="padding:9px 0;border-bottom:1px solid #d8d3c2;font-weight:bold">' . esc($value) . '</td>'
           . '</tr>';
}
$html .= '</table>';
$html .= '<p style="margin:18px 0 6px;color:#3E5C76;font-size:13px">ABOUT THE PROJECT</p>';
$html .= '<p style="margin:0;white-space:pre-wrap;font-size:15px">' . esc($details !== '' ? $details : 'Not provided') . '</p>';
$html .= '<p style="margin:20px 0 0;color:#3E5C76;font-size:13px">'
       . count($attachments) . ' photo(s) attached'
       . ($skipped > 0 ? ' (' . $skipped . ' skipped: too large or not an image)' : '')
       . '</p>';
$html .= '</div>';

/* ----- assemble and send ----- */
$host = isset($_SERVER['HTTP_HOST']) ? preg_replace('/^www\./', '', clean_line($_SERVER['HTTP_HOST'])) : '';
$host = preg_replace('/[^A-Za-z0-9.-]/', '', (string) $host);
if ($host === '' || $host === null) { $host = 'sjnybuilds.com'; }

$fromName = str_replace('"', '', $name);
$boundary = 'b' . md5(uniqid('sjny', true));

$headers  = 'From: SJNY Website <no-reply@' . $host . ">\r\n";
$headers .= 'Reply-To: "' . $fromName . '" <' . $email . ">\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= 'Content-Type: multipart/mixed; boundary="' . $boundary . '"';

$body  = '--' . $boundary . "\r\n";
$body .= "Content-Type: text/html; charset=UTF-8\r\n";
$body .= "Content-Transfer-Encoding: 8bit\r\n\r\n";
$body .= $html . "\r\n";
foreach ($attachments as $a) {
    $body .= '--' . $boundary . "\r\n";
    $body .= 'Content-Type: ' . $a['mime'] . '; name="' . $a['name'] . '"' . "\r\n";
    $body .= "Content-Transfer-Encoding: base64\r\n";
    $body .= 'Content-Disposition: attachment; filename="' . $a['name'] . '"' . "\r\n\r\n";
    $body .= chunk_split(base64_encode($a['data'])) . "\r\n";
}
$body .= '--' . $boundary . '--';

$subject = 'Estimate request from ' . $name . ($service !== '' ? ' - ' . $service : '');

$sent = mail($TO, $subject, $body, $headers);
echo json_encode(array('ok' => (bool) $sent));
