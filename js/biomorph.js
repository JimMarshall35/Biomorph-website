//global variables

const defaultanglemag = 30;
const defaultlength = 20;
const defaultdepth = 10;
const maxlengthchange = 28;
const maxanglechange = 180;
//const sizingconst = 21.39285714285714;
var biomorph;
var width;
var height;

//---------- classes ----------//

class Vector2 {

	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	subtract(v) {
		return new Vector2(this.x - v.x, this.y - v.y);
	}

	add(v) {
		return new Vector2(this.x + v.x, this.y + v.y);
	}

	rotate(angle) {
		let x1 = this.x;
		let y1 = this.y;
		let x = Math.cos(angle) * x1 - Math.sin(angle) * y1;
		let y = Math.sin(angle) * x1 + Math.cos(angle) * y1;
		return new Vector2(x, y);
	}

	getMagnitude() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	}

	getNormal() {
		let magnitude = this.getMagnitude();
		return new Vector2(this.x / magnitude, this.y / magnitude);
	}
	Lerp(v,t){
		var retx = this.x * (1 - t) + v.x*t;
		var rety = this.y * (1 - t) + v.y*t;
		return Vector2(retx, rety);
	}
}

class Node {

	constructor(pos, depth, parent, biomorph) {
		this.pos = pos;
		this.depth = depth;
		this.parent = parent;
		this.biomorph = biomorph;
	}

	addNodePair(i) { // adds a new pair of nodes to a node using the genome of that nodes biomorph
		let normalizedvector = (this.pos.subtract(this.parent.pos)).getNormal();
		let LorR = 1;
		for (var j = 0; j < 2; j++) {
			let k1 = maxanglechange / 9;
			let k2 = (maxlengthchange + 1) / 9;
			let depthfraction = i / this.biomorph.genome[0];
			let distancefraction = Math.abs((this.pos.subtract(this.parent.pos)).getMagnitude() / (2 * maxlengthchange + defaultlength));
			let rotationamount = defaultanglemag + this.biomorph.genome[1] * k1 + this.biomorph.genome[2] * depthfraction * k1 + this.biomorph.genome[3] * distancefraction * k1;
			let magnitude = defaultlength + this.biomorph.genome[4] * k2 + this.biomorph.genome[5] * depthfraction * k2 + this.biomorph.genome[6] * distancefraction * k2;
			let rotatedvector = normalizedvector.rotate(rotationamount * LorR);
			let finalvector = new Vector2(rotatedvector.x * magnitude, rotatedvector.y * magnitude);
			let newpos = this.pos.add(finalvector);
			this.biomorph.nodes.push(new Node(newpos, i, this, this.biomorph));
			LorR *= -1;
		}
	}
}

class BioMorph {

