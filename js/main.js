var settings = {

  message: "Bamboo Media Art Studio",

  checkbox: true,

  colorA: '#fffffff',

  colorB: '#fffffff',

  step5: 10,

  range: 50,

  options:"Option 1",

  speed:0,

  reloadfromGUI: function()  {  reloadPage(); },

  saveImageFromGUI: function()  {  saveImage(); },

  fullScreenFromGUI: function()  {  toggleFullScreen(); },

  toggleStatsFromGUI: function()  {  toggleStatsVisibility(); },

  toggleGUIFromGUI: function()  {  toggleGuiVisibility(); },




  field1: "Field 1",
  field2: "Field 2",
  color0: "#fffffff", // CSS string
  color1: [ 0, 128, 255 ], // RGB array
  color2: [ 0, 128, 255, 0.3 ], // RGB with alpha
  color3: { h: 350, s: 0.9, v: 0.3 } // Hue, saturation, value
};


/*var gui = new dat.GUI();

gui.remember(settings);


gui.domElement.id = 'gui';

gui.add(settings, 'message');

gui.add(settings, 'step5', 0, 255).step(5);
gui.add(settings, 'checkbox').onChange(function (value) {
  init();
});
gui.add(settings, 'range', 1, 100).onChange(function (value) {
  init();
});
gui.add(settings, 'options', [ 'Option 1', 'Option 2', 'Option 3' ] );
gui.add(settings, 'speed', { Low: 0, Med: 0.5, High: 1 } );
gui.addColor(settings, 'colorA').onChange(function (value) {
  init();
});
gui.addColor(settings, 'colorB').onChange(function (value) {
  init();
});

var f2 = gui.addFolder('Colors');
f2.addColor(settings, 'color0');
f2.addColor(settings, 'color1');
f2.addColor(settings, 'color2');
f2.addColor(settings, 'color3');
f2.open();

var f3 = gui.addFolder('actions');

f3.add(settings, 'reloadfromGUI');

f3.add(settings, 'saveImageFromGUI');

f3.add(settings, 'fullScreenFromGUI');

f3.add(settings, 'toggleStatsFromGUI');

f3.add(settings, 'toggleGUIFromGUI');

f3.open();

gui.open();*/

let locked = false;

let actualStat = 0;

var stats;

let canvas;

var actualVisualization;

var totalVisualizations = 5;

gsap.registerPlugin(DrawSVGPlugin);

var ellipseAnimation;

var debug;

var lastX;

var isInverted = false;

var mapperValue = .5;

var useMapper = true;

var lastY;

var mapperTop;

var mapperLeft;

var mapperBottom;

var mapperRight;

var primaryColors = new Array('#ff0066', '#00eaff', '#00ffa2 ', '#b39a57', '#6d4473');//, '#ffffff', '#00d2ff', '#23cd6f');

var secondaryColors = new Array('#ff418c', '#45ea96', '#4c8f5c');//, '#ffffff', '#00d2ff', '#23cd6f');

var primaryColor;

var secondaryColor;


/*
*
* preload();
* preload the things from here...
*/

