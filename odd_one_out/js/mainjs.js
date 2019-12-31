/** JavaScript Document  
*  @author Nityanand Ojha
*/

const grade = 1;

var fntSize = [40,35,30];
var rubricfntSize = fntSize[grade-1]+"px";
var quesfntSize = (fntSize[grade-1])-5+"px";
var optionFntSize = (fntSize[grade-1])-5+"px";
var fontFace = "Rubric, sans-serif";
var fontFace1 = "Ans, sans-serif";

var rArr = ["Amazing","Brilliant","Excellent","Good","GoodJob","Superb","Welldone","Wonderful"];
const cArr = ["Oops"];
var wArr = [];
var nArr = ["ThinkAgain","LetsTryAgain","LetsGiveAnotherShot","TryOnceAgain"];

var colorObj = {initial:"#fff", select:"rgb(89, 231, 231)"};
var storageArr = [];
var _main;
var _rubricTxt;
var _quesTxt;
var srialNo;
var option;
var correctMC;
var audio;
var animDiv;
var submitBtn;
var answerBtn;
var isBlank = false;
var blankTxtField = null;
var checkSol;
var nextBtn;
var preBtn;
var nextpreNav;
var selMC;
var Qno = 0;

const introDelay = 1000;
var introVid;
//////// G for grammer, V for vocabulary..........
var introType = "";

startIntro();
function startIntro()
{
	introVid = document.createElement("video");
	titleText = document.createElement("div");
	document.body.appendChild(introVid);
	introVid.style.position = "absolute";
	introVid.style.top = "0px";
	
	introVid.addEventListener("ended", onEnd);
	
	//titleText.style.width = "1280px";
	titleText.style.position = "absolute";
	titleText.style.fontFamily = "Title";
	titleText.style.opacity = 0;
	titleText.style.textAlign = "center";
	titleText.style.fontSize = "50px";
	document.body.appendChild(titleText);
	
	if(introType.length==0) 
		introVid.style.visibility = 'hidden';
	
	
	switch (introType.toLowerCase())
	{
		case "g":
			titleText.innerHTML = data.title;
			titleText.style.width = "630px";
			titleText.style.top="400px";
			titleText.style.left="590px";
			titleText.style.color = "#000";
			introVid.src = "../__intro/Title_Grammar.webm"
			introVid.play();
			setTimeout(showTitle, 3000);
			break;
		case "v":
		    titleText.innerHTML = data.title;
			titleText.style.width = "712px";
			titleText.style.top="400px";
			titleText.style.left="205px";
			titleText.style.color = "#000";
			introVid.src = "../__intro/Title_Vocab.webm";				
			introVid.play();
			setTimeout(showTitle, 5000);
			break;
		default:
			feedbackAnim();
			introVid.removeEventListener("ended", onEnd);
			$(titleText).animate({opacity:0},1);
			$(introVid).animate({opacity:0},1, odd_one_out);
			document.getElementById("main").style.backgroundImage = "url('../__images/image/"+spriteOBJ.background+"')";	
		break;
	}
	
	//submitBtn = document.getElementById("submit");
	//answerBtn = document.getElementById("answer");
	//submitBtn.style.visibility = "hidden";
	//answerBtn.style.visibility = "hidden";
}

function showTitle()
{
	$(titleText).animate({opacity:1},1000);
}

function onEnd()
{
	feedbackAnim();
	document.getElementById("main").style.backgroundImage = "url('../__images/image/"+spriteOBJ.background+"')";	
	introVid.removeEventListener("ended", onEnd);
	$(titleText).animate({opacity:0},introDelay);
	$(introVid).animate({opacity:0}, introDelay, odd_one_out);
	
}

function feedbackAnim(){
	_main = getElement(MAINTAG);
	var canvasAnim = document.createElement("canvas");
    _main.appendChild(canvasAnim);
    canvasAnim.width = spriteOBJ.feedbackAnim.frames.width;
    canvasAnim.height = spriteOBJ.feedbackAnim.frames.height;
    canvasAnim.style.position = "absolute";
    canvasAnim.style.top = spriteOBJ.animTop+"px";
    canvasAnim.style.left = spriteOBJ.animLeft+"px";
    canvasAnim.setAttribute("id", "canvasAnim");

	var stage = new spritejs.Stage("canvasAnim");

	var compSprite = new spritejs.SpriteSheet(spriteOBJ.feedbackAnim);
	compSprite.on("error", function(event) {
        console.log("Error ", event);
    });

	feedbackAnim = new spritejs.Sprite(compSprite, "ideal");
    stage.addChild(feedbackAnim);
	
	
	spritejs.Ticker.addEventListener("tick", stage);
}

