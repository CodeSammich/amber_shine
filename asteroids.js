/*--
  Constructor for an object in asteroids
  --*/

var AsteroidsObject = function(){
    this.xcor = this.ycor = 0;
    this.xvel = this.yvel = 0;
    this.radius = 0;
    this.health = 0;
    this.draw = function(){
	ctx.strokeRect(this.xcor,this.ycor,10,20);
    };
    this.update = function(){
	this.xcor+=this.xvel;
	this.ycor+=this.yvel;
	this.draw();
    };
};

var Player = function(){
    AsteroidsObject.call(this); //calls the AsteroidsObject function first to initialize the variables
    this.angle = this.accel = 0;
    this.xcor = canvas.width/2;
    this.ycor = canvas.height/2;
    this.health = 3;
    this.radius = 10; //change this later
    this.draw = function(){
	ctx.beginPath();
	ctx.moveTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*3/4),this.ycor+10*Math.sin(this.angle+Math.PI*3/4));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*5/4),this.ycor+10*Math.sin(this.angle+Math.PI*5/4));
	ctx.lineTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
	ctx.stroke();
	ctx.closePath();
    };
    this.updateUser = function(){
	if (this.xcor + this.radius >= canvas.width || this.xcor - this.radius <= 0 || this.ycor + this.radius >= canvas.height
	   || this.ycor <= 0){
	    this.xvel = -1 * this.xvel;
	    this.yvel = -1 * this.yvel;
	}
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
	this.update();
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
    player.updateUser();

    //if( player.willAnimate)
    requestId = window.requestAnimationFrame(drawCanvas);

    console.log(player.xvel);

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

    console.log("setup");
};

window.addEventListener("load",setup);

//Buttons
var restart = document.getElementById( "restart" );
restart.addEventListener( "click", setup);
