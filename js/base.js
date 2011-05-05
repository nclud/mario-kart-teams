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



// ========================= getStyleProperty by kangax ===============================
// http://perfectionkills.com/feature-testing-css-properties/

var getStyleProperty = (function(){

  var prefixes = ['Moz', 'Webkit', 'Khtml', 'O', 'Ms'];

  function getStyleProperty(propName, element) {
    element = element || document.documentElement;
    var style = element.style,
        prefixed;

    // test standard property first
    if (typeof style[propName] == 'string') return propName;

    // capitalize
    propName = propName.charAt(0).toUpperCase() + propName.slice(1);

    // test vendor specific properties
    for (var i=0, l=prefixes.length; i<l; i++) {
      prefixed = prefixes[i] + propName;
      if (typeof style[prefixed] == 'string') return prefixed;
    }
  }

  return getStyleProperty;
})();

var transformProp = getStyleProperty('transform');

// ========================= miniModernizr ===============================
// <3<3<3 and thanks to Faruk and Paul for doing the heavy lifting

/*!
 * Modernizr v1.6ish: miniModernizr for Isotope
 * http://www.modernizr.com
 *
 * Developed by: 
 * - Faruk Ates  http://farukat.es/
 * - Paul Irish  http://paulirish.com/
 *
 * Copyright (c) 2009-2010
 * Dual-licensed under the BSD or MIT licenses.
 * http://www.modernizr.com/license/
 */


/*
 * This version whittles down the script just to check support for
 * CSS transitions, transforms, and 3D transforms.
*/

var docElement = document.documentElement,
    vendorCSSPrefixes = ' -o- -moz- -ms- -webkit- -khtml- '.split(' '),
    tests = [
      {
        name : 'csstransforms',
        getResult : function() {
          return !!transformProp;
        }
      },
      {
        name : 'csstransforms3d',
        getResult : function() {
          var test = !!getStyleProperty('perspective');
          // double check for Chrome's false positive
          if ( test ){
            var st = document.createElement('style'),
                div = document.createElement('div'),
                mq = '@media (' + vendorCSSPrefixes.join('transform-3d),(') + 'modernizr)';

            st.textContent = mq + '{#modernizr{height:3px}}';
            (document.head || document.getElementsByTagName('head')[0]).appendChild(st);
            div.id = 'modernizr';
            docElement.appendChild(div);

            test = div.offsetHeight === 3;

            st.parentNode.removeChild(st);
            div.parentNode.removeChild(div);
          }
          return !!test;
        }
      },
      {
        name : 'csstransitions',
        getResult : function() {
          return !!getStyleProperty('transitionProperty');
        }
      }
    ],

    i, len = tests.length
;

if ( window.Modernizr ) {
  // if there's a previous Modernzir, check if there are necessary tests
  for ( i=0; i < len; i++ ) {
    var test = tests[i];
    if ( !Modernizr.hasOwnProperty( test.name ) ) {
      // if test hasn't been run, use addTest to run it
      Modernizr.addTest( test.name, test.getResult );
    }
  }
} else {
  // or create new mini Modernizr that just has the 3 tests
  window.Modernizr = (function(){

    var miniModernizr = {
          _version : '1.6ish: miniModernizr for Isotope'
        },
        classes = [],
        test, result, className;

    // Run through tests
    for ( i=0; i < len; i++ ) {
      test = tests[i];
      result = test.getResult();
      miniModernizr[ test.name ] = result;
      className = ( result ?  '' : 'no-' ) + test.name;
      classes.push( className );
    }

    // Add the new classes to the <html> element.
    docElement.className += ' ' + classes.join( ' ' );

    return miniModernizr;
  })();
}


// ======================= Global namespace ===================== //

var MKT = {};

// Event names
MKT.isTouch = !!('createTouch' in document);
MKT.cursorStartEvent = MKT.isTouch ? 'touchstart' : 'mousedown';
MKT.cursorMoveEvent = MKT.isTouch ? 'touchmove' : 'mousemove';
MKT.cursorEndEvent = MKT.isTouch ? 'touchend' : 'mouseup';