function odd_one_out(){	
	document.body.removeChild(titleText);
	titleText = null;
	document.body.removeChild(introVid);
	introVid = null;
	
	for(var i=0; i<data.optionArr.length; i++){
		storageArr.push({attempt:0,option:undefined});
	}
	
	addingNextPre();
	checkSol = createTag("div");
	checkSol.setAttribute("id", "checkSolution");
	_main.appendChild(checkSol);
	
	answerBtn = createTag("div");
	answerBtn.setAttribute("id", "answer");
	answerBtn.innerHTML = "SOLUTION";
	checkSol.appendChild(answerBtn);
	
	submitBtn = createTag("div");
	submitBtn.setAttribute("id", "submit");
	submitBtn.innerHTML = "CHECK";
	checkSol.appendChild(submitBtn);
	
	submitBtn.addEventListener("click", onSubmitClick);
	submitBtn.style.pointerEvents = "none";
	submitBtn.style.opacity = 0.5;
	answerBtn.addEventListener("click", onSolutionClick);
	
	srialNo = document.createElement("div");
	audio = document.createElement("audio");
	
	_rubricTxt = document.createElement("div");
	_main.appendChild(_rubricTxt);
	_rubricTxt.innerHTML = data.rubric;
	_rubricTxt.style.background = "#fff";
	_rubricTxt.style.color = "#3d8eb9";
	_rubricTxt.style.padding = 10+"px";
	_rubricTxt.style.borderTopRightRadius = 10+"px";
	_rubricTxt.style.borderBottomRightRadius = 10+"px";
	_rubricTxt.style.marginTop = 15+"px";
	_rubricTxt.style.fontSize = rubricfntSize;
	_rubricTxt.style.fontFamily = fontFace;
	_rubricTxt.style.display = 'inline-block';
	_rubricTxt.style.width = Math.min(_rubricTxt.offsetWidth, 1150)+"px";
	
	audio.src = "Assets/rubric/rubric.ogg";
	audio.play();
	audio.addEventListener("ended", soundComplete);
	
	//soundComplete();
}

function soundComplete(){
	audio.removeEventListener("ended", soundComplete);	
	addQuestion(0);
}

function addingNextPre(){
	nextpreNav = document.createElement("div");
	nextpreNav.className = "nextpreNav";
	nextpreNav.setAttribute("id", "nextpreNav");
	nextpreNav.style.top = 516+"px";
	nextpreNav.style.left = 165+"px";
	_main.appendChild(nextpreNav);
	
	nextBtn = document.createElement("div");
	nextBtn.style.visibility = "hidden";
	nextBtn.setAttribute("id", "nextBtn");
	
	preBtn = document.createElement("div");
	preBtn.style.visibility = "hidden";
	preBtn.setAttribute("id", "preBtn");
	disableObj(preBtn);
	nextpreNav.appendChild(nextBtn);
	nextpreNav.appendChild(preBtn);
	
	nextpreNav.addEventListener("click", onNavigationClick);
}

function onNavigationClick(e){
	
	if(e.target.id == "preBtn")
	{	
		submitBtn.style.pointerEvents = "none";
		submitBtn.style.opacity = 0.5;
		removePrevious();
		addQuestion(--Qno);	
		handlingDoneQues();
		
		if(!Qno)
		{
			disableObj(e.target);
			return;
		}
		enableObj(getElement("nextBtn"));
		
	}else if(e.target.id == "nextBtn")
	{
		submitBtn.style.pointerEvents = "none";
		submitBtn.style.opacity = 0.5;
		Qno++
		removePrevious();
		addQuestion(Qno);
		handlingDoneQues();
		
		if(Qno==data.optionArr.length-1)
		{
			console.log(Qno," dddddddddddddddddddd ",data.optionArr.length-1);
			disableObj(e.target);
			return;
		}
		enableObj(getElement("preBtn"));
	}	
	
}

function disableObj(obj)
{
	obj.style.pointerEvents = "none";
	obj.style.opacity = 0.5;
}

function enableObj(obj)
{
	obj.style.pointerEvents = "auto";
	obj.style.opacity = 1;
}

function getElement(str){
	return (document.getElementById(str));
}

function remove_quesTxt(){
	_main.removeChild(_quesTxt);
	_quesTxt = null;
}

