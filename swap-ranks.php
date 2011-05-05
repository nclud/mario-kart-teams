<?php

$racer1 = $_GET['racer1'];
$racer2 = $_GET['racer2'];


$myFile = 'racedata.txt';
$fh = fopen($myFile, 'r+') or die("Can't open file");
$theData = fread($fh, filesize($myFile));
$ranks = explode(",", $theData);
fclose($fh);

$racer1Index = array_search($racer1, $ranks);
$racer2Index = array_search($racer2, $ranks);

$ranks[$racer1Index] = $racer2;
$ranks[$racer2Index] = $racer1;

$newRanks = implode(',', $ranks);
$fh = fopen($myFile, 'w') or die("Can't open file");
fwrite($fh, $newRanks);
fclose($fh);

echo $newRanks;

?>