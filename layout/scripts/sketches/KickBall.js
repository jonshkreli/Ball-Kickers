/**
 * Created by jon on 17-10-28.
 */

var cnv;

function setup() {
    cnv = createCanvas(800, 600);
    SphereObj.setupSpheres(10);
}



function draw() {
    background(255, 0, 200);
    SphereObj.runSpheres();


}


class sphereClass{
    constructor(){
        this.spheres = [];
        this.activemode='';
        this.ratio = 20;
    }
    ActiveFeatures(){
        //let inputs = document.getElementById('features').getElementsByTagName('input');
        //for(let i=0; i< inputs.length;++i)  if(inputs[i].checked) returnValues.push(inputs[i].id);
        return ['RevertInBounds', 'AirFriction', 'obstacle'];
    }
    runSpheres(){
       // this.drawSphere();
        this.showspheres();
        this.ApplyForces(this.ActiveFeatures());
        CheckArrSize(this.spheres);
    }
    drawSphere(){
        if(mouseIsPressed && (key=='d' || this.activemode=='Draw bubbles'))
        //console.log(true)
            this.addSphere()
    }
    addSphere(){
        if(abs( mouseX-pmouseX)>3 && abs(mouseY-pmouseY)>3){
            var coord={x: mouseX, y: mouseY};
            let vector = {x: ( mouseX-pmouseX)/100, y: ( mouseY-pmouseY)/100};
            let colArr = new Array(3);
            for(let i=0;i<3;i++) colArr[i] = Math.floor(Math.random()*255);
            let col={};
            col.rgbaStr = 'rgba('+colArr[0]+','+colArr[1]+','+colArr[2]+',0.9)';
            col.rgbArr = colArr;
            col.c = color(colArr[0],colArr[1],colArr[2],180);
            var sphereData = {};
            sphereData.coord= coord; sphereData.vector = vector; sphereData.col = col;
            this.spheres.push(sphereData);
        }
        //console.log(mouseButton)
    }

    setupSpheres(number, color1, color2){
        let i= number || 0;
        for (i; i>0; i--){
            var color
            if(i<5) color = color1 || 'red';
            else color = color2 || 'green';
            this.spheres.push({
                coord: {x: i*(width/10), y: height/2},
                vector: {x: 0, y: 0},
                col: color
            })
        }
    }

    showspheres(){
        //console.log(this.spheres);
        for(let sphere of this.spheres){
            //console.log(arrl[ele]);
           push();
           //translate(-width/2+arrl[ele].coord.x,-height/2+arrl[ele].coord.y,0);
            //arrl[ele].coord.y++;
            sphere.coord.x += sphere.vector.x; sphere.coord.y += sphere.vector.y;
           // pointLight(50,50,50,130,-300,200);
            //ambientLight(arrl[ele].col.c /*'red'*/);
          //  specularMaterial(arrl[ele].col);
            fill(sphere.col);
            // var size = lerp(0,20,ele/100)+1; //size varies from 1 to 21 (bigger when close to mouse)
            ellipse(sphere.coord.x, sphere.coord.y, this.ratio);
            pop();

        }
    }
    ApplyForces(forces){
        for(let i in forces) this[forces[i]]()
    }
    RevertInBounds(){
        for(let ele=0; ele< this.spheres.length;ele++){
            let sph = this.spheres[ele];
            if(sph.coord.x >= width || sph.coord.x<=0 ) sph.vector.x = -sph.vector.x;
            if(sph.coord.y <=0 || sph.coord.y>= height){
                sph.vector.y = -sph.vector.y;
            }
        }
    }
    Gravity(){
        for(let ele=0; ele< this.spheres.length;ele++){
            this.spheres[ele].vector.y+=0.08;
        }
    }
    MouseTravel(){
        if(mouseIsPressed && (key=='t' || this.activemode=='travel'))
            if(mouseButton==LEFT){ this.addSphere();
                console.log(key)
                for(let ele=0; ele< this.spheres.length;ele++){
                    let sph = this.spheres[ele];
                    let distancex = (mouseX - sph.coord.x)/100;
                    sph.coord.x-=distancex;
                    let distancey = (mouseY - sph.coord.y)/100;
                    sph.coord.y-=distancey;
                }}
    }
    MouseWind(){
        if(mouseIsPressed && (key=='w'|| this.activemode=='wind'))
            if(mouseButton==LEFT)
                for(let ele=0; ele< this.spheres.length;ele++){
                    let sph = this.spheres[ele];
                    let distancex = (width -abs(mouseX - sph.coord.x))/10000;
                    if(mouseX < sph.coord.x) sph.vector.x+=distancex; else sph.vector.x-=distancex;
                    let distancey = (height -abs(mouseY - sph.coord.y))/10000;
                    if(mouseY < sph.coord.y) sph.vector.y+=distancex; else sph.vector.y-=distancex;
                }
    }
    AirFriction(){
        for(let ele=0; ele< this.spheres.length;ele++){
            let svec = this.spheres[ele].vector;
            // if(svec.x>0) svec.x-=0.001; else svec.x+=0.001;
            //if(svec.y>0) svec.y-=0.001; else svec.y+=0.001;
            if(abs(svec.x) > 2)
                svec.x*=0.99;
            if(abs(svec.y) > 2)
                svec.y*=0.99;
        }
    }
    MouseSuck(){
        if(mouseIsPressed && key=='s')
            for(let ele=0; ele< this.spheres.length;ele++){
                let sph = this.spheres[ele];
                let distancex = (width -abs(mouseX - sph.coord.x))/10000;
                if(mouseX < sph.coord.x) sph.vector.x-=distancex; else sph.vector.x+=distancex;
                let distancey = (height -abs(mouseY - sph.coord.y))/10000;
                if(mouseY < sph.coord.y) sph.vector.y-=distancey; else sph.vector.y+=distancey;
                sph.vector.x*=0.99; sph.vector.y*=0.99;
            }
    }
    obstacle(){
        for(var i=0;i<this.spheres.length;i++){
            var sp1 = this.spheres[i];
            for(var j=0;j<this.spheres.length;j++){
                if(i==j) continue;
                var sp2=this.spheres[j];
                //console.log(sp2,i,j)
                if(dist(sp1.coord.x,sp1.coord.y,sp2.coord.x,sp2.coord.y) <= this.ratio){
                    //print(sp1.coord.x,sp1.coord.y,sp2.coord.x,sp2.coord.y)
                    //console.log(sp1.vector.x)
                    sp1.vector.x = -sp1.vector.x; sp1.vector.y = -sp1.vector.y;
                    sp2.vector.x = -sp2.vector.x; sp1.vector.x = -sp1.vector.x;
                    //console.log(sp1.vector.x)
                }
            }
        }
    }
}

var SphereObj = new sphereClass();


function CheckArrSize(array) {
    if(array.length>100) array.shift();
}