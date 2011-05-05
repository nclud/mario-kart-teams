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
	
	this.documentBody = document.getElementsByTagName('body')[0];

	// create dragger proxy element
	this.dragger = {
		element : document.createElement('div')
	};
	this.dragger.element.id = 'dragger';
	this.dragger.element.style.display = 'none';
	this.documentBody.appendChild( this.dragger.element );
	
	// create dummy proxy element, for player moved out
	

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
		return;
	}
	console.log( 'start dragging' );
	
	
	this.dragger.element.style.display = 'block';
	
	event.preventDefault();
	var cursor = MKT.isTouch ? event.touches[0] : event;

	this.draggingPlayer = event.currentTarget;
	this.draggingPlayer.addClassName('dragging');

	this.dragger.offsetX = cursor.clientX - this.draggingPlayer.offsetLeft;
	this.dragger.offsetY = cursor.clientY - this.draggingPlayer.offsetTop;
	
	this.dragger.element.innerHTML = this.draggingPlayer.innerHTML;
	this.dragger.element.style.width = this.draggingPlayer.getBoundingClientRect().width + 'px';
	this.dragger.element.style.left = this.draggingPlayer.offsetLeft + 'px';
	this.dragger.element.style.top = this.draggingPlayer.offsetTop + 'px';


	document.addEventListener( MKT.cursorMoveEvent, this, false);
	document.addEventListener( MKT.cursorEndEvent, this, false);
	
	this.isDragging = true;
	
};

MKT.Swapper.prototype.handleMousemove = function(event) {
	this.dragRacer(event);
};

MKT.Swapper.prototype.handleTouchmove = function(event) {
	this.dragRacer(event);
};

MKT.Swapper.prototype.dragRacer = function(event) {
	
	// position dragger
	var cursor = MKT.isTouch ? event.touches[0] : event;
	this.dragger.element.style.left = cursor.clientX - this.dragger.offsetX + 'px';
	this.dragger.element.style.top = cursor.clientY - this.dragger.offsetY + 'px';

	// check drop tragets
	var dragEl = this.dragger.element,
			draggerRect = dragEl.getBoundingClientRect(),
			draggerX = this.dragger.element.offsetLeft + draggerRect.width / 2,
			draggerY = this.dragger.element.offsetTop + draggerRect.height / 2,
			hasTarget = false;
	
	for(var i = 0, len = this.players.length; i < len; i++) {
		var player = this.players[i];
		
		// if dragger falls inside droppable target
		if (
			player !== this.draggingPlayer &&
			draggerX > player.offsetLeft + 1 &&
			draggerX < player.offsetLeft + draggerRect.width - 1 &&
			draggerY > player.offsetTop + 1 &&
			draggerY < player.offsetTop + draggerRect.height - 1
		) {
			// remove previous droptarget
			this.clearDropTarget();
			this.dropTarget = player;
			player.addClassName('drag-target');
			hasTarget = true;
			break;
		}
	}
	
	// if no target was hovered over, remove it
	if ( !hasTarget ) {
		this.clearDropTarget();
	}
	
};

MKT.Swapper.prototype.clearDropTarget = function() {
	if ( this.dropTarget ) {
		this.dropTarget.removeClassName('drag-target')
		this.dropTarget = null;
	}
};

MKT.Swapper.prototype.handleMouseup = function(event) {
	this.stopDrag(event);
};

MKT.Swapper.prototype.handleTouchend = function(event) {
	this.stopDrag(event);
};


MKT.Swapper.prototype.stopDrag = function(e) {
	console.log( 'stopping drag' );

	document.removeEventListener( MKT.cursorMoveEvent, this, false);
	document.removeEventListener( MKT.cursorEndEvent, this, false);


	if ( this.dropTarget ) {
		var dummyElement = document.createElement('div');
		dummyElement.id = 'dummy-element';
		dummyElement.style.width = this.dropTarget.getBoundingClientRect().width + 'px';
		dummyElement.style.top = this.dropTarget.offsetTop + 'px';
		dummyElement.style.left = this.dropTarget.offsetLeft + 'px';
		dummyElement.innerHTML = this.dropTarget.innerHTML;

		this.documentBody.appendChild(dummyElement);
		
		this.dropTarget.addClassName('animating');
		
		var targetContent = this.dropTarget.innerHTML;
		var sourceContent = this.draggingPlayer.innerHTML;
		this.draggingPlayer.innerHTML = targetContent;
		this.dropTarget.innerHTML = sourceContent;
		
		var request = new XMLHttpRequest();
		request.open('GET', 'swap-ranks.php?racer1=' + this.dropTarget.getElementsByTagName('div')[1].innerHTML + '&racer2=' +  this.draggingPlayer.getElementsByTagName('div')[1].innerHTML, true);
		request.onreadystatechange = processCoords;
		request.send(null);
		
		function processCoords() {
			if(request.readyState == 4 && request.status == 200) {
				//console.log(request.responseText);
			}
		}
		
		this.animateTo(this.dragger.element, this.dropTarget);
		this.animateTo(dummyElement, this.draggingPlayer);
	} else {
		// animate back to original position???
		this.animateTo(this.dragger.element, this.draggingPlayer);
	}
	
	this.clearDropTarget();
	this.isDragging = false;
	
	this.draggingPlayer.removeClassName('dragging');
	this.draggingPlayer = null
	
	
	//dragger.element.parentNode.removeChild(dragger.element);
};


MKT.Swapper.prototype.animateTo = function( element, target ) {
	element.style.left = target.offsetLeft + 'px';
	element.style.top = target.offsetTop + 'px';
};


// =======================  ======================= //

var raceData;

document.addEventListener('DOMContentLoaded', init, false);

 

function init() {
	
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


