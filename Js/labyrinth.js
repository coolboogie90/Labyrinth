var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'phaser-example',
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
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
    backGround = this.add.image(0,0,'backGround');
    backGround.setOrigin(0,0);
    
    const map = this.make.tilemap({ key: 'walls' });   
    var corals = map.addTilesetImage('coral', 'tiles', 32, 32, 0, 0);   
    let layer = map.createStaticLayer(0, corals, 0, 50);
    layer.setCollisionBetween(1,1);
    
    
    let padding = 20;
    shrimp = this.physics.add.image(75, 132, 'shrimp');
    shrimp.setInteractive(
        {
            draggable: true,
            // SETUP hitarea
            hitArea: new Phaser.Geom.Rectangle(
                - padding,
                - padding,
                shrimp.width + padding * 2,
                shrimp.height + padding * 2 ),
                //Check hitarea
                hitAreaCallback: function(hitArea, x, y){
                    return Phaser.Geom.Rectangle.Contains(hitArea, x, y);
                }
            }
            );
            
            this.input.on('drag', function (pointer, obj, dragX, dragY) {
                obj.x = dragX;
                obj.y = dragY;
            });
            
            goal = this.physics.add.image(600, 500,'star');
            
            this.physics.add.collider(shrimp, goal, CollisionStar, null, this);
            
        }
        
        function CollisionStar(){
            if(Phaser.Geom.Intersects.RectangleToRectangle(
                shrimp.getBounds(),goal.getBounds()
                )) 
                {
                    let timerWin = this.time.addEvent({
                        delay: 200,
                    callback: youWin,
                    callbackScope: this,
                    repeat: 0
                    });
            }
            
    }

    function youWin(){
        this.add.text(300, 250, "You Win!",
            { fontFamily: 'Arial', fontSize: 60, color: '#ffffff' });
        
    }

