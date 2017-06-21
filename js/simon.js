$(document).ready(function() {
	$('input#switch').prop('checked', true); // game is off
	$('div#strict-light').css({'background-color': '#720e03'});

// ----------------------VARIABLES------------------------------------
	var gameOn = false,
		isPlaying = false,
		isStrict = false,
		playingAudio = false,
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

		//console.log(on);
		if (turnOn) {
			console.log('Starting a game!');
			gameOn = true;
			console.log('Game: ', gameOn);
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
			console.log('Game: ', gameOn);
			//turn off the screen and lights
			$('div#strict-light').css({'background-color': '#720e03'});
			$('div#screen').css({'background-color': '#3e3e3b'});
			$('div#screen p').empty();
		}	
	});

	// start button
	$('div#start-btn').on('click', function() {
		//console.log(gameOn);
		if (gameOn && !isPlaying && !isStrict) {
			isPlaying = true;
			
			resetWin();
			$('div#screen p').text(count);
			$('div.colbutton').off('click');
			//console.log('game');
			//console.log('is playing ', isPlaying);
			
			//start the game
			playGame();
		}
		else if (gameOn && isPlaying && !isStrict) {
			//reset
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
			}, 500);
		}
		else {
			console.log('do nothing');
		}
	}); 

	//strict button
	$('div#strict-btn').on('click', function() {
		console.log(gameOn);
		if (gameOn && !isPlaying && !isStrict) {
			isStrict = true;
			resetWin();
			$('div#screen p').text(count);
			$('div.colbutton').off('click');
			console.log('strict');
			//console.log('is srtict ', isStrict);
			//start the game in strict mode
			$('div#strict-light').css({'background-color': '#f82b16'});
			playStrict();
		}
		else if (gameOn && !isPlaying && isStrict) {
			//off strict mode
			isStrict = false;
			count = 0;
			sequence = [];
			userInput = [];
			clearInterval(delay);
			$('div#screen p').text(count);
			$('div.colbutton').off('click');
			$('div#strict-light').css({'background-color': '#720e03'});
		}
		else if (gameOn && isPlaying && !isStrict) {
			console.log('SWITCH TO STRICT');
			//switch to strict mode
			var delayed = 500;
			isPlaying = false;
			count = 0;
			sequence = [];
			userInput = [];
			clearInterval(delay);
			$('div#screen p').text(count);
			$('div.colbutton').off('click');
			$('div#strict-light').css({'background-color': '#f82b16'});
			if (playingAudio) {
				delayed = 5000;
			}
			setTimeout(function() {
				isStrict = true;
				playStrict();	
			}, delayed);
		}
		else {
			console.log('do nothing');
		}
	});


//-------------------------GAMEPLAY--------------------------------------

	//gameplay
	function playGame(){
		//console.log('Before:','sequence:', sequence, 'userInput:', userInput, 'count:', count);
		if (gameOn && isPlaying) {

			userInput = [];
			//add a random number to sequence
			updateSequence(sequence);
			count = sequence.length;
			$('div#screen p').text(count);
			console.log('After:','sequence:', sequence, 'userInput:', userInput, 'count:', count);

			playSequence(sequence);

			// add event listener
			listenUser(0, playGame, playLast);
		}
		else {
			isPlaying = false;
			isStrict = false;
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
			isStrict = false;
			count = 0;
			sequence = [];
			userInput = [];
		}	
	}

//-----------------------STRICT MODE--------------------------------------------
	//strict gameplay
	function playStrict(){
		console.log('Strict:', isStrict);
		if (gameOn && isStrict) {
			userInput = [];
			//add a random number to sequence
			updateSequence(sequence);
			count = sequence.length;
			$('div#screen p').text(count);
			console.log('After:','sequence:', sequence, 'userInput:', userInput, 'count:', count);

			playSequence(sequence);

			// add event listener
			listenUser(0, playStrict, strictMode);
		}
		else {
			isPlaying = false;
			isStrict = false;
			count = 0;
			sequence = [];
			userInput = [];
		}	
	}

	function strictMode() {
		//restart from beginning
		counter = 0;
		sequence = [];
		$('div#screen p').text(count);
		playStrict();
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
		if (gameOn && (isPlaying || isStrict)) {
			console.log('playSequence started');
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
		if (gameOn && (isPlaying || isStrict)) {
			console.log('Show Lights started');
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
		if (gameOn && (isPlaying || isStrict)) {
			console.log('play Sound started');
			var audio = '<audio src="'+ sounds[elem] + '" autoplay></audio>';
			//console.log(audio);
			$('div[data-label="' + elem + '"]').html(audio);
		}	
	}
	// plays the sound of fail
	function playFail(elem) {
		if (gameOn && (isPlaying || isStrict)) {
			playingAudio = true;
			var audio = '<audio src="audio/Sad_Trombone.mp3" autoplay></audio>';
			//console.log(audio);
			$('div[data-label="' + elem + '"]').html(audio);
			setTimeout(function() {
				playingAudio = false;
			}, 5000);
		}	
	}

	//plays the sound of win
	function playWin() {
		var audio = '<audio src="audio/Ta_Da.mp3" autoplay></audio>';
		$('div.speaker').html(audio);
	}

	// checks for a win
	function isWon(callback) {
		if (sequence.length === 20) { 
			$('div#win').removeClass('hidden');
			// $('div#win h2').show(fast);
			$('div#win h2').fadeOut(4000);
			setTimeout(function() {
				playWin();	
			}, 750);
			
			//reset counter, sequence, userInput, isPlaying, isStrict
			counter = 0;
			sequence = [];
			userInput = [];
			isPlaying = false;
			isStrict = false;
			$('div#screen p').text(count);
			$('div#strict-light').css({'background-color': '#720e03'});
		}
		else {
			//console.log('next round!');
			//console.log(isStrict);
			setTimeout(function() {

				callback();	
			}, 1500);
		}
	}
	
	// listen, record and validate a user input
	function listenUser(index, callback1, callback2) {
		
		$('div.colbutton').on('click', function() {
			var num = $(this).attr('data-label');
			//console.log('Num:', num);
			//console.log('UserInput:', userInput);
			playSound(num);

			$('div.colbutton').off('click');
			if (num == sequence[index]) {
			 	//console.log('Num: ', num, 'sequence: ', sequence);
			 	userInput.push(num);
			 	//console.log(userInput);
			 	index++;
			 	//console.log(isStrict);

				(index >= sequence.length) ? isWon(callback1): listenUser(index, callback1, callback2);
			}
			else {
			 	$('div#screen p').text('!!');
			 	setTimeout(function() {
			 		playFail(num);
			 	}, 1000);
			 	setTimeout(function() {
			 		$('div#screen p').text(count);
			 		callback2();
			 	}, 5000);	
			}	
		});
	}
	// resets the win message
	function resetWin() {
		$('div#win').addClass('hidden');
		$('div#win h2').show();
	}

}); // end of document.ready

