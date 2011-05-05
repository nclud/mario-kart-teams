// ======================= DOM Utility Functions from PastryKit =============================== //

// Sure, we could use jQuery or XUI for these, 
// but these are concise and will work with plain vanilla JS

Element.prototype.hasClassName = function (a) {
	return new RegExp("(?:^|\\s+)" + a + "(?:\\s+|$)").test(this.className);
};

Element.prototype.addClassName = function (a) {
	if (!this.hasClassName(a)) {
		this.className = [this.className, a].join(" ");
	}
};

Element.prototype.removeClassName = function (b) {
	if (this.hasClassName(b)) {
		var a = this.className;
		this.className = a.replace(new RegExp("(?:^|\\s+)" + b + "(?:\\s+|$)", "g"), " ");
	}
};

Element.prototype.toggleClassName = function (a) {
	this[this.hasClassName(a) ? "removeClassName" : "addClassName"](a);
};

// ======================= Global namespace ===================== //

var MKT = {};

// Event names
MKT.isTouch = !!('createTouch' in document);
MKT.cursorStartEvent = MKT.isTouch ? 'touchstart' : 'mousedown';
MKT.cursorMoveEvent = MKT.isTouch ? 'touchmove' : 'mousemove';
MKT.cursorEndEvent = MKT.isTouch ? 'touchend' : 'mouseup';

// ======================= EventHandler ======================= //

MKT.EventHandler = function() {};

MKT.EventHandler.prototype.handleEvent = function( event ) {
	 var handlerName = 'handle' + event.type.charAt(0).toUpperCase() + event.type.substr(1);
	 if ( this[ handlerName ] ) {
		this[ handlerName ](event);
	}
};

// ======================= Swapper ======================= //

MKT.Swapper = function ( players ) {

	this.players = players;
	this.isDragging = false;

	this.dragger = {
		element : document.createElement('div')
	};
	this.dragger.element.id = 'dragger';
	document.body.appendChild( this.dragger.element );
	

	// add listeners for movement
	for (var i=0, len = this.players.length; i < len; i++) {
		players[i].addEventListener( MKT.cursorStartEvent, this, false);
	}

};

// pass in event handler
MKT.Swapper.prototype = new MKT.EventHandler();

MKT.Swapper.prototype.handleMousedown = function(event) {
	this.startDrag(event);
};

MKT.Swapper.prototype.handleTouchstart = function(event) {
	this.startDrag(event);
};

MKT.Swapper.prototype.startDrag = function(event) {
	// don't proceed if already dragging
	if ( this.isDragging ) {
		// return;
	}
	console.log( 'start dragging' );
	
	event.preventDefault();
	var cursor = MKT.isTouch ? event.touches[0] : event;
	
	this.dragger.originElement = event.currentTarget;
	this.dragger.offsetX = cursor.clientX - event.currentTarget.offsetLeft;
	this.dragger.offsetY = cursor.clientY - event.currentTarget.offsetTop;
	
	this.dragger.element.innerHTML = event.target.innerHTML;
	this.dragger.element.style.width = event.target.getBoundingClientRect().width + 'px';
	this.dragger.element.style.left = event.currentTarget.offsetLeft + 'px';
	this.dragger.element.style.top = event.currentTarget.offsetTop + 'px';

	event.currentTarget.id = 'dragging';

	document.addEventListener( MKT.cursorMoveEvent, this, false);
	document.addEventListener( MKT.cursorEndEvent, this, false);
	
	this.isDragging = true;
	
};

MKT.Swapper.prototype.handleMousemove = function(event) {
	this.dragRacer(event);
};

MKT.Swapper.prototype.handleMousemove = function(event) {
	this.dragRacer(event);
};

MKT.Swapper.prototype.dragRacer = function(event) {
	
	// position dragger
	var cursor = MKT.isTouch ? event.touches[0] : event;
	this.dragger.element.style.left = cursor.clientX - this.dragger.offsetX + 'px';
	this.dragger.element.style.top = cursor.clientY - this.dragger.offsetY + 'px';

	this.checkDropTarget();
};


MKT.Swapper.prototype.checkDropTarget = function() {
	// clearTargets();
	
	var possibleTargets = [];
	var largestTarget = {
		element: null,
		area: 0
	};

	var dragEl = this.dragger.element,
			draggerRect = dragEl.getBoundingClientRect();
	
	for(var i = 0, len = this.players.length; i < len; i++) {
		var player = this.players[i];
		var itemDistanceX = dragEl.offsetLeft - player.offsetLeft + draggerRect.width;
		var itemDistanceY = dragEl.offsetTop - player.offsetTop + draggerRect.height;
		var playerRect = player.getBoundingClientRect();
		
		if(itemDistanceX > 0 && itemDistanceX <= playerRect.width * 2) {
			if(itemDistanceY > 0 && itemDistanceY <= playerRect.height * 2) {
				possibleTargets.push(player);
			}			
		}
	}
	
	for(var j = 0; j < possibleTargets.length; j++) {
		var target = possibleTargets[j];
		var targetRect = possibleTargets[j].getBoundingClientRect();
		var overlapX = targetRect.width - Math.abs(target.offsetLeft - this.dragger.element.offsetLeft);
		var overlapY = targetRect.height - Math.abs(target.offsetTop - this.dragger.element.offsetTop);
		var overlapArea = overlapX * overlapY;
		if(overlapArea > largestTarget.area) {
			largestTarget = {
				element: target,
				area: overlapArea
			};
		}
	}
	if(largestTarget.element && largestTarget.element.id != 'dragging') {
		largestTarget.element.id = 'drag-target';
	}
}


