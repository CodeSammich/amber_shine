/*--
Constructor for an object in asteroids
--*/

var AsteroidsObject = function(){
  this.xcor = this.ycor = 0;
  this.xvel = this.yvel = 0;
  this.radius = 0;
  this.health = 0;
  this.id = 0;
  this.getX = function(){
    return this.xcor;
  }
  this.getY = function(){
    return this.ycor;
  }
  this.draw = function(){
    ctx.strokeRect(this.xcor,this.ycor,10,20);
  };
  this.update = function(){
    if (this.id == 1 && (this.xcor + this.radius >= canvas.width || this.xcor - this.radius <= 0)){
      this.xvel = -1 * this.xvel;
    }
    if(this.id == 1 && (this.ycor + this.radius >= canvas.height || this.ycor <= 0)){
      this.yvel = -1 * this.yvel;
    }
    this.xcor+=this.xvel;
    this.ycor+=this.yvel;
    this.draw();
  };
};

var Asteroid = function(){
  AsteroidsObject.call(this);
  this.id = 2;
  this.xcor = Math.random() * canvas.width;
  this.ycor = Math.random() * canvas.height;
  this.xvel = Math.random() + 1;
  this.yvel = Math.random() + 1;
  if(Math.random * 10 < 6){
    this.xvel = this.xvel * -1;
  }
  if(Math.random * 10 < 6){
    this.yvel = this.yvel * -1;
  }
  this.radius = 20;
  this.health = 1;
  this.draw = function(){
    ctx.beginPath();
    ctx.arc(this.xcor, this.ycor, this.radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
  }

  this.updateObject = function updateObject(asteroids, index, player){
    if(Math.abs(this.xcor - player.xcor) <= this.radius+player.radius && Math.abs(this.xcor - player.xcor) >= this.radius - player.radius
    && Math.abs(this.ycor - player.ycor) <= this.radius+player.radius && Math.abs(this.ycor - player.ycor) >= this.radius - player.radius){
      this.health = 0;
      asteroids[index] = new Asteroid();
    }
    else{
      if(this.xcor + this.radius >= canvas.width || this.xcor - this.radius <= 0 || this.ycor + this.radius >= canvas.height || this.ycor <= 0){
        this.health = 0;
        asteroids[index] = new Asteroid();
      }
      for(var i =0; i<asteroids.length;i++){
        if(i != index){
          if(Math.abs(this.xcor - asteroids[i].xcor) <= this.radius * 2 && Math.abs(this.xcor - asteroids[i].xcor) >= this.radius
          && Math.abs(this.ycor - asteroids[i].ycor) <=this.radius * 2 && Math.abs(this.ycor - asteroids[i].ycor)>=this.radius){
            this.xvel = -1 * this.xvel;
            this.yvel = -1 * this.yvel;
          }
        }
      }
    }
    this.update();
  }
}
Asteroid.prototype = Object.create(AsteroidsObject.prototype);

var Player = function(){
  AsteroidsObject.call(this); //calls the AsteroidsObject function first to initialize the variables
  this.angle = this.accel = 0;
  this.xcor = canvas.width/2;
  this.ycor = canvas.height/2;
  this.health = 20;
  this.radius = 10; //change this later
  this.id = 1;
  this.draw = function(){
    ctx.beginPath();
    ctx.moveTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
    ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*3/4),this.ycor+10*Math.sin(this.angle+Math.PI*3/4));
    ctx.lineTo(this.xcor+10*Math.cos(this.angle+Math.PI*5/4),this.ycor+10*Math.sin(this.angle+Math.PI*5/4));
    ctx.lineTo(this.xcor+10*Math.cos(this.angle),this.ycor+10*Math.sin(this.angle));
    ctx.stroke();
    ctx.closePath();
  };
  this.updateUser = function updateUser(asteroids){
    for(var i = 0; i<asteroids.length;i++){
      if(Math.abs(this.xcor - asteroids[i].xcor) <= this.radius+asteroids[i].radius
      && Math.abs(this.xcor - asteroids[i].xcor) >= asteroids[i].radius - this.radius
      && Math.abs(this.ycor - asteroids[i].ycor) <= this.radius+asteroids[i].radius
      && Math.abs(this.ycor - asteroids[i].ycor) >= asteroids[i].radius - this.radius){
        this.health = this.health - 1;
        this.xvel = -0.75 * this.xvel;
        this.yvel = -0.75 * this.yvel;
      }
    }
    if(this.health <=0){
      this.stopAnimation();
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

var drawCanvas = function drawCanvas(asteroids){
  ctx.fillRect(0,0,canvas.width,canvas.height);
  for(var i =0; i<asteroids.length; i++){
    asteroids[i].updateObject(asteroids, i, player);
  }
  player.updateUser(asteroids);

  //if( player.willAnimate)
  requestId = window.requestAnimationFrame(function() {drawCanvas(asteroids)});

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
  var asteroids = [];
  for(var i = 0; i<10; i++){
    asteroids.push(new Asteroid());
  }
  setupKeypress();
  if(!requestId){
    drawCanvas(asteroids);
  }
  console.log("setup");
};

window.addEventListener("load",setup);

//Buttons
var restart = document.getElementById( "restart" );
restart.addEventListener( "click", setup);
