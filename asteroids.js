/*--
  Constructor for an object in asteroids
  --*/

var AsteroidsObject = function(){
    this.xcor = this.ycor = 0;
    this.xvel = this.yvel = 0;
    this.radius = 0;
    this.health = 0;
    this.getX = function(){
    }
    this.draw = function(){
	ctx.beginPath();
	ctx.arc(this.xcor, this.ycor, this.radius, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
    };
    this.checkObjectCollision = function(other){
	var minDist = this.radius + other.radius;
	if (minDist >= Math.sqrt(Math.pow(this.xcor - other.xcor,2) + Math.pow(this.ycor - other.ycor,2))){
	    this.xvel = -1 * this.xvel;
	    this.yvel = -1 * this.yvel;
	    return true;
	}
	return false;
    };
    this.update = function(){
	if (this.xcor + this.radius >= canvas.width || this.xcor - this.radius <= 0){
	    this.xvel = -1 * this.xvel;
	}
	if(this.ycor + this.radius >= canvas.height || this.ycor <= 0){
	    this.yvel = -1 * this.yvel;
	}
	this.xcor+=this.xvel;
	this.ycor+=this.yvel;
	this.draw();
    };
};

var Bullets = function(){
    AsteroidsObject.call(this);
    this.radius = 2;
    this.draw = function(){
	ctx.beginPath();
	ctx.arc(this.xcor, this.ycor, this.radius, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
    }
    this.updateBullet = function(asteroids){
    	for (i = 0; i < asteroids.length; i++){
    	    if (this.checkObjectCollision(asteroids[i])){
    		asteroids[i] = new Asteroids();
    		return true;
    	    }
    	}
    	this.update();
    }
};
Bullets.prototype = Object.create(AsteroidsObject.prototype);

var Asteroids = function(){
    AsteroidsObject.call(this);//call super first
    this.radius = 15;
    if (Math.random() < 0.5){
	this.xcor = 1 + this.radius;
	this.ycor = 1 + Math.random() * (canvas.height - 1);
    }
    else{
	this.xcor = 1 + Math.random() * (canvas.width - 1);
	this.ycor = 0 + this.radius;
    }
    this.xvel = Math.random() * 4;
    this.yvel = Math.random() * 4;
    this.draw = function(){
	ctx.beginPath();
	ctx.arc(this.xcor, this.ycor, this.radius, 0, 2*Math.PI);
	ctx.stroke();
	ctx.closePath();
    };
}
Asteroids.prototype = Object.create(AsteroidsObject.prototype);

var Player = function(){
    AsteroidsObject.call(this); //calls the AsteroidsObject function first to initialize the variables
    this.angle = this.accel = 0;
    this.xcor = canvas.width/2;
    this.ycor = canvas.height/2;
    this.health = 5;
    this.radius = 10; //change this later
    this.cooldown = 0;
    this.draw = function(){
    	if (this.health > 0){
	ctx.beginPath();
	ctx.moveTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*3/4),this.ycor+10*Math.sin(this.angle+Math.PI*3/4));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*5/4),this.ycor+10*Math.sin(this.angle+Math.PI*5/4));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
	ctx.stroke();
	ctx.closePath();
    }
    };
    this.updateUser = function(asteroids){
	if (this.accel > 0){
	    var newx = this.xvel + this.accel*Math.cos(this.angle);
	    var newy = this.yvel + this.accel*Math.sin(this.angle);
	    var newvel = Math.pow(Math.pow(newx,2) + Math.pow(newy,2),0.5);
	    if (newvel > -4 && newvel < 4){ //stay below maximum velocity
		this.xvel = newx;
		this.yvel = newy;
	    }
	}
	else{ //natural deceleration
	    if (this.xvel > 0){
		this.xvel-=0.01;
	    }
	    if (this.xvel < 0){
		this.xvel+=0.01;
	    }
	    if (this.yvel > 0){
		this.yvel-=0.01;
	    }
	    if (this.yvel < 0){
		this.yvel+=0.01;
	    }
	}
	if (leftPress){
	    this.angle = (this.angle-0.05)%(2*Math.PI);
	}
	if (rightPress){
	    this.angle = (this.angle+0.05)%(2*Math.PI);
	}
	for (i = 0; i < asteroids.length; i++){
		if (this.checkObjectCollision(asteroids[i])){
			this.health -=1;
			asteroids[i] = new Asteroids();
		}
	}
	this.cooldown -=1;
	this.update();
    }
    this.shoot = function(){
    	if (this.cooldown <=0){
    		var temp = new Bullets();
    		temp.xcor = this.xcor;
    		temp.ycor = this.ycor;
    		temp.xvel = 10 * Math.cos(this.angle);
    		temp.yvel = 10 * Math.sin(this.angle);
    		bullets.push(temp);
    	}
    }
};
Player.prototype = Object.create(AsteroidsObject.prototype);


/*--
      DOM Manipulation
--*/
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var player;
var asteroids = [];
var bullets = [];
var leftPress, rightPress;

var requestId; //for animation stacking stop

ctx.fillStyle = "#000";
ctx.strokeStyle= "#FFF";
ctx.fillRect(0,0,canvas.width,canvas.height);

var setupKeypress = function setupKeypress(){
    document.addEventListener("keydown",function(e){
	if (e.keyCode == 38){ //up
	    player.accel=0.05;
	}
	else if (e.keyCode == 37){//left
	    leftPress = true;
	}
	else if (e.keyCode == 39){//right
	    rightPress = true;
	}
	else if (e.keyCode == 32){//space
		player.shoot();
	}
	}
    );
    document.addEventListener("keyup",function(e){
	if (e.keyCode == 38){
	    player.accel=0;
	}
	else if (e.keyCode == 37){//left
	    leftPress = false;
	}
	else if (e.keyCode == 39){//right
	    rightPress = false;
	}
    });
};

var drawCanvas = function drawCanvas(){
    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.updateUser(asteroids);

    //if( player.willAnimate)
    requestId = window.requestAnimationFrame(drawCanvas);
    for (j= 0; j<asteroids.length; j++){
    	asteroids[j].update();
    }
    for (i = 0; i < bullets.length && i<1; i++){
	//BUG: for some reason this breaks when there is more than one bullet
	bullets[i].updateBullet(asteroids);
    }
};

var stopAnimation = function() {
    if (requestId ) {
	window.cancelAnimationFrame(requestId);
	requestId = undefined;
    }
}

var setup = function setup(){
    player = new Player(); 
    setupKeypress();
    if(!requestId)
	drawCanvas();
	asteroids = [];
	bullets=[];
	for (i=0;i<10;i++){	
		asteroids.push(new Asteroids());
	}
    console.log("setup");
};

window.addEventListener("load",setup);

//Buttons
var restart = document.getElementById( "restart" );
restart.addEventListener( "click", setup);
