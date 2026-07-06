<?php
/**
 * AFI Systems — Contact Form Handler
 * Sends enquiry to: (1) Email via PHPMailer  (2) WhatsApp via CallMeBot API
 *
 * Setup:
 *  1. Upload contact.php alongside index/afi-home.html
 *  2. Fill in CONFIG section below
 *  3. Run:  composer require phpmailer/phpmailer   (or use the bundled fallback)
 */

/* ══════════════════════════════════════
   CONFIG  — edit these values
══════════════════════════════════════ */
define('TO_EMAIL',      'info@afisystems.in');          // recipient email
define('TO_NAME',       'AFI Systems');
define('FROM_EMAIL',    'noreply@afisystems.in');        // sender (must match your SMTP domain)
define('FROM_NAME',     'AFI Systems Website');
define('SMTP_HOST',     'smtp.hostinger.com');           // your SMTP host
define('SMTP_PORT',     587);
define('SMTP_USER',     'noreply@afisystems.in');        // SMTP username
define('SMTP_PASS',     'YOUR_SMTP_PASSWORD');           // SMTP password
define('SMTP_SECURE',   'tls');                          // tls or ssl

// CallMeBot WhatsApp API (free, supports personal WA numbers)
// Register at: https://www.callmebot.com/blog/free-api-whatsapp-messages/
define('WA_PHONE',      '919818251017');                 // country code + number, no +
define('WA_APIKEY',     'YOUR_CALLMEBOT_APIKEY');        // get from CallMeBot registration

/* ══════════════════════════════════════
   CORS / JSON response helper
══════════════════════════════════════ */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');

function respond(bool $ok, string $msg): void {
    echo json_encode(['success' => $ok, 'message' => $msg]);
    exit;
}

/* ══════════════════════════════════════
   VALIDATE INPUT
══════════════════════════════════════ */
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(false, 'Method not allowed.');
}

$name      = trim(strip_tags($_POST['name']       ?? ''));
$phone     = trim(strip_tags($_POST['phone']      ?? ''));
$email     = trim(strip_tags($_POST['email']      ?? ''));
$category  = trim(strip_tags($_POST['category']   ?? ''));
$orderType = trim(strip_tags($_POST['order_type'] ?? ''));
$budget    = trim(strip_tags($_POST['budget']     ?? ''));
$message   = trim(strip_tags($_POST['message']    ?? ''));

// Required fields
if (!$name || !$phone || !$category || !$message) {
    respond(false, 'Please fill all required fields.');
}

// Phone — 10-digit Indian mobile
if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
    respond(false, 'Enter a valid 10-digit Indian mobile number.');
}

// Email (optional but validate if provided)
if ($email && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    respond(false, 'Invalid email address.');
}

/* ══════════════════════════════════════
   BUILD MESSAGE BODY
══════════════════════════════════════ */
$subject = "New Furniture Enquiry — {$name} | AFI Systems";

$htmlBody = "
<html><body style='font-family:Arial,sans-serif;color:#333;'>
<h2 style='color:#1a5fa8;border-bottom:3px solid #1a5fa8;padding-bottom:8px;'>
  New Enquiry — AFI Systems Website
</h2>
<table cellpadding='8' cellspacing='0' style='width:100%;border-collapse:collapse;'>
  <tr style='background:#f5f7fa;'>
    <td style='width:160px;font-weight:700;border:1px solid #dde5ef;'>Name</td>
    <td style='border:1px solid #dde5ef;'>{$name}</td>
  </tr>
  <tr>
    <td style='font-weight:700;border:1px solid #dde5ef;'>Phone</td>
    <td style='border:1px solid #dde5ef;'>{$phone}</td>
  </tr>
  <tr style='background:#f5f7fa;'>
    <td style='font-weight:700;border:1px solid #dde5ef;'>Email</td>
    <td style='border:1px solid #dde5ef;'>" . ($email ?: '—') . "</td>
  </tr>
  <tr>
    <td style='font-weight:700;border:1px solid #dde5ef;'>Category</td>
    <td style='border:1px solid #dde5ef;'>{$category}</td>
  </tr>
  <tr style='background:#f5f7fa;'>
    <td style='font-weight:700;border:1px solid #dde5ef;'>Order Type</td>
    <td style='border:1px solid #dde5ef;'>{$orderType}</td>
  </tr>
  <tr>
    <td style='font-weight:700;border:1px solid #dde5ef;'>Budget</td>
    <td style='border:1px solid #dde5ef;'>{$budget}</td>
  </tr>
  <tr style='background:#f5f7fa;'>
    <td style='font-weight:700;border:1px solid #dde5ef;vertical-align:top;'>Message</td>
    <td style='border:1px solid #dde5ef;'>" . nl2br(htmlspecialchars($message)) . "</td>
  </tr>