const s = ( p ) => {

  var visualizations = new Visualizations(p);

  var actualVisualization;



p.preload = function(){


  let images = [

  'images/backgrounds/0.jpg', 'images/backgrounds/1.jpg', 'images/backgrounds/2.jpg',

  'images/backgrounds/3.jpg', 'images/backgrounds/4.jpg', 'images/backgrounds/5.jpg'];

  for(let i=0; i<images.length; i++){ p.loadImage(images[i]); }

  let url = 'json/config.json';

  loader = p.loadJSON(url);
}

/*
*
* setup();
* entry point from here...
*/

p.setup = function() {

  let random;

  if(loader.useRandomColor == true){
    random = Math.floor(p.random(0, primaryColors.length));

  }else{

    random = 0;
  }


  primaryColor = primaryColors[random];

  secondaryColor = secondaryColors[random];
  console.log(primaryColor, secondaryColor)

  let lastEllipsePercent = 0;

  ellipsePercent = 100;

  useMapper = loader.mapper.useMapper;

  if(useMapper == true){

      mapperLeft = loader.mapper.mapperLeft;

      mapperRight = loader.mapper.mapperRight;

      mapperTop = loader.mapper.mapperTop;

      mapperBottom = loader.mapper.mapperBottom;


    }else{

      mapperLeft = 0.0;

      mapperRight = 1.0;

      mapperTop = 0.0;

      mapperBottom = 1.0;

    }

    if(loader.useRandomVisualization == true){

      actualVisualization = Math.floor(p.random(1, 5));

    }else{

      if(window.localStorage.getItem("actualVisualization") == null){

        actualVisualization = 4;

      }else{

        actualVisualization = 4


      }

    }


  //...
  document.getElementById("time-container").style.visibility = "hidden";
  empezarTiempo = function() {
    document.getElementById("time-container").style.visibility = "visible";
    gsap.to('.tester', {drawSVG: 0});

    ellipseAnimation = gsap.timeline();

    ellipseAnimation.fromTo('.tester', {drawSVG: "0%"}, {drawSVG: "100%", duration: loader.autoReload.autoreloadTime, onUpdate:onTimeUpdate, onComplete:onTimeComplete});
  }

/*
  if(loader.autoReload.useAutoReload == true){

    gsap.to('.tester', {drawSVG: 0});

    ellipseAnimation = gsap.timeline();

    ellipseAnimation.fromTo('.tester', {drawSVG: "0%"}, {drawSVG: "100%", duration: loader.autoReload.autoreloadTime, onUpdate:onTimeUpdate, onComplete:onTimeComplete});

  }else{

    document.getElementById("time-container").style.visibility = "hidden";

  }*/

  setupOSCListener();

  //if(loader.showGUI == false) gui.hide();

  canvas = (loader.screen.useFixedScreen) ?  p.createCanvas(loader.screen.width, loader.screen.height) : p.createCanvas(p.displayWidth, p.displayHeight);

  p.background(loader.background.r, loader.background.g, loader.background.b);

  p.cursor(p.CROSS);

  debug = false;

  visualizations.setup(4, primaryColor, secondaryColor);

  /*stats = new Stats();

  stats.showPanel(actualStat);

  stats.domElement.id = 'stats';

  document.body.appendChild(stats.dom);*/

  //if(loader.showStats == false) document.getElementById("stats").style.visibility = "hidden";

  //requestAnimationFrame(animate);

}

/*
* draw();
* draw the things...
*/

p.draw = function() {

  /*p.drawingContext.shadowOffsetX = 0;

  p.drawingContext.shadowOffsetY = 0;

  p.drawingContext.shadowBlur = 4;

  p.drawingContext.shadowColor = p.color(255, 0, 102, 255);*/

  visualizations.run();

}

/*
*
* keyPressed();
* on key press.
*/

p.keyPressed = () => {

  return false;

}

/*
*
* keyReleased();
* on key release...
*/

p.keyReleased = () => {

  switch(p.key){

    case '4':

    console.log("4");

    saveActualVisualization(4);

    break;

    //case '5':

    //console.log("5");

    //saveActualVisualization(5);


    break;

    case 'm':
    case 'M':

    toggleMouse();

    break;

    case 's':
    case 'S':

    //toggleStatsVisibility();

    break;

    case 'f':
    case 'F':

    toggleFullScreen();

    break;

     case 'g':
     case 'G':

     //toggleGuiVisibility();

     break;

     case 'q':
     case 'Q':

     switchStats();

     break;

     case 'w':
     case 'W':

     saveImage();

     break;

     case 'r':
     case 'R':

     reloadPage();

     break;

  }

  return false;

}

/*
*
* mousePressed();
* on mouse pressed.
* if we are in debug mode, send data...
*/

p.mousePressed = () => {

  if(debug){

    visualizations.x = p.mouseX;

    visualizations.y = p.mouseY;
  }
  

  if(debug) visualizations.isDrawing = true;

  if(actividadEmpezada == false)
  {
    startFilling(p.mouseX, p.mouseY)
  }

  console.log("mouse press");
}

/*
*
* mouseReleased();
* on mouse released.
* if we are in debug mode, send data...
*/

p.mouseReleased = () => {

  if(debug) visualizations.isDrawing = false;

  console.log("release");

}

/*
*
* mouseDragged();
* on mouse released.
*/

p.mouseDragged = () => {

  if(debug){

    //visualizations.x = p.map(p.mouseX, 0, p.displayWidth, 0.0, 1.0);

    visualizations.x = p.mouseX;

    visualizations.y = p.mouseY;

  }

}

/*
*
* doubleClicked();
* on mouse released.
*/

doubleClicked = () => { }

/*
*
* toggleMouse();
* toggle the mouse visibility..
*/

toggleMouse = () =>{

  if (!locked) {

      locked = true;

      p.requestPointerLock();

    } else {

      p.exitPointerLock();

      locked = false;

    }

}

/*
*
* toggleFullScreen();
* toggle the fullscreen visibility...
*/

toggleFullScreen = () =>{ p.fullscreen(!p.fullscreen()); }

/*
*
* toggleStatsVisibility();
* change the stats visibility....
*/

toggleStatsVisibility = () =>{

  let element = document.getElementById("stats");

  if(element.style.visibility == "hidden"){

    element.style.visibility = "visible";

  }else{

    element.style.visibility = "hidden";

  }

}

/*
*
* toggleGuiVisibility();
* change the gui visibility....
*/

toggleGuiVisibility = () =>{ dat.GUI.toggleHide(); }

/*
*
* switchStats();
* switch the different stats of the stats component...
*/

switchStats = () =>{

  if(actualStat <=2){ actualStat+=1; }else{ actualStat = 0; }

  stats.showPanel(actualStat);

}

/*
*
* windowResized();
* resize screen...
*/


windowResized = () => {

  p.resizeCanvas(p.displayWidth, p.displayHeight);

  p.background(loader.background.r, loader.background.g, loader.background.b);

  console.log("resize");

}

/*
*
* saveImage();
* save canvas...
*/

saveImage = () =>{

   var b64Image = defaultCanvas0.toDataURL("image/png");

    fetch("php/save.php", {

      method: "POST",

      mode: "no-cors",

      headers: {"Content-Type": "application/x-www-form-urlencoded"},

      body: b64Image

    })

    .then(response => response.text())

    .then(success => console.log(success))

    .catch(error => console.log(error));
}




/*
*
* saveActualVisualization();
* save the visualization in local storage so we can have everything
* in the same logic
*
* @param value - the visualization...
*/


saveActualVisualization = (value, reload = true) =>{

  console.log("saving visuals to: " + value);

  window.localStorage.setItem("actualVisualization", Number(value));

  if(reload) window.location.reload();

}

/*
*
* setupOSCListener();
* create the osc listener for all the visual stuff....
*/

setupOSCListener = () =>{

  console.log("setting up");

  var port = new osc.WebSocketPort({ url:"ws://localhost:"+3002});

  port.on("message", function(oscMsg){

    console.log("msg");

    if(oscMsg.address == '/interactivity/status'){

      console.log(oscMsg.args);

      if(oscMsg.args[0] == true){

        visualizations.x = p.map(oscMsg.args[1], 0.0, 1.0, 0, p.displayWidth);

        visualizations.y = p.map(oscMsg.args[2], 0.0, 1.0, 0, p.displayHeight);

        visualizations.isDrawing = true;



      }else{

        visualizations.isDrawing = false;

      }

    }

    if(oscMsg.address == '/interactivity/coordinates'){

        visualizations.x = p.map(oscMsg.args[0], 0.0, 1.0, 0, p.displayWidth);

        visualizations.y = p.map(oscMsg.args[1], 0.0, 1.0, 0, p.displayHeight);

      }


  });

  port.open();

}

/*
*
* onTimeUpdate();
* time update...
*/

onTimeUpdate = () =>{

  let v = Math. trunc(p.map(ellipseAnimation.progress(), 1.0, 0.0, 0, loader.autoReload.autoreloadTime));

  document.getElementById("counter").innerHTML = v;

}

/*
*
* onTimeComplete();
* if we are using the app by time, reload when it is
* completed...
*/

onTimeComplete = () =>{ window.location.reload(); }

/*
*
* reloadPage();
* reload this page...
*/

reloadPage = () =>{ window.location.reload(); }

/*
*
* animate();
* animating this...
*/

animate = () => {

  //stats.begin();

  //stats.end();

  //requestAnimationFrame( animate );

}

}

