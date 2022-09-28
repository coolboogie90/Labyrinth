var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            tileBias: 48,
        }
    },
    scene: {
        preload: preload,
        create: create
    }
};

var sprite;
var group;
let cursorPosition;
let win = false;

var game = new Phaser.Game(config);

function preload ()
{
    this.load.image('backGround', 'Assets/images/bg_water.png');
    this.load.image('shrimp', 'Assets/Images/shrimp1.png');
    this.load.image('star', 'Assets/Images/cuteStar1.png');
    this.load.image('tiles', 'Assets/Images/coral.png');
    this.load.tilemapTiledJSON('walls', 'Assets/Tiled/labymap.json');
    
}

function create ()
{
    // -------- Background setup --------
    
    backGround = this.add.image(0,0,'backGround');
    backGround.setOrigin(0,0);
    
    // -------- Tilemap setup --------
    
    const map = this.make.tilemap({ key: 'walls' });   
    var corals = map.addTilesetImage('coral', 'tiles', 32, 32, 0, 0);   
    let walls = map.createStaticLayer(0, corals, 0, 50);
    walls.setCollisionByProperty({ collides: true }); // !!! COLLISION NOT DETECTED

    // -------- Shrimp and Goal setup --------
    
    shrimp = this.physics.add.image(75, 132, 'shrimp');
    goal = this.physics.add.image(600, 500,'star');
    
    // -------- Draggable shrimp setup --------
    
    let padding = 20;
    shrimp.setInteractive(
        {
            draggable: true,
            // SETUP hitArea
            hitArea: new Phaser.Geom.Rectangle(
                - padding,
                - padding,
                shrimp.width + padding * 2,
                shrimp.height + padding * 2 ),
                //Check hitArea
                hitAreaCallback: function(hitArea, x, y){
                    return Phaser.Geom.Rectangle.Contains(hitArea, x, y);
                }
            }
            );
    
    this.input.on('drag', function (pointer, obj, dragX, dragY) {
            obj.x = dragX;
            obj.y = dragY;
        });
    
    // -------- Colliders setup ---------
    
    this.physics.add.collider(shrimp, walls);
    this.physics.add.collider(shrimp, goal, CollisionStar, null, this);
    
    
    // Need to add a timer and fix the collision problem...

}

// ------- Collision shrimp/star ------- 

function CollisionStar()
{
    if(Phaser.Geom.Intersects.RectangleToRectangle(shrimp.getBounds(),goal.getBounds())) 
    {
        let timerWin = this.time.addEvent({
        delay: 200,
        callback: youWin,
        callbackScope: this,
        repeat: 0 
            });
    }
}

// ------- Win Text function --------

function youWin()
{
    this.add.text(300, 250, "You Win!", { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });   
}

// ------- Lose Text function --------

function youLose()
{
    this.add.text(300, 250, "You Lose...", { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });   
}
