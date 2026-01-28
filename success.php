<?php
require('config.php');

$pay_id = $_GET['pay_id'];

if($pay_id){
  // এখানে চাইলে Razorpay API দিয়ে verify করবেন
  session_start();
  $_SESSION['paid'] = true;
  header("Location: content.php");
}
?>