</table>
<p style='margin-top:20px;font-size:12px;color:#999;'>
  Submitted: " . date('d M Y, h:i A') . " IST &nbsp;|&nbsp; IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'unknown') . "
</p>
</body></html>";

$plainBody = "New Enquiry — AFI Systems\n\n"
    . "Name:       {$name}\n"
    . "Phone:      {$phone}\n"
    . "Email:      " . ($email ?: '—') . "\n"
    . "Category:   {$category}\n"
    . "Order Type: {$orderType}\n"
    . "Budget:     {$budget}\n"
    . "Message:\n{$message}\n\n"
    . "Submitted: " . date('d M Y, h:i A') . " IST";

/* ══════════════════════════════════════
   SEND EMAIL — PHPMailer (preferred)
   Falls back to PHP mail() if composer
   package not available
══════════════════════════════════════ */
$emailSent = false;
$emailError = '';

// Try PHPMailer if autoloader exists
if (file_exists(__DIR__ . '/vendor/autoload.php')) {
    require __DIR__ . '/vendor/autoload.php';
    try {
        $mail = new PHPMailer\PHPMailer\PHPMailer(true);
        $mail->isSMTP();
        $mail->Host       = SMTP_HOST;
        $mail->SMTPAuth   = true;
        $mail->Username   = SMTP_USER;
        $mail->Password   = SMTP_PASS;
        $mail->SMTPSecure = SMTP_SECURE;
        $mail->Port       = SMTP_PORT;
        $mail->CharSet    = 'UTF-8';

        $mail->setFrom(FROM_EMAIL, FROM_NAME);
        $mail->addAddress(TO_EMAIL, TO_NAME);
        if ($email) $mail->addReplyTo($email, $name);

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = $htmlBody;
        $mail->AltBody = $plainBody;

        $mail->send();
        $emailSent = true;
    } catch (Exception $e) {
        $emailError = $mail->ErrorInfo;
    }
} else {
    // Fallback: PHP built-in mail()
    $headers  = "MIME-Version: 1.0\r\n";
    $headers .= "Content-type: text/html; charset=UTF-8\r\n";
    $headers .= "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
    if ($email) $headers .= "Reply-To: {$email}\r\n";
    $emailSent = mail(TO_EMAIL, $subject, $htmlBody, $headers);
    if (!$emailSent) $emailError = 'mail() failed — check server mail config.';
}

/* ══════════════════════════════════════
   SEND WHATSAPP — CallMeBot API
   (free, no monthly fees)
   Docs: https://www.callmebot.com/
══════════════════════════════════════ */
$waText = "🔔 *New Enquiry — AFI Systems*\n\n"
    . "👤 *Name:* {$name}\n"
    . "📞 *Phone:* {$phone}\n"
    . ($email ? "📧 *Email:* {$email}\n" : '')
    . "🛋️ *Category:* {$category}\n"
    . "📦 *Order Type:* {$orderType}\n"
    . "💰 *Budget:* {$budget}\n"
    . "📝 *Message:*\n{$message}\n\n"
    . "🕐 " . date('d M Y, h:i A') . " IST";

$waUrl = 'https://api.callmebot.com/whatsapp.php?'
    . http_build_query([
        'phone'  => WA_PHONE,
        'text'   => $waText,
        'apikey' => WA_APIKEY,
    ]);

$waSent  = false;
$waError = '';

