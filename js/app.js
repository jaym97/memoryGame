/*
 * Create a list that holds all of your cards
 */
 const cardList = ['fa-code', 'fa-coffee', 'fa-microchip', 'fa-sitemap', 'fa-file-code', 'fa-bug', 'fa-code-branch', 'fa-bath',
 					'fa-code', 'fa-coffee', 'fa-microchip', 'fa-sitemap', 'fa-file-code', 'fa-bug', 'fa-code-branch', 'fa-bath'];

const deck = document.querySelector('.deck');
const card = document.querySelectorAll('.deck li');
const modalID = document.querySelector('.game-cmpltd_modal');
const closeBtn = document.querySelector('.close-btn');
const openCards = [];
let matchedCards = 0;
let moves = 0;
createCards();
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

deck.addEventListener('click', event => {
	const clickedCard = event.target;
	if (firstCardIsClicked(clickedCard)){
		displayCardSymbol(clickedCard);
		addToOpenedList(clickedCard);
		if (openCards.length === 2){
			compareCards(clickedCard);
			countMoves();
			console.log(moves);
			document.querySelector('.num-of-moves').textContent = `${moves} moves`;
		}
	}
});

closeBtn.addEventListener('click', closeModal);

function displayCardSymbol(target) {
	target.classList.toggle('open');
	target.classList.toggle('show');
}

function addToOpenedList(target) {
	openCards.push(target);
}

function firstCardIsClicked(target) {
	return (target.classList.contains('card') && !target.classList.contains('match') && openCards.length < 2 && !openCards.includes(target));
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
		}, 1000);
	}

	if (matchedCards === 8){
		endGame();
	}
}

function countMoves() {
	moves++;
	const movesDisplay = document.querySelector('.moves');
	movesDisplay.textContent = moves;
}

function endGame() {
	modalID.style.display = 'block';
}

function closeModal() {
	modalID.style.display = 'none';
}