<?php
/*
* Change the value of $password if you have set a password on the root userid
* Change NULL to port number to use DBMS other than the default using port 3306
*
*/

require('../connect.php');

if(isset($_GET['genome'])){
	$genome =  $_GET['genome'];
}

$sql = "SELECT * FROM savedmorphs WHERE Genome = '$genome'";
$result = mysqli_query($mysqli,$sql) or die("bad query: $sql");

$num_rows = mysqli_num_rows($result);
if($num_rows >0){
	while($row = mysqli_fetch_assoc($result)){
		echo '<h1 class="heading">';
		echo $row['Name']. " discovered by " . $row['Creator'];
		echo '</h1>';
	}
}
else{
	echo '<h1 class="heading">';
	echo 'unnamed biomorph';
	echo '</h1>';
}



$mysqli->close();
?>