	constructor(genome) {
		this.genome = genome;
		this.nodes = [];
		this.currentscale = 1;
		this.scalingfactor = 0.2;
	}
	addSamePosNodePair(i){

	}
	create(x, y) {
		let v1 = new Vector2(x, y);
		let v2 = new Vector2(x, y + this.genome[4] * ((maxlengthchange) / 9) + 1);
		let base = new Node(v1, 0, null, this);
		let startnode = new Node(v2, -1, base, this);
		this.nodes.push(startnode);
		for (var i = 0; i < Math.abs(this.genome[0]); i++) {
			for (var j = 0; j < this.nodes.length; j++) {
				if (this.nodes[j].depth == i - 1) {
					this.nodes[j].addNodePair(i);
				}
			}
		}
		this.getCentroid();
	}
	drawBioMorph(ctx) {

		ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.strokeStyle = "Black";
		for (var i = 1; i < this.nodes.length; i++) {
			let node = this.nodes[i];
			if (node.parent != null) {
				let nodeparent = this.nodes[i].parent;
				ctx.beginPath();
				ctx.moveTo(node.pos.x, node.pos.y);
				ctx.lineTo(node.parent.pos.x, node.parent.pos.y);
				ctx.stroke();
				ctx.closePath();
			}
		}
	}
	drawCentroid(ctx){
		ctx.strokeStyle = "Crimson";
		ctx.beginPath();
		ctx.moveTo(this.centroid.x + 5, this.centroid.y);
		ctx.lineTo(this.centroid.x - 5, this.centroid.y);
		ctx.stroke();
		ctx.moveTo(this.centroid.x, this.centroid.y + 5);
		ctx.lineTo(this.centroid.x, this.centroid.y - 5);
		ctx.stroke();
		ctx.closePath();
	}
	getCentroid(){
		var xtotal = 0;
		var ytotal = 0;
		var nodescount = this.nodes.length;
		for(var i = 0; i < nodescount; i++){
			xtotal += this.nodes[i].pos.x;
			ytotal += this.nodes[i].pos.y;
		}
		this.centroid = new Vector2(xtotal/nodescount, ytotal/nodescount);
		for(var i = 0; i < nodescount; i++){
			this.nodes[i].initvectocentroid = this.nodes[i].pos.subtract(this.centroid);
		}
	}
	zoom(i){
		this.currentscale += -i * this.scalingfactor;
		if(this.currentscale < 0){
			this.currentscale = 0;
		}
		for(var i = 0; i < this.nodes.length; i++){
			this.nodes[i].pos = this.centroid.add(new Vector2(this.nodes[i].initvectocentroid.x * this.currentscale, this.nodes[i].initvectocentroid.y * this.currentscale));
		}
		this.drawBioMorph(ctx);
	}
}

//---------- helpers ----------//

function sizeCanvas() {
	canvas.style.width = '100%';
	canvas.style.height = '100%';
	canvas.width = canvas.offsetWidth;
	canvas.height = canvas.offsetHeight;
	width = canvas.width;
	height = canvas.height;
	//maxlengthchange = canvas.height / sizingconst;
}

function checkArrayInts(a){
	for(var i=0; i<a.length; i++){
		if(a[i] % 1 != 0){
			return false;
		}
	}
	return true;
}

function getRandomIntInclusive(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive 
}

function randomizeForm() {
	document.getElementById("gene1").value = getRandomIntInclusive(-9, 9);
	document.getElementById("gene2").value = getRandomIntInclusive(-9, 9);
	document.getElementById("gene3").value = getRandomIntInclusive(-9, 9);
	document.getElementById("gene4").value = getRandomIntInclusive(-9, 9);
	document.getElementById("gene5").value = getRandomIntInclusive(-9, 9);
	document.getElementById("gene6").value = getRandomIntInclusive(-9, 9);
	document.getElementById("gene7").value = getRandomIntInclusive(-9, 9);
}

function setForm(g){
	document.getElementById("gene1").value = g[0];
	document.getElementById("gene2").value = g[1];
	document.getElementById("gene3").value = g[2];
	document.getElementById("gene4").value = g[3];
	document.getElementById("gene5").value = g[4];
	document.getElementById("gene6").value = g[5];
	document.getElementById("gene7").value = g[6];
}

function makeBioMorphFromForm(getname=true) {
	
	var genome = getFormArray();
	if(checkArrayInts(genome)){
		biomorph = new BioMorph(genome);
		if(getname){
			getName(genome);
		}
		
		biomorph.create(width / 2, height / 2);
		biomorph.drawBioMorph(ctx);
	}
	else{
		window.alert("genes must be ints");
	}
}

function getFormArray() {
	var g1 = document.getElementById("gene1").value;
	var g2 = document.getElementById("gene2").value;
	var g3 = document.getElementById("gene3").value;
	var g4 = document.getElementById("gene4").value;
	var g5 = document.getElementById("gene5").value;
	var g6 = document.getElementById("gene6").value;
	var g7 = document.getElementById("gene7").value;
	return [g1, g2, g3, g4, g5, g6, g7];
}

//---------- AJAX functions ----------//

