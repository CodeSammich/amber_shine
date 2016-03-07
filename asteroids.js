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
    this.angle = this.accel = 0;
    this.xcor = canvas.width/2;
    this.ycor = canvas.height/2;
    this.draw = function(){
	ctx.beginPath();
	ctx.moveTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*3/4),this.ycor+10*Math.sin(this.angle+Math.PI*3/4));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*5/4),this.ycor+10*Math.sin(this.angle+Math.PI*5/4));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
	ctx.stroke();
	ctx.closePath();
    };
    this.update = function(){
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
	    player.accel=0.05;
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
