/*--
  Constructor for an object in asteroids
--*/
var AsteroidsObject = function AsteroidsObject(){
    this.angle = this.xcor = this.ycor = this.xvel = this.yvel = this.accel = 0;
    this.draw = function(){
	ctx.strokeRect(this.xcor,this.ycor,10,20);
    }
    this.update = function(){
	if (this.accel > 0 ){
	    if (this.xvel < 1 && this.xvel > -1){
		this.xvel+=(this.accel*Math.cos(this.angle))%2.5;
	    }
	    if (this.yvel < 1 && this.yvel > -1){
		this.yvel+=(this.accel*Math.sin(this.angle))%2.5;
	    }
	    console.log(this.yvel);
	}
	if (this.xcor >= 0 && this.xcor < canvas.width){
	    this.xcor+=this.xvel;
	}
	if (this.ycor >= 0 && this.ycor < canvas.height){
	    this.ycor+=this.yvel;
	}
	this.draw();
    }
};

/*--
  DOM Manipulation
--*/

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var upPress, downPress, leftPress, rightPress;
var player;

ctx.fillStyle = "#000";
ctx.strokeStyle= "#FFF";
ctx.fillRect(0,0,canvas.width,canvas.height);

var setupKeypress = function setupKeypress(){
    document.addEventListener("keydown",function(e){
	if (e.keyCode == 38){ //up
	    player.accel=1;
	}
	else if (e.keyCode == 37){//left
	    player.angle = (player.angle+0.01)%(2*Math.PI);
	}
	else if (e.keyCode == 39){//right
	    player.angle = (player.angle-0.01)%(2*Math.PI);
	}
    });
    document.addEventListener("keyup",function(e){
    });
};

var drawCanvas = function drawCanvas(){
    ctx.fillRect(0,0,canvas.width,canvas.height);
    player.update();
    window.requestAnimationFrame(drawCanvas);
};

var setup = function setup(){
    player = new AsteroidsObject();
    setupKeypress();
    drawCanvas();
};

window.addEventListener("load",setup);
