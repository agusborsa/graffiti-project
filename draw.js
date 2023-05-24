function setup() {
    createCanvas(windowWidth, windowHeight);
    funcIndex = 5;
    
    buttons = [];
    
    let i = 0;
    sliders = [];
    
    slider = sliderRect("size", 1, 100, false, width-height*0.31, height*0.15 + i++ * height*0.15, height*0.3, height*0.08);
    sliders.push(slider);
    size = 25;
    slider.setVal(size);
  
    slider = sliderRect("spring", 0.001, 1, false, width-height*0.31, height*0.15 + i++ * height*0.15, height*0.3, height*0.08);
    sliders.push(slider);
    spring = 0.5;
    slider.setVal(spring);
    
    slider = sliderRect("friction", 0.001, 1, false, width-height*0.31, height*0.15 + i++ * height*0.15, height*0.3, height*0.08);
    sliders.push(slider);
    friction = 0.5;
    slider.setVal(friction);
    
    slider = sliderRect("splitNum", 1, 20, true, width-height*0.31, height*0.15 + i++ * height*0.15, height*0.3, height*0.08);
    sliders.push(slider);
    splitNum = 10;
    slider.setVal(splitNum);
    
    slider = sliderRect("diff", 0, 20, false, width-height*0.31, height*0.15 + i++ * height*0.15, height*0.3, height*0.08);
    sliders.push(slider);
    diff = size/8;
    slider.setVal(diff);
    
    x = y = vx = vy = v = r = 0;
    f = false;
}

function draw() {
    let i = 0;
    size = sliders[i++].getVal();
    spring = sliders[i++].getVal();
    friction = sliders[i++].getVal();
    splitNum = sliders[i++].getVal();
    diff = sliders[i++].getVal();

    switch(funcIndex) {
        case 0: draw1(); break;
        case 1: draw2(); break;
        case 2: draw3(); break;
        case 3: draw4(); break;
        case 4: draw5(); break;
        case 5: draw6(); break;
    }
}
  
sliderRect=(name,val1,val2,x,w)=>Object.assign({
    barX:x,
    barW:w/2,
    scope:w/2-w/10,
    val1,
    val2,

    getVal:function() {
        let val = (this.x-this.barX-this.barW)/this.scope*(this.val2-this.val1) + this.val1;
        return this.isInt?round(val):val;
    },
    setVal:function(val) {
        this.x = this.barX + this.barW + norm(val, this.val1, this.val2)*this.scope;
    },
});

function draw6() {
drawTxt("draw6:Superimpose lines");
/*
    Draw multiple lines with different positions and thicknesses, 
    and make it look like a brush
*/
/*
    Parameters used
    size : Brush size
    spring : Spring constant(Larger value means stronger spring)
    friction : Friction(Smaller value means, the more slippery)
    splitNum : Number of divisions from old coordinates to new coordinates
    diff : Misalignment of different lines
*/

if(mouseIsPressed) {
    if(!f) {
    f = true;
    x = mouseX;
    y = mouseY;
    }
    vx += ( mouseX - x ) * spring;
    vy += ( mouseY - y ) * spring;
    vx *= friction;
    vy *= friction;
    
    v += sqrt( vx*vx + vy*vy ) - v;
    v *= 0.6;
    
    oldR = r;
    r = size - v;
    
    for( let i = 0; i < splitNum; ++i ) {
    oldX = x;
    oldY = y;
    x += vx / splitNum;
    y += vy / splitNum;
    oldR += ( r - oldR ) / splitNum;
    if(oldR < 1) { oldR = 1; }
    strokeWeight( oldR+diff );  // AMEND: oldR -> oldR+diff
    line( x, y, oldX, oldY );
    strokeWeight( oldR );  // ADD
    line( x+diff*2, y+diff*2, oldX+diff*2, oldY+diff*2 );  // ADD
    line( x-diff, y-diff, oldX-diff, oldY-diff );  // ADD
    }
    
} else if(f) {
    vx = vy = 0;
    f = false;
}
}

drawTxt=(txt)=>{ };