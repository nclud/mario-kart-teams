var raceData;
var dragger;

document.addEventListener('DOMContentLoaded', init, false);

function init() {
	dragger = {};
	
	document.getElementById('new-race-btn').addEventListener('click', addNewRace, false);
	document.getElementById('close-btn').addEventListener('click', closeRaceForm, false);
	
	if(document.body.offsetWidth > 700) {
		var peeps = document.getElementsByTagName('li');
		for(var i = 0; i < peeps.length; i++) {
			peeps[i].addEventListener('mousedown', startDrag, false);
			peeps[i].addEventListener('touchstart', startDrag, false);
		}
	}
}

function addNewRace(e) {
	var cover = document.createElement('div');
	cover.id = 'cover';
	cover.style.backgroundColor = 'rgba(255, 255, 255, .8)';
	cover.style.position = 'fixed';
	cover.style.width = '100%';
	cover.style.height = '100%';
	cover.style.zIndex = '80';
	var bodyElement = document.getElementsByTagName('body')[0];
	bodyElement.appendChild(cover);
	cover.addEventListener('click', closeRaceForm, false);
	
	document.getElementById('race-form-modal').style.display = 'block';
}

function closeRaceForm(e) {
	document.getElementById('cover').parentNode.removeChild(document.getElementById('cover'));

	document.getElementById('race-form-modal').style.display = 'none';
}

function startDrag(e) {
	e.preventDefault();
	if(!dragger.element) {
		dragger = {
			element: document.createElement('div'),
			originElement: e.currentTarget,
			offsetX: e.touches ? e.touches[0].clientX - e.currentTarget.offsetLeft : e.clientX - e.currentTarget.offsetLeft,
			offsetY: e.touches ? e.touches[0].clientY - e.currentTarget.offsetTop : e.clientY - e.currentTarget.offsetTop
		};
		dragger.element.id = 'dragger';
		dragger.element.innerHTML = this.innerHTML;
		dragger.element.style.width = this.getBoundingClientRect().width + 'px';
		dragger.element.style.left = e.currentTarget.offsetLeft + 'px';
		dragger.element.style.top = e.currentTarget.offsetTop + 'px';
		e.currentTarget.id = 'dragging';
		var bodyElement = document.getElementsByTagName('body')[0];
		bodyElement.appendChild(dragger.element);
		document.addEventListener('mousemove', dragRacer, false);
		document.addEventListener('mouseup', stopDrag, false);
		document.addEventListener('touchmove', dragRacer, false);
		document.addEventListener('touchend', stopDrag, false);
	}
}

function endDrag(e) {
	this.style.opacity = 1;
}

function dragRacer(e) {
	if(e.touches) {
		dragger.element.style.left = e.touches[0].clientX - dragger.offsetX + 'px';
		dragger.element.style.top = e.touches[0].clientY - dragger.offsetY + 'px';
	} else {
		dragger.element.style.left = e.clientX - dragger.offsetX + 'px';
		dragger.element.style.top = e.clientY - dragger.offsetY + 'px';
	}
	
	checkDropTarget();
}

function checkDropTarget() {
	clearTargets();
	
	var possibleTargets = [];
	var largestTarget = {
		element: null,
		area: 0
	};
	
	var peeps = document.getElementsByTagName('li');
	for(var i = 0; i < peeps.length; i++) {
		var itemDistanceX = dragger.element.offsetLeft - peeps[i].offsetLeft + dragger.element.getBoundingClientRect().width;
		var itemDistanceY = dragger.element.offsetTop - peeps[i].offsetTop + dragger.element.getBoundingClientRect().height;
		
		if(itemDistanceX > 0 && itemDistanceX <= peeps[i].getBoundingClientRect().width * 2) {
			if(itemDistanceY > 0 && itemDistanceY <= peeps[i].getBoundingClientRect().height * 2) {
				possibleTargets.push(peeps[i]);
			}			
		}
	}
	
	for(var j = 0; j < possibleTargets.length; j++) {
		var overlapX = possibleTargets[j].getBoundingClientRect().width - Math.abs(possibleTargets[j].offsetLeft - dragger.element.offsetLeft);
		var overlapY = possibleTargets[j].getBoundingClientRect().height - Math.abs(possibleTargets[j].offsetTop - dragger.element.offsetTop);
		var overlapArea = overlapX * overlapY;
		if(overlapArea > largestTarget.area) {
			largestTarget = {
				element: possibleTargets[j],
				area: overlapArea
			};
		}
	}
	if(largestTarget.element && largestTarget.element.id != 'dragging') {
		largestTarget.element.id = 'drag-target';
	}
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
		//request.onreadystatechange = processReturn;
		request.send(null);
		
		function processReturn() {
			if(request.readyState == 4 && request.status == 200) {
				//console.log(request.responseText);
			}
		}
		
		animateTo(dragger.element, document.getElementById('drag-target'), function() {
			document.getElementById('dragging').id = '';
			document.getElementsByClassName('animating')[0].className = '';
			dragger.element.parentNode.removeChild(dragger.element);
			dragger.element = null;
		});
		
		animateTo(dummyElement, dragger.originElement, function() {
			dummyElement.parentNode.removeChild(dummyElement);
		});
	} else {
		animateTo(dragger.element, dragger.originElement, function() {
			document.getElementById('dragging').id = '';
			dragger.element.parentNode.removeChild(dragger.element);
			dragger.element = null;
		});
	}
	
	clearTargets();
}


function animateTo(element, target, callback) {
	var animation = setInterval(function() {
		var distanceX = target.offsetLeft - element.offsetLeft;
		var distanceY = target.offsetTop - element.offsetTop;
		var percent = .5;
		var targetX;
		var targetY;
		
		if(Math.abs(distanceX) > 1 || Math.abs(distanceY) > 1) {
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