// Use cURL for reliability
if (function_exists('curl_init')) {
    $ch = curl_init();
    curl_setopt_array($ch, [
        CURLOPT_URL            => $waUrl,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_FOLLOWLOCATION => true,
    ]);
    $waResponse = curl_exec($ch);
    $waHttpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError  = curl_error($ch);
    curl_close($ch);

    if ($waHttpCode === 200 && strpos(strtolower($waResponse ?? ''), 'message sent') !== false) {
        $waSent = true;
    } else {
        $waError = "HTTP {$waHttpCode}: " . ($curlError ?: $waResponse);
    }
} else {
    // Fallback: file_get_contents
    $waResponse = @file_get_contents($waUrl);
    $waSent     = $waResponse !== false && stripos($waResponse, 'message sent') !== false;
    if (!$waSent) $waError = 'file_get_contents failed or API error';
}

/* ══════════════════════════════════════
   ALSO SEND AUTO-REPLY EMAIL TO VISITOR
══════════════════════════════════════ */
if ($email && $emailSent) {
    $replySubject = "We received your enquiry — AFI Systems";
    $replyHtml = "
    <html><body style='font-family:Arial,sans-serif;color:#333;'>
    <table style='max-width:600px;margin:0 auto;border:1px solid #dde5ef;border-radius:8px;overflow:hidden;'>
      <tr><td style='background:#1a5fa8;padding:24px 28px;'>
        <h2 style='color:#fff;margin:0;font-size:1.3rem;'>Thank you for your enquiry!</h2>
      </td></tr>
      <tr><td style='padding:24px 28px;'>
        <p>Dear <strong>{$name}</strong>,</p>
        <p>We've received your enquiry for <strong>{$category}</strong> and our team will contact you within <strong>24 hours</strong>.</p>
        <p>For faster response, WhatsApp us directly:</p>
        <a href='https://wa.me/919818251017' style='display:inline-block;background:#25D366;color:#fff;padding:10px 22px;border-radius:4px;font-weight:700;text-decoration:none;margin:8px 0;'>
          💬 Chat on WhatsApp
        </a>
        <hr style='border:none;border-top:1px solid #eee;margin:20px 0;'/>
        <p style='font-size:13px;color:#777;'>
          <strong>AFI Systems</strong> — Affordable Furniture Interiors Systems<br>
          📞 +91 98182 51017 &nbsp;|&nbsp; 📧 info@afisystems.in<br>
          📍 Delhi NCR, India &nbsp;|&nbsp; Mon–Sat 10AM–7PM
        </p>
      </td></tr>
    </table>
    </body></html>";

    if (file_exists(__DIR__ . '/vendor/autoload.php')) {
        try {
            $reply = new PHPMailer\PHPMailer\PHPMailer(true);
            $reply->isSMTP();
            $reply->Host = SMTP_HOST; $reply->SMTPAuth = true;
            $reply->Username = SMTP_USER; $reply->Password = SMTP_PASS;
            $reply->SMTPSecure = SMTP_SECURE; $reply->Port = SMTP_PORT;
            $reply->CharSet = 'UTF-8';
            $reply->setFrom(FROM_EMAIL, FROM_NAME);
            $reply->addAddress($email, $name);
            $reply->isHTML(true);
            $reply->Subject = $replySubject;
            $reply->Body    = $replyHtml;
            $reply->send();
        } catch (Exception $e) { /* auto-reply failure is non-critical */ }
    } else {
        $rh = "MIME-Version: 1.0\r\nContent-type: text/html; charset=UTF-8\r\nFrom: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
        @mail($email, $replySubject, $replyHtml, $rh);
    }
}

/* ══════════════════════════════════════
   RESPOND TO AJAX CALLER
══════════════════════════════════════ */
if ($emailSent || $waSent) {
    $parts = [];
    if ($emailSent) $parts[] = 'email sent';
    if ($waSent)    $parts[] = 'WhatsApp notified';
    respond(true, 'Enquiry received! (' . implode(' + ', $parts) . ')');
} else {
    // Log errors (check server error_log)
    error_log("AFI Contact Form ERROR — Email: {$emailError} | WA: {$waError}");
    respond(false, 'Submission failed. Please WhatsApp us directly at +91 98182 51017.');
}
