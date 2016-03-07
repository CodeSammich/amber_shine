/*--
  Constructor for an object in asteroids
--*/
var AsteroidsObject = function(){
    this.xcor = this.ycor = this.xvel = this.yvel = 0;
    this.draw = function(){
	ctx.strokeRect(this.xcor,this.ycor,10,20);
    };
};

var Player = function(){
    AsteroidsObject.call(this); //calls the AsteroidsObject function first to initialize the variables
    this.angle = this.vel = this.accel = 0;
    this.update = function(){
	if (this.accel > 0){
	    var newvel = this.vel + this.accel;
	    if (newvel > -4 && newvel < 4){ //stay below maximum velocity
		this.vel = newvel;
	    }
	    this.xvel = this.vel*Math.cos(this.angle);
	    this.yvel = this.vel*Math.sin(this.angle);
	}
	else{ //natural deceleration
	    if (this.vel > 0)
		this.vel-=0.01;
	    if (this.vel < 0)
		this.vel+=0.01;
	}
	if (leftPress){
	    this.angle = (this.angle-0.05)%(2*Math.PI);
	}
	if (rightPress){
	    this.angle = (this.angle+0.05)%(2*Math.PI);
	}
	this.xcor+=this.xvel;
	this.ycor+=this.yvel;
	this.draw();
    }
};
Player.prototype = Object.create(AsteroidsObject.prototype);


/*--
      DOM Manipulation
--*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var player;
var leftPress, rightPress;

ctx.fillStyle = "#000";
ctx.strokeStyle= "#FFF";
ctx.fillRect(0,0,canvas.width,canvas.height);

var setupKeypress = function setupKeypress(){
    document.addEventListener("keydown",function(e){
	if (e.keyCode == 38){ //up
	    player.accel=0.1;
	}
	else if (e.keyCode == 37){//left
	    leftPress = true;
	}
	else if (e.keyCode == 39){//right
	    rightPress = true;
	}
    });
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
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    window.requestAnimationFrame(drawCanvas);
};

var setup = function setup(){
    player = new Player();
    setupKeypress();
    drawCanvas();
};

window.addEventListener("load",setup);
