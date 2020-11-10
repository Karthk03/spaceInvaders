var backGround;

var player;

var gameStat;
var bulletGroup;

var i;
var alien;
var life;
var alienBulletGroup;
var alienGroup;
var movement;
var wave
var alienNo
var k;
var coolDown;
var incr;
var smart
var bullet;
var bulletArrPos;

var player_img;
var playerDeath_img;

var backGround_img;

var Alien1_img;
var Alien2_img;
var AlienDeath_img;
var boss_img;

var edges;

function preload()
{
  player_img = loadImage("Player.png");
  playerDeath_img = loadImage("Player_death.png");
  backGround_img = loadImage("BackGround.png");
  Alien1_img = loadImage("Alien1.png");
  Alien2_img = loadImage("Alien2.png");
  AlienDeath_img = loadImage("Alien_Death.png");
  boss_img = loadImage("Boss.png")
}

function setup() 
{
  createCanvas(400, 400);
  
  backGround = createSprite(200,0,0,0);
  backGround.addAnimation("spaceBackground",backGround_img);
  backGround.scale = 2.5;
  
  player = createSprite(200,350,0,0);
  player.addAnimation("Player",player_img);
  player.addAnimation("PlayerDeath",playerDeath_img);
  
  
  gameState = "pre play";
  bulletGroup = new Group();
  i = 2;
  alien = [];
  life = [];
  alienBulletGroup = new Group();
  alienGroup = new Group();
  movement = [];
  wave = null;
  alienNo = 6;
  coolDown = 20;
  smart = [];
  bullet = [];
  bulletArrPos = 0;
  
  backGround.velocityY = 1;
  life[player] = true;
  edges = [];
  edges = createEdgeSprites();
}

function draw() 
{
  background(0);
  
  if(backGround.y>=400)
  {
    backGround.y = 200;
  }
  
  if(gameState == "playing" && life[player] == true)
  {
    player.x = World.mouseX;
    
    if(mouseWentDown()&&life[player] == true&&coolDown>=20)
    {
      bullet[bulletArrPos] = createSprite(player.x,player.y,3,20);
      bullet[bulletArrPos].shapeColor = "white";
      bullet[bulletArrPos].velocityY = -5;
      bullet[bulletArrPos].lifetime = 100;
      bulletGroup.add(bullet[bulletArrPos]);
      bulletArrPos++;
      coolDown = 0;
    }
  }
  //bulletArrPos--;
  for(k=bulletArrPos;k>=0;k--)
  {
    if(bullet[k]!=null)
    {
      if(bullet[k].isTouching(alienGroup))
      {
        bullet[k].lifetime = 1;
      }
    }
  }
  //bulletArrPos++;
  coolDown++;
  drawSprites();
  
  preStart();
  waves();
  restart();
  
  if(gameState == "preWave" || gameState == "preWave2")
  {
    textSize(20);
    fill("white");
    
    if(gameState == "preWave")
    {
      text("WAVE2",200,200);
      text("press 'space' to continue",50,150);
    }
    if(gameState == "preWave2")
    {
      text("FINAL WAVE",200,200);
      text("press 'space' to continue",50,150);
    }
    if(keyWentDown("space"))
    {
      gameState = "playing";
    }
  }
}
function preStart()
{
  if(gameState == "pre play")
  {
    textSize(20);
    fill("yellow");
    text("Space Invaders",125,200);
    text("press 'space' to start playing",100,50);
    
    if(keyWentDown("space"))
    {
      gameState = "playing";
      wave = "wave1";
    }
  }
}

function waves()
{
  if(gameState == "playing")
  {
    while(i<=alienNo)
    {
      if(wave == "wave3"&&i>=7)
      {
        alien[i] = createSprite((i-6)*40,50,0,0);
        alien[i].addAnimation("Boss",boss_img);
        alien[i].addAnimation("AlienDeath",AlienDeath_img);
        smart[i] = true;
      }
      else if(wave == "wave2" && i>=7)
      {
        alien[i] = createSprite((i-6)*40,50,0,0);
        alien[i].addAnimation("Alien2",Alien2_img);
        alien[i].addAnimation("AlienDeath",AlienDeath_img);
      }
      else
      {
        alien[i] = createSprite(i*40,20,0,0);
        alien[i].addAnimation("Alien1",Alien1_img);
        alien[i].addAnimation("AlienDeath",AlienDeath_img);
      }
      life[i] = true;
      movement[i] = true;
      alien.scale = 0.5;
      alienGroup.add(alien[i]);
      if(wave == "wave3")
      {
        alienGroup.setVelocityEach(10,0);
      }
      else
      {
        alienGroup.setVelocityEach(5,0);
      }
      i++;
    }
    
    for(incr = 2;incr<=alienNo;incr++)
    {
      alien[incr].bounceOff(edges);
      if(alien[incr].x >= 350)
      {
        if(movement[incr] == true && smart[incr]!=true)
        {
          alien[incr].y+=30;
          movement[incr] = false;
        }
      }
    }
    
    for(incr=2;incr<=alienNo;incr++)
    {
      alien[incr].bounceOff(edges);
      if(alien[incr].x <= 50)
      {
        if(movement[incr] == false && smart[incr]!=true)
        {
          alien[incr].y+=30;
          movement[incr] = true;
        }
      }
    }
    
    for(incr=7;incr<=alienNo;incr++)
    {
      if(smart[incr] == true)
      {
        if(incr<9)
        {
          alien[incr].x = player.x-((incr-6)*40);
        }
        if(incr>9)
        {
          alien[incr].x = player.x+((incr-9)*40);
        }
        if(incr==9)
        {
          alien[incr].x = player.x;
        }
      }
    }
    
    if(World.frameCount%25 == 0)
    {
      incr = Math.round(random(2,alienNo))
      if(life[incr]!=false)
      {
        var alienBullet = createSprite(alien[incr].x,alien[incr].y,3,10);
        alienBullet.shapeColor = "yellow";
        alienBullet.velocityY = 5;
        alienBulletGroup.add(alienBullet);
      }
    }
    
    for(incr=2;incr<=alienNo;incr++)
    {
      if(alien[incr].isTouching(bulletGroup))
      {
        alien[incr].setVelocity(0,0);
        alien[incr].changeAnimation("AlienDeath");
        alien[incr].lifetime = 20;
        life[incr] = false;
      }
    }
    if(alienBulletGroup.isTouching(player))
    {
      player.setVelocity(0,0);
      player.changeAnimation("PlayerDeath");
      life[player] = false;
      player.lifetime = 10;
      gameState = "end";
    }
    
    k = 0;
    for(incr=2;incr<=alienNo;incr++)
    {
      if(life[incr] == false && life[player] == true)
      {
        k++;
      }
      if(k>=alienNo-1)
      {
        if(wave == "wave1")
        {
          gameState = "preWave";
          wave = "wave2";
          i=2;
          alienNo = 11;
        }
        if(wave == "wave2"&&gameState == "playing")
        {
          gameState = "preWave2";
          wave = "wave3";
          i=2;
          alienNo = 11;
        }
      }
    }
  }
}

function restart()
{
  if(gameState == "end")
  {
    alienGroup.setVelocityEach(0,0);
    textSize(20);
    fill("yellow");
    text("you died press 'space' to try again",50,200);
    if(keyWentDown("space"))
    {
      alienGroup.destroyEach();
      alienNo = 6;
      wave = "wave1";
      i=2;
      player.changeAnimation("Player");
      player.visible = true;
      life[player] = true;
      player.lifetime = -1;
      gameState = "playing";
    }
  }
}