// ======================= Global namespace ===================== //

MLT.positionAbs = function()

MKT.position( elem, x, y ) {
	
}

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
	this.dummyElement = document.createElement('div');
	this.dummyElement.id = 'dummy-element';
	this.dummyElement.style.display = 'none';
	this.documentBody.appendChild( this.dummyElement );
	

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
	this.draggingPlayer.addClassName('moving');

	this.dragger.offsetX = cursor.clientX - this.draggingPlayer.offsetLeft;
	this.dragger.offsetY = cursor.clientY - this.draggingPlayer.offsetTop;
	
	this.playerRect = this.draggingPlayer.getBoundingClientRect();
	
	this.dragger.element.innerHTML = this.draggingPlayer.innerHTML;
	this.dragger.element.style.width = this.playerRect.width + 'px';
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
			draggerX = this.dragger.element.offsetLeft + this.playerRect.width / 2,
			draggerY = this.dragger.element.offsetTop + this.playerRect.height / 2,
			hasTarget = false;
	
	for(var i = 0, len = this.players.length; i < len; i++) {
		var player = this.players[i];
		
		// if dragger falls inside droppable target
		if (
			player !== this.draggingPlayer &&
			draggerX > player.offsetLeft + 1 &&
			draggerX < player.offsetLeft + this.playerRect.width - 1 &&
			draggerY > player.offsetTop + 1 &&
			draggerY < player.offsetTop + this.playerRect.height - 1
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
		this.dummyElement.style.width = this.dropTarget.getBoundingClientRect().width + 'px';
		this.dummyElement.style.top = this.dropTarget.offsetTop + 'px';
		this.dummyElement.style.left = this.dropTarget.offsetLeft + 'px';
		this.dummyElement.innerHTML = this.dropTarget.innerHTML;
		this.dummyElement.style.display = 'block';

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
		
		var dragEl = this.dragger.element,
				dropTarget = this.dropTarget,
				draggingPlayer = this.draggingPlayer,
				dummy = this.dummyElement;
		
		this.dropTarget.addClassName('moving');
		
		this.animateTo(this.dragger.element, this.dropTarget, function(){
			dropTarget.removeClassName('moving');
		});
		this.animateTo(this.dummyElement, this.draggingPlayer, function(){
			draggingPlayer.removeClassName('moving');
		});
	} else {
		// animate back to original position
		var dragEl = this.dragger.element,
				draggingPlayer = this.draggingPlayer;
		this.animateTo(this.dragger.element, this.draggingPlayer, function(){
			draggingPlayer.removeClassName('moving');
		});
	}
	
	this.clearDropTarget();
	this.isDragging = false;
	
	// this.draggingPlayer.removeClassName('dragging');
	this.draggingPlayer = null
	
	
	//dragger.element.parentNode.removeChild(dragger.element);
};


MKT.Swapper.prototype.animateTo = function( element, target, callback ) {
	element.addClassName('animating');
	element.style.left = target.offsetLeft + 'px';
	element.style.top = target.offsetTop + 'px';

	var self = this;
	
	var transEnd = function ( event ) {
		if ( callback ) {
			callback();
		}
		// console.log( 'trans ended', event.target );
		event.target.style.display = 'none';
		event.target.removeClassName('animating');
		event.target.removeEventListener( 'webkitTransitionEnd', self, false );
		event.target.removeEventListener( 'oTransitionEnd', self, false );
		event.target.removeEventListener( 'transitionend', self, false );
	}
	
	element.addEventListener( 'webkitTransitionEnd', transEnd, false );
	element.addEventListener( 'oTransitionEnd', transEnd, false );
	element.addEventListener( 'transitionend', transEnd, false );

	// element.style.display = 'none';
};

MKT.Swapper.prototype.handleWebkitTransitionEnd = function(event) {
	this.transitionEnded(event);
};
MKT.Swapper.prototype.handleTransitionend = function(event) {
	this.transitionEnded(event);
};
MKT.Swapper.prototype.handleOTransitionEnd = function(event) {
	this.transitionEnded(event);
};

MKT.Swapper.prototype.transitionEnded = function(event) {
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


