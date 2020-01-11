var defaultanglemag = 30



var defaultlength = 20



var defaultdepth = 10



var maxlengthchange = 28



var maxanglechange = 180







class Vector2{

  constructor(x,y){

    this.x = x;

    this.y = y;

  }

  subtract(v){

    return new Vector2(this.x-v.x,this.y-v.y);

  }

  add(v){

    return new Vector2(this.x+v.x, this.y+v.y);

  }

  rotate(angle){

    let x1 = this.x;

    let y1 = this.y;

    let x = Math.cos(angle)* x1 - Math.sin(angle)* y1;

  let y = Math.sin(angle)*x1 + Math.cos(angle)* y1;

    return new Vector2(x,y);

  }

  getMagnitude(){

    return Math.sqrt((this.x*this.x) + (this.y*this.y));

  }

  getNormal(){

    let magnitude = this.getMagnitude();

    return new Vector2(this.x/magnitude, this.y/magnitude);

  }

}

class Node{

  constructor(pos, depth, parent, biomorph){

    this.pos = pos;

    this.depth = depth;

    this.parent = parent;

    this.biomorph = biomorph;

  }

  addNodePair(i){

    let normalizedvector = (this.pos.subtract(this.parent.pos)).getNormal();

    let LorR = 1;

    for(var j=0; j<2; j++){

      let k1 = maxanglechange/9;

      

      let k2 = (maxlengthchange+1)/9;

      let depthfraction = i/this.biomorph.genome[0];

      let distancefraction = Math.abs((this.pos.subtract(this.parent.pos)).getMagnitude()/(2*maxlengthchange + defaultlength));

      let rotationamount = defaultanglemag+this.biomorph.genome[1]*k1 + this.biomorph.genome[2]*depthfraction*k1 + this.biomorph.genome[3]*distancefraction*k1;            

      let magnitude = defaultlength + this.biomorph.genome[4]*k2 + this.biomorph.genome[5]*depthfraction*k2 + this.biomorph.genome[6]*distancefraction*k2;           

      let rotatedvector = normalizedvector.rotate(rotationamount*LorR);

      let finalvector = new Vector2(rotatedvector.x*magnitude, rotatedvector.y*magnitude);

      let newpos = this.pos.add(finalvector);

      this.biomorph.nodes.push(new Node(newpos, i, this, this.biomorph));

      LorR *= -1;

    }

  }

}

class BioMorph{

  constructor(genome){

    this.genome = genome;

    this.nodes = [];

  }

  create(x,y){

    let v1 = new Vector2(x,y);

    let v2 = new Vector2(x,y+this.genome[4]*((maxlengthchange)/9)+1);

    let base = new Node(v1,0,null,this);

    let startnode = new Node(v2 , -1, base, this);

    this.nodes.push(startnode);

    for(var i=0;i<Math.abs(this.genome[0]); i++){

      for(var j=0;j<this.nodes.length;j++){

        if(this.nodes[j].depth==i-1){

          this.nodes[j].addNodePair(i);

        }

      }

    }

  }
}

function drawBioMorph(b, ctx){

  for(var i=0;i<b.nodes.length;i++){

    let node = b.nodes[i];

    if(node.parent != null){

      

      let nodeparent = b.nodes[i].parent;

      ctx.beginPath(); 

      ctx.moveTo(node.pos.x,node.pos.y);

      ctx.lineTo(node.parent.pos.x,node.parent.pos.y);

      ctx.stroke();

      //window.confirm();

    }
  }
}

function formSubmit(event){

  makeBioMorphFromForm();

  event.preventDefault();

}
function randomButton(event){
  randomizeForm();
  makeBioMorphFromForm();
  event.preventDefault();
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function randomizeForm(){
  var g1 = document.getElementById("gene1").value = getRandomIntInclusive(-9,9);

  var g2 = document.getElementById("gene2").value = getRandomIntInclusive(-9,9);
  var g3 = document.getElementById("gene3").value  = getRandomIntInclusive(-9,9);

  var g4 = document.getElementById("gene4").value  = getRandomIntInclusive(-9,9);

  var g5 = document.getElementById("gene5").value  = getRandomIntInclusive(-9,9);

  var g6 = document.getElementById("gene6").value  = getRandomIntInclusive(-9,9);
  var g7 = document.getElementById("gene7").value  = getRandomIntInclusive(-9,9);

}

function makeBioMorphFromForm(){

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  var genome = getFormArray();

  var biomorph = new BioMorph(genome);
  getName(genome);
  biomorph.create(width/2,height/2);


  drawBioMorph(biomorph,ctx);

}
function getFormArray(){
  var g1 = document.getElementById("gene1").value;

  var g2 = document.getElementById("gene2").value;

  var g3 = document.getElementById("gene3").value;

  var g4 = document.getElementById("gene4").value;

  var g5 = document.getElementById("gene5").value;

  var g6 = document.getElementById("gene6").value;

  var g7 = document.getElementById("gene7").value;
  return [g1,g2,g3,g4,g5,g6,g7];
}
function getName(g){
  var xhr = new XMLHttpRequest();
  var genome = JSON.stringify(g);
  xhr.open('GET', 'getName.php?genome=' + genome, true);
  xhr.onload = function(){
    if(this.status == 200){
      console.log("php returned " + this.responseText);
      document.getElementById("nametitle").innerHTML = this.responseText;
    }
  }
  xhr.send();
}
//Always check for properties and methods, to make sure your code doesn't break in other browsers.

var canvas = document.getElementById('c');

if (canvas.getContext)

{   

  
  const randombutton= document.getElementById('RandomB');

  randombutton.addEventListener('click', randomButton);

  const form = document.getElementById('form');

  form.addEventListener('submit', formSubmit);

  var ctx = canvas.getContext('2d');  

  ctx.canvas.width  = window.innerWidth;

  ctx.canvas.height = window.innerHeight;

  var width = canvas.width;

  var height = canvas.height;

  randomizeForm();

  makeBioMorphFromForm();



}

else 

{   

// canvas-unsupported code here

}