function addQuestion(indx){
	feedbackAnim.gotoAndStop("ideal");
	submitBtn.style.visibility = "visible";
	answerBtn.style.visibility = "visible";
	
	nextBtn.style.visibility = "visible";
	preBtn.style.visibility = "visible";
	
	_quesTxt && remove_quesTxt();
	
	_quesTxt = document.createElement("div")
	_main.appendChild(_quesTxt);
	_quesTxt.style.position = "absolute";
	_quesTxt.innerHTML = data.quesArr[indx].ques;
	
	if(data.quesArr[indx].ques.indexOf("<input")>-1){
		isBlank = true;
		blankTxtField = document.getElementById("txtF");
		blankTxtField.style.fontSize = quesfntSize;
		blankTxtField.style.fontFamily = fontFace1;
		blankTxtField.style.textAlign = "center";
		blankTxtField.style.width =  blankSize[indx] +"px";
	}else{
		isBlank = false;
	}
	console.log(isBlank, " isBlank___")
	_quesTxt.style.top = (_rubricTxt.offsetHeight+70)+"px"
	_quesTxt.style.left = 120+"px"
	_quesTxt.style.backgroundColor = "#fff";
	_quesTxt.style.padding = "10px";
	_quesTxt.style.border = "3px solid #F29B34";
	_quesTxt.style.fontSize = quesfntSize;
	_quesTxt.style.fontFamily = fontFace1;
	
	var cWidth = Math.min(_quesTxt.offsetWidth, 820);
	_quesTxt.style.width = cWidth+"px";
	
	for(var i=0; i<data.optionArr[indx].length; i++){		
		option = document.createElement("div");
		_main.appendChild(option);
		option.style.position = "absolute"
		option.innerHTML = data.optionArr[indx][i];
		option.className = "optionDesign";
		option.style.textAlign = "center";
		option.style.fontFamily = fontFace1;
		option.style.fontSize = optionFntSize;
		option.style.background = "#fff";		
		option.id = "op"+i;
		option.style.cursor = "pointer";
		
		var optionW = Math.max(option.offsetWidth, 150);
		option.style.width = optionW+"px";
		
		option.addEventListener("click", onOPClick);
	}
	
	correctMC = document.getElementById("op"+data.Aarr[Qno]);
	console.log(correctMC.innerHTML, " cccccc");
	
	if(optionHorizontalArrange){
		hArrangingOptions(indx);
	}else{
		vArrangingOptions(indx);
	}
	
	addNumbering(indx);
}

function hArrangingOptions(indx){
	for(var i=0; i<data.optionArr[indx].length; i++){
		var cc = document.getElementById("op"+i)
		
		if(i==0){
			cc.style.left = 120+"px";
		}else{
			var prevOp = document.getElementById("op"+(i-1))
			cc.style.left = parseInt(prevOp.style.left,10)+(prevOp.offsetWidth+spacingBetweenOption)+"px";
		}
		cc.style.top = parseInt(_quesTxt.style.top,10)+(_quesTxt.offsetHeight+optionBelow)+"px";
		
	}
}

function vArrangingOptions(indx){
	for(var i=0; i<data.optionArr[indx].length; i++){
		var cc = document.getElementById("op"+i)
		
		if(i==0){
			cc.style.top = parseInt(_quesTxt.style.top,10)+(_quesTxt.offsetHeight+optionBelow)+"px";
		}else{
			var prevOp = document.getElementById("op"+(i-1))
			cc.style.top = parseInt(prevOp.style.top,10)+(prevOp.offsetHeight+spacingBetweenOption)+"px";
		}
		
		cc.style.left = 100+"px";
		//cc.style.top = parseInt(_quesTxt.style.top,10)+(_quesTxt.offsetHeight+60)+"px";
	}
}

function addNumbering(indx){
	srialNo.style.position = "absolute";
	srialNo.innerHTML = (indx+1);
	srialNo.style.textAlign = "center";
	srialNo.style.fontSize = quesfntSize;
	srialNo.style.fontFamily = fontFace1;
	srialNo.style.border = "3px solid #F29B34";
	srialNo.style.borderRadius = "50%";
	_main.appendChild(srialNo);
	
	srialNo.style.width = 40 +"px";
	srialNo.style.top = _quesTxt.offsetTop+"px";
	srialNo.style.left = (_quesTxt.offsetLeft-70)+"px";
	srialNo.style.backgroundColor = "#fff";
	srialNo.style.padding = "8px";
	console.log(srialNo.offsetWidth)
}

