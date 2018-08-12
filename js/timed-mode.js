const cardList = ['fa-code', 'fa-coffee', 'fa-microchip', 'fa-sitemap', 'fa-file-code', 'fa-bug', 'fa-code-branch', 'fa-bath',
 					'fa-code', 'fa-coffee', 'fa-microchip', 'fa-sitemap', 'fa-file-code', 'fa-bug', 'fa-code-branch', 'fa-bath'];

const nMatchedCards = document.querySelector('.matched-cards');

const deck = document.querySelector('.deck');
const card = document.querySelectorAll('.deck li');

const modalID = document.querySelector('.game-cmpltd_modal');
const closeBtn = document.querySelector('.close-btn');
const retry = document.querySelector('.try-again');

const resetBtn = document.querySelector('#restart-btn');
const timer = document.querySelector('.timer-display');
const movesDisplay = document.querySelector('.moves');

const modalTitle = document.querySelector('.modal-title');
const hard = document.querySelector('#hard');
const medium = document.querySelector('#medium');
const easy = document.querySelector('#easy');
const levelChanger = document.querySelector('#change-lvl_btn');
const levelModal = document.querySelector('.level-modal');
const transitionModal = document.querySelector('.transition-modal');
const timeLeftID = document.querySelector('.time-left_reminder');

let timerID;
let timerIsRunning = false;
let secondsLeft;

let moves = 0;
const openCards = [];
let matchedCards = 0;
let thisButton;

createCards();

hard.addEventListener('click', function(e) {
	thisButton = e.target;
	setGameMode(thisButton);
	levelChanger.setAttribute('style', 'display: block');
});

medium.addEventListener('click', function(e) {
	thisButton = e.target;
	setGameMode(thisButton);
	levelChanger.setAttribute('style', 'display: block');
});

easy.addEventListener('click', function(e) {
	thisButton = e.target;
	setGameMode(thisButton);
	levelChanger.setAttribute('style', 'display: block');
});

levelChanger.addEventListener('click', function(){
	levelModal.setAttribute('style', 'display: block');
});

deck.addEventListener('click', evt => {
	startGame(evt);
});

closeBtn.addEventListener('click', closeModal);

resetBtn.addEventListener('click', function (e){
	resetTimerDisplay(thisButton);
	// timerIsRunning = false;

	while (deck.firstChild){
		deck.removeChild(deck.firstChild);
	}

	openCards.length = 0;
	matchedCards = 0;

	createCards();
	resetMoves();

});

retry.addEventListener('click', function (e){
	resetTimerDisplay(thisButton);

	while (deck.firstChild){
		deck.removeChild(deck.firstChild);
	}

	openCards.length = 0;
	matchedCards = 0;

	createCards();
	resetMoves();
	closeModal();
});

 function createCards() {
	shuffle(cardList);

	for (let i = 0; i < 16; i++){
		const cardElement = document.createElement('li');
		cardElement.classList.add('card', 'fas', cardList[i]);
		deck.appendChild(cardElement);
	}
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

function startGame(event) {

	const clickedCard = event.target;
	startCountdown(timerIsRunning);
	timerIsRunning = true;
	console.log(secondsLeft);

	if (firstCardIsClicked(clickedCard)){
		displayCardSymbol(clickedCard);
		addToOpenedList(clickedCard);

		if (openCards.length === 2){
			compareCards(clickedCard);
			countMoves();
		}
	}
}

function firstCardIsClicked(target) {
	return (target.classList.contains('card') && !target.classList.contains('match') && openCards.length < 2 && !openCards.includes(target));
}

function displayCardSymbol(target) {
	target.classList.toggle('open');
	target.classList.toggle('show');
}

function addToOpenedList(target) {
	openCards.push(target);
}

function compareCards(target) {
	if (openCards[0].className === openCards[1].className){
		openCards[0].classList.add('match');
		openCards[1].classList.add('match');
		openCards.length = 0;
		matchedCards++;
	}
	else {
		setTimeout(() => {
			displayCardSymbol(openCards[0]);
			displayCardSymbol(openCards[1]);
			openCards.length = 0;
		}, 100);
	}

	if (matchedCards === 8){
		endGame();
	}
}

function countMoves() {
	moves++;
	moves === 1 ? movesDisplay.textContent = `${moves} move` : movesDisplay.textContent = `${moves} moves`;
	document.querySelector('.num-of-moves').textContent = `${moves} moves`;

}

function resetMoves() {
	moves = 0;
	movesDisplay.textContent = `${moves} moves`;
}

function updateCongratsTitle(matchedCards) {
	let congratsMessage = matchedCards === 8 ? modalTitle.textContent = 'Superb Job! You are a genius...or extremely fortunate'
						: matchedCards <= 7 && matchedCards > 5 ? modalTitle.textContent = 'Great Job!'
						: matchedCards <= 5 &&  matchedCards >= 2 ? modalTitle.textContent = 'Nice Job!'
						: matchedCards > 1 ? modalTitle.textContent = 'Good Try!'
						: modalTitle.textContent = 'Sorry, you were too slow this time';

	return congratsMessage;
}

function endGame() {
	updateCongratsTitle(matchedCards);
	nMatchedCards.textContent = `${matchedCards <= 1 ? `${matchedCards} card`: `${matchedCards} cards`}`;

	modalID.style.display = 'block';
}

function closeModal() {
	modalID.style.display = 'none';
}

function setGameMode(clickedButton) {
	levelModal.style.display = 'none';

	if (clickedButton === hard){
		timeLeft = 15;
		timeLeftID.textContent = '15 seconds';
		timer.textContent = '0:15';
		startMode();
	}

	else if (clickedButton === medium){
		timeLeft = 25;
		timeLeftID.textContent = '25 seconds';
		timer.textContent = '0:25';

		startMode();

	}

	else {
		timeLeft = 35;
		timeLeftID.textContent = '35 seconds';
		timer.textContent = '0:35';

		startMode();

	}
}

function startMode() {
	transitionModal.style.display = 'block';

	setTimeout(function() {
		transitionModal.style.display = 'none';
	}, 3000);
}

function countdown(timeLeft) {

	const now = Date.now();
	const then = now + timeLeft * 1000;
	displayTimeLeft(timeLeft);

	timerID = setInterval(() => {
			secondsLeft = Math.round((then - Date.now()) / 1000);
			if (secondsLeft < 0){
				clearInterval(timerID);
				return;
			}

		displayTimeLeft(secondsLeft);
		if (secondsLeft === 0){
		endGame();
		updateCongratsTitle(matchedCards);

	}
	}, 1000);
}

function displayTimeLeft(seconds){
	timer.textContent = `0:${seconds}`;
}

function startCountdown(timerIsRunning) {
	if (!timerIsRunning){
		countdown(timeLeft);
	}
}

function resetTimerDisplay(button) {
	clearInterval(timerID);
	timerIsRunning = false;
	button === hard ? timer.textContent = '0:15': button === medium ? timer.textContent = '0:25': timer.textContent = '0:35';
}

//TODO add countdown functionality
//TODO add keyboard shorcuts
