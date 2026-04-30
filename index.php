<?php
$file = 'comments.txt';

// যদি কেউ কমেন্ট পোস্ট করে
if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_POST['submit'])) {
    $name = htmlspecialchars($_POST['name']);
    $comment = htmlspecialchars($_POST['comment']);
    $date = date('d M Y, h:i a');

    // কমেন্টের ফরম্যাট (নাম|মন্তব্য|তারিখ)
    $data = $name . "|" . $comment . "|" . $date . "\n";

    // ফাইলের শুরুতে নতুন কমেন্ট সেভ করা
    $old_content = file_get_contents($file);
    file_put_contents($file, $data . $old_content);
}

// ফাইল থেকে সব কমেন্ট পড়া
$all_comments = file($file);
?>

<!DOCTYPE html>
<html lang="bn">
<head>
    <meta charset="UTF-8">
    <title>AI Online - কমেন্ট সিস্টেম</title>
    <style>
        body { font-family: Arial, sans-serif; background: #f0f2f5; padding: 20px; }
        .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        input, textarea { width: 100%; padding: 10px; margin: 10px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer; }
        .comment-box { border-bottom: 1px solid #eee; padding: 15px 0; }
        .comment-box:last-child { border-bottom: none; }
        .user-name { font-weight: bold; color: #333; }
        .date { font-size: 11px; color: #888; }
    </style>
</head>
<body>

<div class="container">
    <h2>মন্তব্য করুন</h2>
    <form method="post">
        <input type="text" name="name" placeholder="আপনার নাম" required>
        <textarea name="comment" placeholder="আপনার মন্তব্য লিখুন..." required></textarea>
        <button type="submit" name="submit">পোস্ট করুন</button>
    </form>

    <hr>

    <h3>সাম্প্রতিক মন্তব্যসমূহ</h3>
    <div class="comment-list">
        <?php
        if (!empty($all_comments)) {
            foreach ($all_comments as $line) {
                // ফাইল থেকে ডেটা আলাদা করা
                $parts = explode('|', $line);
                if (count($parts) == 3) {
                    echo "<div class='comment-box'>";
                    echo "<div class='user-name'>" . $parts[0] . "</div>";
                    echo "<div class='date'>" . $parts[2] . "</div>";
                    echo "<p>" . $parts[1] . "</p>";
                    echo "</div>";
                }
            }
        } else {
            echo "এখনো কোনো মন্তব্য নেই।";
        }
        ?>
    </div>
</div>

</body>
</html>
