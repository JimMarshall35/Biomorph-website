<?php

require('../connect.php');
$sql = "SELECT * FROM savedmorphs ORDER BY id DESC LIMIT 20";
$result = mysqli_query($mysqli,$sql) or die("bad query: $sql");
$num_rows = mysqli_num_rows($result);
$counter = 0;
echo '{ "topten": [';
while($row = mysqli_fetch_assoc($result)){
	echo "{";
	echo '"name":';
	echo '"'.$row['Name']. '",';
	echo '"creator":';
	echo '"'.$row['Creator']. '",';
	echo '"date":';
	echo '"'.$row['DateTimeCreated']. '",';
	echo '"genome":';
	echo $row['Genome'];
	echo "}";
	if($counter < $num_rows-1){
		echo ",";
	}
	$counter++;
}
echo "]}";

?>