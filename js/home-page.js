const helpModalID = document.querySelector('.help-modal');
const helpButton = document.querySelector('#help-btn');
const closeModalBtn = document.querySelector('.close-modal');

helpButton.addEventListener('click', function() {
	helpModalID.setAttribute('style', 'display: block');
});

closeModalBtn.addEventListener('click', function() {
	helpModalID.setAttribute('style', 'display: none');
});
