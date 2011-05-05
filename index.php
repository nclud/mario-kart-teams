<?php

$myFile = 'racedata.txt';
$fh = fopen($myFile, 'r+') or die("Can't open file");
$theData = fread($fh, filesize($myFile));
$ranks = explode(",", $theData);
fclose($fh);

$racers = array($_GET['position-1'], $_GET['position-2'], $_GET['position-3'], $_GET['position-4']);
setRanks($racers);
updatePositions();

function setRanks($list) {
	global $racers, $ranks;
	for($i = 0; $i < count($list); $i++) {
		if($list[$i]) {
			$rank = array_search($list[$i], $ranks);
			$racers[$i] = array('name' => $list[$i], 'team' => getTeam($rank));
		} else {
			array_pop($racers);
		}
	}
}

function getTeam($position) {
	$rank;
	if($position < 3) {
		$rank = 0;
	} else if($position < 6) {
		$rank = 1;
	} else {
		$rank = 2;
	}
	return $rank;
}

function updatePositions() {
	global $racers, $ranks;
	for($i = 0; $i < count($racers) - 1; $i++) {		
		$highestRank = $racers[$i]['team'];
		$highestRankIndex;
		for($j = $i + 1; $j < count($racers); $j++) {
			if($highestRank > $racers[$j]['team']) {
				$highestRank = $racers[$j]['team'];
				$highestRankIndex = $j;
			}			
		}
		if($racers[$i]['team'] > $highestRank) {			
			$originalTeam = $racers[$i]['team'];
			$racers[$i]['team'] = $racers[$highestRankIndex]['team'];
			$racers[$highestRankIndex]['team'] = $originalTeam;
			
			$winnerPosition = array_search($racers[$i]['name'], $ranks);
			$loserPosition = array_search($racers[$highestRankIndex]['name'], $ranks);
			
			$ranks[$loserPosition] = $racers[$i]['name'];
			$ranks[$winnerPosition] = $racers[$highestRankIndex]['name'];
		}
	}
}

$newRanks = implode(',', $ranks);
$fh = fopen($myFile, 'w') or die("Can't open file");
fwrite($fh, $newRanks);
fclose($fh);

if($_GET['position-1']) {
	$url = 'index.php';
	header('location:' . $url);
}

?>





<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
<title></title>
<link type="text/css" rel="stylesheet" href="styles/reset.css" />
<link type="text/css" rel="stylesheet" href="styles/base.css" />
<script type="text/javascript" src="js/base.js"></script>
</head>
<body>

<div id="race-form-modal">
	<div id="close"><a href="#" id="close-btn">close</a></div>
	<form id="race-form" action="index.php">
		<p>
			<label for="position-1">1</label>
			<select id="position-1" name="position-1">
				<option value="" selected="selected">Select Racer</option>
				<option value="Alex">Alex</option>
				<option value="Brandon">Brandon</option>
				<option value="Brian">Brian</option>
				<option value="Dave">Dave</option>
				<option value="John">John</option>
				<option value="Lauren">Lauren</option>
				<option value="Martin">Martin</option>
				<option value="Tom">Tom</option>
				<option value="Wes">Wes</option>
			</select>
		</p>
		<p>
			<label for="position-2">2</label>
			<select id="position-2" name="position-2">
				<option value="" selected="selected">Select Racer</option>
				<option value="Alex">Alex</option>
				<option value="Brandon">Brandon</option>
				<option value="Brian">Brian</option>
				<option value="Dave">Dave</option>
				<option value="John">John</option>
				<option value="Lauren">Lauren</option>
				<option value="Martin">Martin</option>
				<option value="Tom">Tom</option>
				<option value="Wes">Wes</option>
			</select>
		</p>
		<p>
			<label for="position-3">3</label>
			<select id="position-3" name="position-3">
				<option value="" selected="selected">Select Racer</option>
				<option value="Alex">Alex</option>
				<option value="Brandon">Brandon</option>
				<option value="Brian">Brian</option>
				<option value="Dave">Dave</option>
				<option value="John">John</option>
				<option value="Lauren">Lauren</option>
				<option value="Martin">Martin</option>
				<option value="Tom">Tom</option>
				<option value="Wes">Wes</option>
			</select>
		</p>
		<p>
			<label for="position-4">4</label>
			<select id="position-4" name="position-4">
				<option value="" selected="selected">Select Racer</option>
				<option value="Alex">Alex</option>
				<option value="Brandon">Brandon</option>
				<option value="Brian">Brian</option>
				<option value="Dave">Dave</option>
				<option value="John">John</option>
				<option value="Lauren">Lauren</option>
				<option value="Martin">Martin</option>
				<option value="Tom">Tom</option>
				<option value="Wes">Wes</option>
			</select>
		</p>
		<p>
			<input type="submit" value="Update" />
		</p>
	</form>
</div>

<div id="controls">
	<input id="new-race-btn" type="button" value="New Race" />
</div>

<div id="columns">
	<div id="a-team" class="column">
		<h1>A</h1>
		<ul>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[0]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[0]; ?></div>
			</li>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[1]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[1]; ?></div>
			</li>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[2]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[2]; ?></div>
			</li>
		</ul>
	</div>
	<div id="b-team" class="column">
		<h1>B</h1>
		<ul>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[3]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[3]; ?></div>
			</li>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[4]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[4]; ?></div>
			</li>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[5]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[5]; ?></div>
			</li>
		</ul>
	</div>
	<div id="c-team" class="column">
		<h1>C</h1>
		<ul>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[6]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[6]; ?></div>
			</li>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[7]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[7]; ?></div>
			</li>
			<li>
				<div class="thumbnail"><img src="images/<?php echo $ranks[8]; ?>.jpg" /></div>
				<div class="player-details"><?php echo $ranks[8]; ?></div>
			</li>
		</ul>
	</div>
</div>

</body>
</html>