var outerCircle = document.getElementById('outer-circle');
var innerCircle = document.createElement('div');
innerCircle.id = 'inner-circle';
outerCircle.appendChild(innerCircle);
console.log(primaryColor)
var mouseApretado = false;
var fillingInterval;
var noTerminado = true;
var fillingSpeed = 1; // Ajusta la velocidad de llenado (en píxeles)

function startFilling(mousex, mousey) {
  innerCircle.style.backgroundColor = primaryColor;
  console.log("start fill")
  var rect = outerCircle.getBoundingClientRect();
  var centerX = rect.left + rect.width / 2;
  var centerY = rect.top + rect.height / 2;

  var clickX = mousex;
  var clickY = mousey;

  var distance = Math.sqrt(Math.pow(clickX - centerX, 2) + Math.pow(clickY - centerY, 2));

  if (distance <= rect.width / 2 && noTerminado) {
    mouseApretado = true;
    var innerCircleWidth = 0;
    var targetWidth = 200;
    fillingInterval = setInterval(function() {
      if (innerCircle.style.width == targetWidth + 'px' || mouseApretado == false) {
        clearInterval(fillingInterval);
        if (innerCircleWidth >= targetWidth) {
          noTerminado = false;
          // Realizar la acción una vez que el círculo esté completo
          console.log('Círculo completo');
          debug = loader.debug;
          outerCircle.style.visibility = "hidden";
          empezarTiempo();
        }
      } else {
        innerCircleWidth += fillingSpeed;
        innerCircle.style.width = innerCircleWidth + 'px';
        innerCircle.style.height = innerCircleWidth + 'px';
      }
    }, 15); // Ajusta el intervalo de actualización (en milisegundos)
  }
}

function stopFilling() {
  innerCircle.style.backgroundColor = primaryColor;
  if (noTerminado) {
    console.log("start shrink")
    mouseApretado = false;
    fillingSpeed = 1;
    var innerCircleWidth = parseInt(innerCircle.style.width);
    var shrinkingInterval = setInterval(function() {
      if (innerCircle.style.width == '0px' || mouseApretado) {
        clearInterval(shrinkingInterval);
        // Realizar la acción una vez que el círculo se haya achicado completamente
        console.log('Círculo achicado');
      } else {
        innerCircleWidth -= fillingSpeed;
        innerCircle.style.width = innerCircleWidth + 'px';
        innerCircle.style.height = innerCircleWidth + 'px';
      }
    }, 15); // Ajusta el intervalo de actualización (en milisegundos)
  }
}

outerCircle.addEventListener('mousedown', startFilling);
outerCircle.addEventListener('mouseup', stopFilling);





let myp5 = new p5(s);
