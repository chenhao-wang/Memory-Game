/*
 * Create a list that holds all of your cards
 */
const symbols = ['fa-diamond', 'fa-diamond', 'fa-paper-plane-o', 'fa-paper-plane-o', 
				'fa-anchor', 'fa-anchor', 'fa-bolt', 'fa-bolt',
				'fa-cube', 'fa-cube', 'fa-leaf', 'fa-leaf', 
				'fa-bicycle', 'fa-bicycle', 'fa-bomb', 'fa-bomb'];

let deck = $('.deck'),
    moveDisplay = $('.moves'),
    restart = $('.restart'),
    ratingStars = $('i'),
    timer,
    totalTime,
    opened = [],
    moves = 0,
    match = 0,
    gameStarted,
    gameCardsPairs = symbols.length / 2,
    rank2stars = gameCardsPairs + 12,
    rank1stars = gameCardsPairs + 18;
/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */
 // Initial Game
function initGame() {
	var cards = shuffle(symbols);
    moves = 0;
    match = 0;
    gameStarted = false;
    clearInterval(timer);
    deck.empty();
    moveDisplay.html(moves);
    $('.timer').html("00:00");

    ratingStars.removeClass('fa-star-o').addClass('fa-star');
	for (var i = 0; i < cards.length; i++) {
		deck.append($('<li class="card"><i class="fa ' + cards[i] + '"></i></li>'))
	}
    addCardListener();
};

// Restart Game
restart.bind('click', function() {
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Are you sure?',
        text: "Your progress will be Lost!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#02ccba',
        cancelButtonColor: '#f95c3c',
        confirmButtonText: 'Yes, Restart Game!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            initGame();
        }
    })
});

// End Game
function endGame(moves, score) {   
    swal({
        allowEscapeKey: false,
        allowOutsideClick: false,
        title: 'Congratulations!',
        text: 'With ' + moves + ' Moves, in ' + totalTime + ' time and ' + score + ' Stars.!',
        type: 'success',
        confirmButtonColor: '#02ccba',
        confirmButtonText: 'Play again!'
    }).then(function(isConfirm) {
        if (isConfirm) {
            initGame();
        }
    })
}

// Set Rating and final Score
function setRating(moves) {
    var rating = 3;
    if (moves >= rank2stars && moves < rank1stars) {
        ratingStars.eq(2).removeClass('fa-star').addClass('fa-star-o');
        rating = 2;
    } else if (moves >= rank1stars) {
        ratingStars.eq(1).removeClass('fa-star').addClass('fa-star-o');
        rating = 1;
    }
    return rating;
};

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
 // card listener
function addCardListener() {
    deck.find('.card:not(".match, .open")').bind('click' , function() {
        if (!gameStarted) {
            gameTimer();
            gameStarted = true;
        }
        let selected = $(this);
        if (opened.length > 1 || selected.hasClass('open') || selected.hasClass('match')) return;
        var card = selected.html();
        displayCard(selected);
        addCardToList(card);
        if (opened.length > 1) {
            if (card === opened[0]) {
                lockTheMatch();
            }
            removeCards();
            displayMove();
        }
        setRating(moves);
        if (match == symbols.length) {
            setTimeout(function() {
                endGame(moves, setRating(moves));
            }, 300);
        }
    });
}

function displayCard(selected) {
    selected.addClass('open show');
}

function addCardToList(card) {
    opened.push(card)
}

function lockTheMatch() {
    match += 2;
    deck.find('.open').addClass('match');
}

function removeCards() {
    setTimeout(function() {
        deck.find('.open').removeClass('open show');
    }, 300);
    opened.length = 0;
}

function displayMove() {
    moves++;
    moveDisplay.html(moves);
}
// set game count timer
function gameTimer() {
    let startTime = new Date().getTime();
    timer = setInterval(function() {
        var now = new Date().getTime();
        var elapsed = now - startTime;
        var minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((elapsed % (1000 * 60)) / 1000);
        if (seconds < 10) {
            seconds = "0" + seconds;
        }
        if (minutes < 10) {
            minutes = "0" + minutes;
        }
        totalTime = minutes + ":" + seconds;
        $(".timer").html(totalTime);
    }, 1000);
}

initGame();