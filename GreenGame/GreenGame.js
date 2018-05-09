
var Engine = { //the main Engine object
	/** variables **/
	Player: { //the player object
		Buds: {
			Amount: 0, //how many coins that player has
			PerClick: 1, //how many coins per click
			ClickCooldown: 300, //Cooldown between clicks
			ClickCooldownSeconds: 0,
			PerIncrement: 0, //how many coins per timed increment
			Increment: 10, //how long the increment is
			Multiplier: 1
		}
	},
	GlobalMult: 1, //Global Multiplyer
	Canvas: { //the canvas object
		Element: null, //this will be a canvas element
		Context: null //this will become a 2d context
	},
	Timers: {
		timer: null,
		ClickCountdown: null,
		ClickReady: true
	},
	/** elements **/
	Elements: { //this holds the elements
		ClickBox: { //this is our main click element
			x: 20, y: 20, //position
			w: 175, h: 30, fontS: 20 //size
		}
		Inventory: {
			x:20, y:20,//inventory x and y
			yInc: 15, fontS: 15//font size and y increment between items
		}
	},
	/** functions **/
	Init: function() { //an inner function "init"
		Engine.Canvas = document.createElement('canvas'); //create a canvas element
		Engine.Canvas.id = "display"; //give it an id to reference later
		Engine.Canvas.width = 1080; //the width
		Engine.Canvas.height = 720; //the height
		$('body').append(Engine.Canvas); //finally append the canvas to the page

		Engine.AddClick(); //Start the main click event
		Engine.StartIncrement();
		Engine.Canvas.Context = Engine.Canvas.getContext('2d'); //set the canvas to render in 2d.
		Engine.GameLoop(); //start rendering the game
	},


	/** event handlers **/
	StartIncrement: function(){
		setInterval(function (){//if countdown has reached 0, set clickready to true
			if(Engine.Timers.ClickCountdown > 0){
				Engine.Timers.ClickCountdown--;
			}
			else{
				Engine.Timers.ClickReady = true;
			}
			Engine.Timers.timer++;
			console.log(Engine.Timers.ClickCountdown);
		}, Engine.Player.Increment);
	},

	AddClick: function() { //the click function
		$(Engine.Canvas).on('click', function(m) { //we add a click to the Engine.Canvas object (note the 'm')
			if (m.pageX >= Engine.Elements.ClickBox.x && m.pageX <= (Engine.Elements.ClickBox.x + Engine.Elements.ClickBox.w)) { //check to see if the click is within the box X co-ordinates
				if (m.pageY >= Engine.Elements.ClickBox.y && m.pageY <= (Engine.Elements.ClickBox.y + Engine.Elements.ClickBox.h)) { //check to see if the click is within the box Y co-ordinates	
					if(Engine.Timers.ClickReady == true){
						Engine.Player.Buds.Amount += Engine.Player.Buds.PerClick; //increase the coins by the PerClick amount!
						Engine.Timers.ClickCountdown = Engine.Player.Buds.ClickCooldown;//reset clickcountdown
						Engine.Timers.ClickReady = false;
					}
				}
			}
			return false;
		});
	},

	/** animation routines **/
	GameRunning: null, //this is a new variable so we can pause/stop the game
	Update: function() { //this is where our logic gets updated
		Engine.Draw();
		 //call the canvas draw function
	},
	Draw: function() { //this is where we will draw all the information for the game!
		Engine.Canvas.Context.clearRect(0,0,Engine.Canvas.width,Engine.Canvas.height); //clear the frame

		/** Click Button **/
		Engine.Player.Buds.ClickCooldownSeconds = Engine.Timers.ClickCountdown*Engine.Player.Buds.Increment*0.001;

		Engine.Rect(Engine.Elements.ClickBox.x, Engine.Elements.ClickBox.y, Engine.Elements.ClickBox.w, Engine.Elements.ClickBox.h, "white", true, 1); //gather button rect
		Engine.Rect(Engine.Elements.ClickBox.x, Engine.Elements.ClickBox.y, Engine.Elements.ClickBox.w * (Engine.Timers.ClickCountdown / Engine.Player.Buds.ClickCooldown), Engine.Elements.ClickBox.h, "rgba(0,0,0,.38)", false, 1);//Scaling box to show cooldown on gather
		Engine.Text("Harvest Weed", Engine.Elements.ClickBox.x+27, Engine.Elements.ClickBox.y+20, "Calibri", Engine.Elements.ClickBox.fontS, "black");//gather button text
		//Engine.Text(Engine.Player.ClickCooldownSeconds, Engine.Elements.ClickBox.x +Engine.Elements.ClickBox.w - 50, Engine.Elements.ClickBox.y +20, "Calibri", Engine.Elements.ClickBox.fontS, "black");//cooldown timer text

		/** HUD **/
		/** Inventory **/
		Engine.Text("Buds: ", Engine.Elements.Inventory.x, Engine.Elements.Inventory.y, "Calibri", Engine.Elements.Inventory.fontS, "black");//item label text
		Engine.Text(Engine.Player.Buds.Amount, Engine.Elements.Inventory.x + 150, Engine.Elements.Inventory.y, "Calibri", Engine.Elements.Inventory.fontS, "black");
		Engine.Text("TestItemLongerName: ", InvXStart+10, InvYStart+60, "Calibri", 15, "black");

		Engine.Text("TestItem2: ", InvXStart+10, InvYStart+75, "Calibri", 15, "black");

		Engine.GameLoop();//reiterate back to gameloop
	},
	GameLoop: function() { //the gameloop function
		Engine.GameRunning = setTimeout(function() { 
			requestAnimFrame(Engine.Update, Engine.Canvas); 
		}, 10);
	},

	/** drawing routines **/
	Rect: function(x,y,w,h,col,border, thickness) {
		if(border){
			Engine.Canvas.Context.fillStyle = "black";
			Engine.Canvas.Context.fillRect(x-(thickness),y-(thickness),w+(thickness*2),h+(thickness*2));
			Engine.Canvas.Context.fillStyle = col;
			Engine.Canvas.Context.fillRect(x,y,w,h);
		}
		else{
			Engine.Canvas.Context.fillStyle = col;
			Engine.Canvas.Context.fillRect(x,y,w,h);
		}
	},
	Text: function(text, x, y, font, size, col) { //the text, x position, y position, font (arial, verdana etc), font size and colour
		if (col.length > 0) { //if you have included a colour
			Engine.Canvas.Context.fillStyle = col; //add the colour!
		}
		Engine.Canvas.Context.font = size + "px " + font;
		Engine.Canvas.Context.fillText(text,x,y);
	}
};

/** This is a request animation frame function that gets the best possible animation process for your browser, I won't go into specifics; just know it's worth using ;) **/
window.requestAnimFrame = (function(){
	return window.requestAnimationFrame || 
		window.webkitRequestAnimationFrame || 
		window.mozRequestAnimationFrame || 
		window.oRequestAnimationFrame || 
		window.msRequestAnimationFrame || 
	function (callback, element){
		fpsLoop = window.setTimeout(callback, 1000 / 60);
	};
}());
window.onload = Engine.Init(); //the engine starts when window loads
				