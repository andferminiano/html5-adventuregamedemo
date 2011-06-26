// Anderson Ferminiano
// 25th June 2011
// contato@andersonferminiano.com -- feel free to contact me for help :)
// www.andersonferminiano.com



var initId = 0;
var player = function(){
	this.object = null;
	this.canJump = false;
};
var world = createWorld();
var ctx;
var canvasWidth;
var canvasHeight;
var canvasTop;
var canvasLeft;
var keys = [];


function step() {
	
	if (player.object.GetCenterPosition().y > canvasHeight){
		player.object.SetCenterPosition(new b2Vec2(20,0),0)
	}	
	else if (player.object.GetCenterPosition().x > canvasWidth-50){
		showWin();
		return;	
	}
	
	
	
	handleInteractions();
	
	var stepping = false;
	var timeStep = 1.0/60;
	var iteration = 1;
	world.Step(timeStep, iteration);
	ctx.clearRect(0, 0, canvasWidth, canvasHeight);
	drawWorld(world, ctx);
	setTimeout('step()', 10);
}

function showWin(){
	ctx.fillStyle    = '#000';
	ctx.font         = '30px verdana';
	ctx.textBaseline = 'top';
	ctx.fillText('Ye! you made it!', 30, 0);
	ctx.fillText('thank you, andersonferminiano.com', 30, 30);
	ctx.fillText('@andferminiano', 30, 60);	
}

function handleInteractions(){
	// up arrow
	
	var collision = world.m_contactList;
	player.canJump = false;
	if (collision != null){
		if (collision.GetShape1().GetUserData() == 'player' || collision.GetShape2().GetUserData() == 'player'){
			if ((collision.GetShape1().GetUserData() == 'ground' || collision.GetShape2().GetUserData() == 'ground')){
				var playerObj = (collision.GetShape1().GetUserData() == 'player' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				var groundObj = (collision.GetShape1().GetUserData() == 'ground' ? collision.GetShape1().GetPosition() :  collision.GetShape2().GetPosition());
				if (playerObj.y < groundObj.y){
					player.canJump = true;
				}
			}
		}
	}
	
	var vel = player.object.GetLinearVelocity();
	if (keys[38] && player.canJump){
		vel.y = -150;	
	}
	
	// left/right arrows
	if (keys[37]){
		vel.x = -60;
	}
	else if (keys[39]){
		vel.x = 60;
	}
	
	
	player.object.SetLinearVelocity(vel);
}


function initGame(){
	
	// create 2 big platforms	
	createBox(world, 3, 230, 60, 180, true, 'ground');
	createBox(world, 560, 360, 50, 50, true, 'ground');
	
	// create small platforms
	for (var i = 0; i < 5; i++){
		createBox(world, 150+(80*i), 360, 5, 40+(i*15), true, 'ground');	
	}
	
	// create player ball
	var ballSd = new b2CircleDef();
	ballSd.density = 0.1;
	ballSd.radius = 12;
	ballSd.restitution = 0.5;
	ballSd.friction = 1;
	ballSd.userData = 'player';
	var ballBd = new b2BodyDef();
	ballBd.linearDamping = .03;
	ballBd.allowSleep = false;
	ballBd.AddShape(ballSd);
	ballBd.position.Set(20,0);
	player.object = world.CreateBody(ballBd);
	
}

function handleKeyDown(evt){
	keys[evt.keyCode] = true;
}


function handleKeyUp(evt){
	keys[evt.keyCode] = false;
}

Event.observe(window, 'load', function() {
	world = createWorld();
	ctx = $('game').getContext('2d');
	var canvasElm = $('game');
	canvasWidth = parseInt(canvasElm.width);
	canvasHeight = parseInt(canvasElm.height);
	canvasTop = parseInt(canvasElm.style.top);
	canvasLeft = parseInt(canvasElm.style.left);
	initGame();
	step();
	
	window.addEventListener('keydown',handleKeyDown,true);
	window.addEventListener('keyup',handleKeyUp,true);
});


// disable vertical scrolling from arrows :)
document.onkeydown=function(){return event.keyCode!=38 && event.keyCode!=40}