function getName(g) {
	var xhr = new XMLHttpRequest();
	var genome = JSON.stringify(g);
	xhr.open('GET', 'getName.php?genome=' + genome, true);
	xhr.onload = function() {
		if (this.status == 200) {
			console.log("php returned " + this.responseText);
			document.getElementById("nametitle").innerHTML = this.responseText;
		}
	}
	xhr.send();
}

function insertRow(user, name) {
	let a = getFormArray();
	if(checkArrayInts(a)){
		var xhr = new XMLHttpRequest();
		var genome = JSON.stringify(a);
		var current_datetime = new Date();
		let formatted_date = current_datetime.getFullYear() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getDate() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds()
		console.log(user);
		console.log(name);
		console.log(genome);
		console.log(formatted_date);
		xhr.open('GET', 'insert.php?genome=' + genome +
			'&name=' + name +
			'&creator=' + user +
			'&datetime=' + formatted_date, true);
		xhr.onreadystatechange = function() {
			console.log(this.readyState);
		}
		xhr.onload = function() {
			if (this.status == 200) {
				console.log("php returned " + this.responseText);
				getLastTen();
				
			} else {
				console.log(this.status);
			}
		}
		xhr.send();
	}
	else{
		window.alert("genes must be ints");
	}
}

function getLastTen(){
	var xhr = new XMLHttpRequest();
	xhr.open('GET', 'gettopten.php',true);
	xhr.onload = function(){
		var lasttenlist = JSON.parse(this.responseText);
		let htmlstring = "";
		for(var i=0; i<lasttenlist["topten"].length; i++){
			htmlstring += ' <option value="'+lasttenlist["topten"][i].genome +'" ondblclick="listItemDoubleClickHandler(this)">' + lasttenlist["topten"][i].name 
		}
		document.getElementById("selectBox").innerHTML = htmlstring;
		//document.getElementById("nametitle").innerHTML = lasttenlist["topten"][0].name;
		setForm(lasttenlist["topten"][0].genome)
		makeBioMorphFromForm()
	}
	xhr.send();
}

//---------- event handlers ----------//

function listItemDoubleClickHandler(obj){
	let genome = JSON.parse("["+obj.value+"]");
	setForm(genome);
	//getName(genome);
	//document.getElementById("nametitle").innerHTML = obj.innerHTML;
	makeBioMorphFromForm();
	event.preventDefault();
}

function formSubmitHandler(event) {
	makeBioMorphFromForm();
	event.preventDefault();
}

function randomButtonHandler(event) {
	randomizeForm();
	makeBioMorphFromForm();
	event.preventDefault();
}

function nameEnterButtonHandler() {
	var usernameinput = document.getElementById('user').value;
	var nameinput = document.getElementById('name').value;
	if (document.getElementById("nametitle").innerHTML == '<h1 class="heading">unnamed biomorph</h1>') {
		if (usernameinput.value != "" && nameinput != "") {
			insertRow(usernameinput, nameinput);
			document.getElementById('name').value = "";

		} else {
			window.alert("enter a name and username");
		}
	} else {
		window.alert("biomorph already named");
	}
}

function resizeHandler() {
	sizeCanvas();
	makeBioMorphFromForm();
}

//---------- first executed code ----------//

var canvas = document.getElementById('c');

if (canvas.getContext)
{
	var number_1 = getLastTen();
	window.addEventListener("wheel", event => {
    	const delta = Math.sign(event.deltaY);
    	biomorph.zoom(delta);
	});	
	const nameenterbutton = document.getElementById('entername');
	nameenterbutton.addEventListener('click', nameEnterButtonHandler);
	const randombutton = document.getElementById('RandomB');
	randombutton.addEventListener('click', randomButtonHandler);
	const form = document.getElementById('form');
	form.addEventListener('submit', formSubmitHandler);
	var ctx = canvas.getContext('2d');
	sizeCanvas();
} else

{
	window.alert("canvas not supported");
}