// =======================  ======================= //

var raceData;
var dragger;

document.addEventListener('DOMContentLoaded', init, false);

 

function init() {
	dragger = {};
	
	var players = document.getElementsByTagName('li');
	
	var swapper = new MKT.Swapper( players );
	
  document.getElementById('new-race-btn').addEventListener('click', addNewRace, false);
  document.getElementById('close-btn').addEventListener('click', closeRaceForm, false);

}

function addNewRace(e) {
	document.getElementById('race-form-modal').style.display = 'block';
}

function closeRaceForm(e) {
	document.getElementById('race-form-modal').style.display = 'none';
}

function endDrag(e) {
	this.style.opacity = 1;
}



function clearTargets() {
	if(document.getElementById('drag-target')) {
		document.getElementById('drag-target').id = '';
	}
	var peeps = document.getElementsByTagName('li');
	for(var i = 0; i < peeps.length; i++) {
		if(peeps[i].id != 'dragging') {
			peeps[i].style.opacity = 1;
		}
	}
}

function stopDrag(e) {
	document.removeEventListener('mousemove', dragRacer);
	document.removeEventListener('mouseup', stopDrag);
	if(document.getElementById('drag-target')) {
		var dummyElement = document.createElement('div');
		dummyElement.id = 'dummy-element';
		dummyElement.style.width = document.getElementById('drag-target').getBoundingClientRect().width + 'px';
		dummyElement.style.top = document.getElementById('drag-target').offsetTop + 'px';
		dummyElement.style.left = document.getElementById('drag-target').offsetLeft + 'px';
		dummyElement.innerHTML = document.getElementById('drag-target').innerHTML;
		var bodyElement = document.getElementsByTagName('body')[0];
		bodyElement.appendChild(dummyElement);
		
		document.getElementById('drag-target').className += 'animating';
		
		var targetContent = document.getElementById('drag-target').innerHTML;
		var sourceContent = dragger.originElement.innerHTML;
		dragger.originElement.innerHTML = targetContent;
		document.getElementById('drag-target').innerHTML = sourceContent;
		
		var request = new XMLHttpRequest();
		request.open('GET', 'swap-ranks.php?racer1=' + document.getElementById('drag-target').getElementsByTagName('div')[1].innerHTML + '&racer2=' +  dragger.originElement.getElementsByTagName('div')[1].innerHTML, true);
		request.onreadystatechange = processCoords;
		request.send(null);
		
		function processCoords() {
			if(request.readyState == 4 && request.status == 200) {
				//console.log(request.responseText);
			}
		}
		
		animateTo(dragger.element, document.getElementById('drag-target'), function() {
			document.getElementById('dragging').id = '';
			document.getElementsByClassName('animating')[0].className = '';
			dragger.element.parentNode.removeChild(dragger.element);
		});
		
		animateTo(dummyElement, dragger.originElement, function() {
			dummyElement.parentNode.removeChild(dummyElement);
		});
	} else {
		animateTo(dragger.element, dragger.originElement, function() {
			document.getElementById('dragging').id = '';
			dragger.element.parentNode.removeChild(dragger.element);
		});
	}
	
	clearTargets();
	
	
	//dragger.element.parentNode.removeChild(dragger.element);
}


function animateTo(element, target, callback) {
	//console.log(element.offsetLeft);
	//console.log(target.offsetLeft);
	var animation = setInterval(function() {
		var distanceX = target.offsetLeft - element.offsetLeft;
		var distanceY = target.offsetTop - element.offsetTop;
		var percent = .5;
		var targetX;
		var targetY;
		
		if(Math.abs(distanceX) > 1 || Math.abs(distanceY) > 1) {
			//console.log('animate');
			targetX = element.offsetLeft + (distanceX * percent);
			targetY = element.offsetTop + (distanceY * percent);
		} else {
			targetX = target.offsetLeft;
			clearInterval(animation);
			callback();
		}
		
		element.style.left = targetX + 'px';
		element.style.top = targetY + 'px';
	}, 50);
	
	
}


/*

var request = new XMLHttpRequest();
request.open("GET", "services/pixelate-image.php?src=" + src + "&diameter=" + (2 * radius) + "&padding=" + padding, true);
request.onreadystatechange = processCoords;
request.send(null);

function processCoords() {
	if(request.readyState == 4 && request.status == 200) {
		dynamicCoords = JSON.parse(request.responseText);
		coordsReady = true;
		draw();
	}
}

*/