function onOPClick(e){
	selMC = e.target;
	
	for(var i=0; i<data.optionArr[Qno].length; i++){
		var getChild = document.getElementById("op"+i)
		setColor(getChild, colorObj.initial);
	}
	setColor(selMC, colorObj.select);
	
	selMC.ans = selMC.id.replace("op","");
	isBlank && (blankTxtField.value = selMC.innerHTML);
	enableBTN();
}

function onSubmitClick(e){
	if(selMC.ans == data.Aarr[Qno]){
		setColor(selMC, "#009900");
		isBlank && (blankTxtField.style.color = "#009900");
		setTimeout(drawNextQuestion, 4000);
		playFeedback("right");
		//feedbackVid.playCorrectFeedback(postSubmit);
		feedbackAnim.gotoAndPlay("right");
		startStoring();
	}else{
		storageArr[Qno].attempt++;
		setColor(selMC, "#ff0000");
		isBlank && (blankTxtField.style.color = "#ff0000");
		setTimeout(drawIncorrectQuestion, 4000);
		playFeedback("wrong");
		//feedbackVid.playWrongFeedback(postSubmit);
		feedbackAnim.gotoAndPlay("wrong");
	}
	disableOptions();
	disableBTN()
}

function postSubmit(){
	
}

function drawNextQuestion(){
	feedbackAnim.gotoAndStop("ideal");
	
	enableObj(getElement("preBtn"));
	
	if(Qno < data.optionArr.length-1){
		Qno++;
		removePrevious();
		addQuestion(Qno)
	}else{
		disableOptions();
		disableBTN();
		disableObj(nextBtn);
		disableObj(preBtn);
		answerBtn.style.pointerEvents = "none";
		answerBtn.style.opacity = 0.5;
	}

	makeAnimationSpace();
	
	selMC = null;
	disableBTN();
	answerBtn.style.pointerEvents = "auto";
	answerBtn.style.opacity = 1;
	handlingDoneQues();
	
	if(Qno<data.optionArr.length-1)
	{
		enableObj(nextBtn);
	}
	
	if(Qno)
	{
		enableObj(preBtn);
	}
}

function drawIncorrectQuestion(){
	feedbackAnim.gotoAndStop("ideal");
	
	enableOptions();
	answerBtn.style.pointerEvents = "auto";
	answerBtn.style.opacity = 1;
	
	if(Qno<data.optionArr.length-1)
	{
		enableObj(nextBtn);
	}
	
	if(Qno)
	{
		enableObj(preBtn);
	}
	
	for(var i=0; i<data.optionArr[Qno].length; i++){
		setColor(selMC, colorObj.initial);
	}
	isBlank && (blankTxtField.style.color = "#000000");
	isBlank && (blankTxtField.value = "");
	
	if(storageArr[Qno].attempt >= attempt){
		selMC = null;
		playFeedback("correct");
		setColor(correctMC, "#009900");
		
		isBlank && (blankTxtField.value = correctMC.innerHTML);
		isBlank && (blankTxtField.style.color = "#009900");
		disableOptions();
		startStoring();
		
		if(Qno < data.optionArr.length-1){
			setTimeout(drawNextQuestion, 3000);
		}else{
			console.log("activity finished 2222222222222");			
			disableObj(nextBtn);
			disableObj(preBtn);
			answerBtn.style.pointerEvents = "none";
			answerBtn.style.opacity = 0.5;
			setTimeout(makeAnimationSpace, 2000);
		}
		
		disableObj(nextBtn);
		disableObj(preBtn);
		answerBtn.style.pointerEvents = "none";
		answerBtn.style.opacity = 0.5;
	}

	
}

function onSolutionClick(){
	for(var i=0; i<data.optionArr[Qno].length; i++){
		setColor(document.getElementById("op"+i), colorObj.initial);
	}
	setColor(correctMC, "#009900");
	isBlank && (blankTxtField.value = correctMC.innerHTML);
	isBlank && (blankTxtField.style.color = "#009900");
	disableOptions();
	disableBTN();
	
	setTimeout(drawNextQuestion, 3000);
	
	playFeedback("correct");
	startStoring();
}

function startStoring(){
	storageArr[Qno].option = correctMC;
}

