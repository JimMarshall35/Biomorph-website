<?php
echo "hello";
require('../connect.php');
$genome =  $_GET['genome'];
$name = $_GET['name'];
$creator = $_GET['creator'];
$datetime = $_GET['datetime'];
echo $genome;
echo $name;
echo $creator;
echo $datetime;
$sql = "INSERT INTO savedmorphs (Genome, Name, Creator, DateTimeCreated)
		VALUES ('$genome', '$name', '$creator', '$datetime');";
if ($mysqli->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $mysqli->error;
}
?>