<?php
session_start();
if(!isset($_SESSION['paid'])){
  header("Location: index.html");
  exit;
}
?>

<h2>Salary Statement Page</h2>
<p>✔ Paid user access granted</p>