function handlingDoneQues(){
	console.log(" 2222222222222222222");
	answerBtn.style.pointerEvents = "auto";
	answerBtn.style.opacity = 1;
		
	if(storageArr[Qno].option != undefined){
		disableOptions();
		setColor(correctMC, "#009900");
		isBlank && (blankTxtField.value = correctMC.innerHTML);
		isBlank && (blankTxtField.style.color = "#009900");
		
		answerBtn.style.pointerEvents = "none";
		answerBtn.style.opacity = 0.5;
	}
}

function removePrevious(){
	for(var i=0; i<data.optionArr[Qno].length; i++){
		var getPrevOption = document.getElementById("op"+i);
		_main.removeChild(getPrevOption);
	}	
}

function playFeedback(val){
	var ranNum;
	switch(val){
		case "right":
			ranNum = parseInt(Math.random()*(rArr.length));
			console.log(ranNum)
			audio.src = "../__audio/"+rArr[ranNum]+".ogg";
		break;
		case "wrong":
			wArr = cArr;
			if(storageArr[Qno].attempt == 1){
				wArr = wArr.concat(nArr);				
			}
			if(storageArr[Qno].attempt == attempt){
				for(var ii=0;ii<nArr.length;ii++){
					if(wArr.indexOf(nArr[ii]) > -1){
						wArr.splice(wArr.indexOf(nArr[ii]),1);
					}
				}
			}
			
			ranNum = parseInt(Math.random()*(wArr.length));
			audio.src = "../__audio/"+wArr[ranNum]+".ogg";
		break
		case "correct":
			audio.src = "../__audio/ThisIsTheCorrectAns.ogg";
		break
		case "completed":
			audio.src = "../__audio/completed.ogg";
		break
	}
	
	audio.play();
}

function makeAnimationSpace(){
	if(Qno){
		enableObj(preBtn);
	}
	console.log(storageArr, " asdf " );
	for(var i=0; i<data.optionArr.length; i++){
		if(storageArr[i].option == undefined){
			return;
		}
	}
	
	var actComDiv = document.createElement("div");
	document.body.appendChild(actComDiv);
	actComDiv.style.position = "absolute";
	actComDiv.style.left = 0+"px";
	actComDiv.style.top = 0+"px";
	actComDiv.style.width = 0+"px";
	actComDiv.style.height = 720+"px";
	actComDiv.style.zIndex = "200";
	actComDiv.style.backgroundColor = "#fff";
	
	animDiv = document.createElement("div");
	actComDiv.appendChild(animDiv);
	animDiv.style.position = "absolute";
	animDiv.style.width = 1280+"px";
	animDiv.style.height = 233+"px";
	animDiv.style.top = 243+"px";
	animDiv.style.overflow = "hidden";
	animDiv.style.backgroundImage = "url(../__images/activityComplete.png)";
	animDiv.style.backgroundSize = "1280px 233px";
	animDiv.style.backgroundRepeat = "no-repeat";	
	$(actComDiv).animate({width:1280},500);	
	setTimeout(completedDelay, 500);
}

function completedDelay(){
	var activityText = document.createElement("img");
	animDiv.appendChild(activityText);
	activityText.src = "../__images/activity.png";
	activityText.setAttribute("id","activityText");	
	var completedText = document.createElement("img");
	animDiv.appendChild(completedText);
	completedText.src = "../__images/completed.png";	
	completedText.setAttribute("id","completedText");		
	playFeedback("completed");
}

function disableBTN(){
	disableObj(nextBtn);
	disableObj(preBtn);
	
	submitBtn.style.pointerEvents = "none";
	submitBtn.style.opacity = 0.5;
	answerBtn.style.pointerEvents = "none";
	answerBtn.style.opacity = 0.5;
}

function enableBTN(){
	submitBtn.style.pointerEvents = "auto";
	submitBtn.style.opacity = 1;
	answerBtn.style.pointerEvents = "auto";
	answerBtn.style.opacity = 1;
	
	if(Qno<data.optionArr.length-1)
	{
		enableObj(nextBtn);
	}
	
	if(Qno)
	{
		enableObj(preBtn);
	}
}

function disableOptions(){	
	for(var k=0; k<data.optionArr[Qno].length; k++){
		var getOp = document.getElementById("op"+k)
		getOp.style.pointerEvents = "none";
	}
}

function enableOptions(){
	for(var k=0; k<data.optionArr[Qno].length; k++){
		var getOp = document.getElementById("op"+k)
		getOp.style.pointerEvents = "auto";
	}
}

function setColor(mc, co){
	mc.style.backgroundColor = co;
}

function getElement(str){
	return (document.getElementById(str));
}

function createTag(str){
	return (document.createElement(str));
}