/*
 * Store icon classes in an array
 */
 const cardList = ['fa-code', 'fa-coffee', 'fa-microchip', 'fa-sitemap', 'fa-file-code', 'fa-bug', 'fa-code-branch', 'fa-bath',
 					'fa-code', 'fa-coffee', 'fa-microchip', 'fa-sitemap', 'fa-file-code', 'fa-bug', 'fa-code-branch', 'fa-bath'];

const papaStar = document.querySelector('.stars');
const page = document.querySelector('.container');
const deck = document.querySelector('.deck');
const card = document.querySelectorAll('.deck li');
const modalID = document.querySelector('.game-cmpltd_modal');
const closeBtn = document.querySelector('.close-btn');
const resetBtn = document.querySelector('#restart-btn');
const retry = document.querySelector('.retry');
const timer = document.querySelector('.timer-display');
const movesDisplay = document.querySelector('.moves');
const modalTitle = document.querySelector('.modal-title');

let timerID;
let moves = 0;
let seconds = 0;
let timerRunning = false;
let mins, remainderSeconds;
const openCards = [];
let matchedCards = 0;
let starsLength, stars, starRating;

createCards();
createStars();
rateGamePlay();

deck.addEventListener('click', evt => {
	startGame(evt);
});

closeBtn.addEventListener('click', closeModal);

resetBtn.addEventListener('click', function (e){
	while (deck.firstChild){
		deck.removeChild(deck.firstChild);
	}

	openCards.length = 0;
	matchedCards = 0;

	createCards();
	resetTimer();
	resetMoves();
	resetStars();
});

retry.addEventListener('click', function (e){
	modalID.setAttribute('style', 'display: none');
	while (deck.firstChild){
		deck.removeChild(deck.firstChild);
	}

	openCards.length = 0;
	matchedCards = 0;

	createCards();
	resetTimer();
	resetMoves();
	resetStars();
});

/**
* @description Creates the cards for the game
*/
 function createCards() {
	shuffle(cardList);

	for (let i = 0; i < 16; i++){
		const cardElement = document.createElement('li');
		cardElement.classList.add('card', 'fas', cardList[i]);
		deck.appendChild(cardElement);
	}
}

/**
* @description Creates the stars 
*/
function createStars() {
	for (let j = 0; j < 5; j++){
		const starElement = document.createElement('li');
		starElement.classList.add('fas', 'fa-star');
		papaStar.appendChild(starElement);
	}

	stars = document.querySelectorAll('.fa-star');
}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

/**
* @description Processes game logic once a card is clicked
* @param {object} event - click event
*/
function startGame(event) {
	const clickedCard = event.target;
	startTimer(timerRunning);
	timerRunning = true;
	//check if a card is clicked and prevent it being clicked agiain
	if (firstCardIsClicked(clickedCard)){
		clickedCard.classList.toggle('open');
		displayCardSymbol(clickedCard);
		addToOpenedList(clickedCard);

		if (openCards.length === 2){
			compareCards(clickedCard);
			countMoves();
			rateGamePlay(moves);
			document.querySelector('.num-of-moves').textContent = `${moves} moves`;
		}
	}
}
// timer function adapted from various countdown examples. Main source: https://www.youtube.com/watch?v=kOcFZV3c75I
function startTimer(timerRunning) {
	if (!timerRunning){
		startTiming();
	}
}

function startTiming() {
	start();
	timerID = setInterval(start, 1000);
}

function start(){
	seconds++;
	mins = Math.floor(seconds / 60);
	remainderSeconds = seconds % 60;
	timer.textContent = `${mins}:${remainderSeconds < 10 ? '0' : '' }${remainderSeconds}`;
}

function firstCardIsClicked(target) {
	return (target.classList.contains('card') && !target.classList.contains('match') && openCards.length < 2 && !openCards.includes(target));
}

function displayCardSymbol(target) {
	target.classList.toggle('show');
}

function addToOpenedList(target) {
	openCards.push(target);
}
/**
* @description Compare clicked cards
* @param {object} target - clicked DOM item
*/
function compareCards(target) {
	if (openCards[0].className === openCards[1].className){
		openCards[0].classList.add('match');
		openCards[1].classList.add('match');

		openCards.length = 0;
		matchedCards++;
	}
	else {
		//ensure wrong match animation is done before turning the card back over
		openCards[0].classList.toggle('wrong-guess');
		openCards[1].classList.toggle('wrong-guess');
		setTimeout(() => {
			displayCardSymbol(openCards[0]);
			displayCardSymbol(openCards[1]);
			openCards[0].classList.toggle('open');
			openCards[1].classList.toggle('open');
			//remove the wrong guess animation on the clicked cards
			openCards[0].classList.remove('wrong-guess');
			openCards[1].classList.remove('wrong-guess');
			openCards.length = 0;
		}, 600);
	}
	//end game once all cards are matched
	if (matchedCards === 8){
		stopTimer();
		endGame();
	}
}

function countMoves() {
	moves++;
	moves === 1 ? movesDisplay.textContent = `${moves} move` : movesDisplay.textContent = `${moves} moves`;
}

function resetMoves() {
	moves = 0;
	movesDisplay.textContent = `${moves} moves`;
}

function stopTimer() {
	clearInterval(timerID);
	document.querySelector('.time-spent').textContent = `${mins < 2 ? mins + ' minute' : mins + ' minutes'} ${remainderSeconds < 10 ? '0' : '' }${remainderSeconds} seconds`;
}

function resetTimer() {
	clearInterval(timerID);
	seconds = 0;
	timerRunning = false;
	timer.textContent = `0:00`;
}
/**
* @description Rate game play based on number of moves. Function is called each time card is clicked so the stars are updated in real time
* @param {integer} nMoves - Number of moves made by the user
*/
function rateGamePlay(nMoves) {
	if (nMoves > 9 && nMoves < 12){
		stars[4].setAttribute('style', 'color: #555');

		starRating = 4;
	}
	else if (nMoves >= 12 && nMoves < 20){
		stars[4].setAttribute('style', 'color: #555');
		stars[3].setAttribute('style', 'color: #555');

		starRating = 3;
	}
	else if (nMoves >=20 && nMoves < 25){
		stars[4].setAttribute('style', 'color: #555');
		stars[3].setAttribute('style', 'color: #555');
		stars[2].setAttribute('style', 'color: #555');

		starRating = 2;
	}
	else if(nMoves >= 25){
		for (let k = 4; k > 0; k--){
			stars[k].setAttribute('style', 'color: #555');
		}

		starRating = 1;
	}
	else {
		starRating = 5;
	}

	updateCongratsTitle(starRating);
	document.querySelector('.num-of-stars').textContent = `${starRating}`;
}

function updateCongratsTitle(sRating) {
	let congratsMessage = sRating === 5 ? modalTitle.textContent = 'Superb Job!'
						: sRating === 4 ? modalTitle.textContent = 'Great Job!'
						: sRating === 3 ? modalTitle.textContent = 'Nice Job!'
						: sRating === 2 ? modalTitle.textContent = 'Good Try!'
						: modalTitle.textContent = 'Found your keys yet? ;)';

	return congratsMessage;
}

function resetStars() {
	while (papaStar.firstChild){
		papaStar.removeChild(papaStar.firstChild);
	}

	createStars();
}

function endGame() {
	modalID.style.display = 'block';
}

function closeModal() {
	modalID.style.display = 'none';
}

