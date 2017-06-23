$(document).ready(function() {
	$('input#switch').prop('checked', true); // game is off
	$('div#strict-light').css({'background-color': '#720e03'});

// ----------------------VARIABLES------------------------------------
	var gameOn = false,
		isPlaying = false,
		isStrict = false,
		count = 0,
		sequence = [],
		userInput = [],
		delay;

	//sounds
	var sounds = ['https://s3.amazonaws.com/freecodecamp/simonSound1.mp3',
				'https://s3.amazonaws.com/freecodecamp/simonSound2.mp3', 
				'https://s3.amazonaws.com/freecodecamp/simonSound3.mp3',
				'https://s3.amazonaws.com/freecodecamp/simonSound4.mp3'];	

// ----------------BUTTONS / CLICK EVENTS ----------------------------

	//on-off switch
	$('div.slider').on('click', function() {
		var turnOn = $('input#switch').prop('checked');
		
		if (turnOn) {
			gameOn = true;
			//turn on the screen
			$('div#screen').css({'background-color': '#242422'});
			$('div#screen p').text(count);
		}
		else {
			gameOn = false;
			isPlaying = false;
			isStrict = false;
			count = 0;
			sequence = [];
			userInput = [];
			$('div.colbutton').off('click');
		
			//turn off the screen and lights
			$('div#strict-light').css({'background-color': '#720e03'});
			$('div#screen').css({'background-color': '#3e3e3b'});
			$('div#screen p').empty();
		}	
	});

	// start button
	$('div#start-btn').on('click', function() {
		//console.log(gameOn);
		if (gameOn && !isPlaying) {
			isPlaying = true;
			resetWin();
			$('div#screen p').text(count);
			$('div.colbutton').off('click');
					
			//start the game
			playGame();
		}
		else if (gameOn && isPlaying) {
			//reset
			var delayed = 1000; 
			isPlaying = false;
			count = 0;
			sequence = [];
			userInput = [];
			clearInterval(delay);
			$('div#screen p').text(count);
			$('div.colbutton').off('click');
			setTimeout(function() {
				isPlaying = true;
				playGame();	
			}, delayed);
		}
		else {
			console.log('do nothing');
		}
	}); 

	//strict button
	$('div#strict-btn').on('click', function() {
		if (gameOn && !isStrict) {
			isStrict = true;
			resetWin();
			
			//start the game in strict mode
			$('div#strict-light').css({'background-color': '#f82b16'});
		}
		else {
			isStrict = false;
			$('div#strict-light').css({'background-color': '#720e03'});
		}
	});


//-------------------------GAMEPLAY--------------------------------------

	//gameplay
	function playGame(){
		
		if (gameOn && isPlaying) {

			userInput = [];
			//add a random number to sequence
			updateSequence(sequence);
			count = sequence.length;
			$('div#screen p').text(count);
			
			playSequence(sequence);

			// add event listener
			listenUser(0, playGame, playLast);
		}
		else {
			isPlaying = false;
			count = 0;
			sequence = [];
			userInput = [];
		}	
	}

	//repeats the last sequence if user input was wrong
	function playLast() {
		if (gameOn && isPlaying) {
			userInput = [];
			playSequence(sequence);

			// add event listener
			listenUser(0, playGame, playLast);
		}
		else {
			isPlaying = false;
			count = 0;
			sequence = [];
			userInput = [];
		}	
	}

//-----------------------STRICT MODE--------------------------------------------
	function strictMode() {
		//restart from beginning
		counter = 0;
		sequence = [];
		$('div#screen p').text(count);
		playGame();
	}

//--------------------------HELPERS----------------------------------------------
	
	// generates a random number from range [0,3]
	function randomChoice() {
		return Math.floor(Math.random() * 4);
	}

	//appends number to the sequence
	function updateSequence(arr) {
		arr.push(randomChoice());
	}

	// plays sequence of buttons + sounds
	function playSequence(arr) {
		if (gameOn && isPlaying) {
			var i = 0;
			delay = setInterval(function() {
				showLights(arr[i]);

				i++;
				if (i >= arr.length) {
					clearInterval(delay);
				}
			}, 1000); 
		}	
	}

	// animate the lighting of buttons
	function showLights(elem) {
		if (gameOn && isPlaying) {
			//console.log('Show Lights started');
			var button = $('div[data-label="' + elem + '"]');
			button.addClass('highlight');
			playSound(elem);
			setTimeout(function() {
				button.removeClass('highlight');
			}, 500);
		}	
	}

	//add sounds (audio) to buttons
	function playSound(elem) {
		if (gameOn && isPlaying) {
			var audio = '<audio src="'+ sounds[elem] + '" autoplay></audio>';
			$('div[data-label="' + elem + '"]').html(audio);
		}	
	}

	// plays the sound of fail
	function playFail(elem) {
		if (gameOn && isPlaying) {
			var audio = '<audio src="audio/Sad_Trombone.mp3" autoplay></audio>';
			$('div[data-label="' + elem + '"]').html(audio);
		}	
	}

	//plays the sound of win
	function playWin() {
		var audio = '<audio src="audio/Ta_Da.mp3" autoplay></audio>';
		$('div.speaker').html(audio);
	}

	// checks for a win
	function isWon() {
		if (sequence.length === 20) { 
			$('div#win').removeClass('hidden');
			$('div#win h2').fadeOut(4000);
			setTimeout(function() {
				playWin();	
			}, 750);
			
			//reset counter, sequence, userInput, isPlaying, isStrict
			count = 0;
			sequence = [];
			userInput = [];
			isPlaying = false;
			$('div#screen p').text(count);
			$('div#strict-light').css({'background-color': '#720e03'});
		}
		else {
			setTimeout(function() {
				playGame();	
			}, 1500);
		}
	}
	
	// listen, record and validate a user input
	function listenUser(index) {
		
		$('div.colbutton').on('click', function() {
			var num = $(this).attr('data-label');
			playSound(num);

			$('div.colbutton').off('click');
			if (num == sequence[index]) {
			 	userInput.push(num);
			 	index++;
			 	(index >= sequence.length) ? isWon(): listenUser(index);
			}
			else {
			 	$('div#screen p').text('!!');
			 	setTimeout(function() {
			 		playFail(num);
			 	}, 1000);

			 	if (isStrict) {
			 		setTimeout(function() {
			 			$('div#screen p').text(count);
			 			strictMode();
			 		}, 4000);
			 	}
			 	else {
			 		setTimeout(function() {
			 			$('div#screen p').text(count);
			 			playLast();
			 		}, 4000);
			 	}		
			}	
		});
	}

	// resets the win message
	function resetWin() {
		$('div#win').addClass('hidden');
		$('div#win h2').show();
	}

}); // end of document.ready

