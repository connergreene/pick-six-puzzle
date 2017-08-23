'use strict'
app.controller('spellingBeeCtrl', function ($scope, checkFactory) {
	function Puzzle(){
		this.letters = "";
	 	this.answerKey = [];
	}

	Puzzle.prototype.generatePuzzle = function(){
		var consonants = "BCDFGHJKLMNPQRSTVWXYZ";
		var vowels = "AEIOU";

		//2 to 5 vowels
		for(var i = 0; i <= Math.random() * (6 - 2)+ 2; i++){
			var vowel = vowels.charAt(Math.floor(Math.random() * vowels.length));
			if(!this.letters.includes(vowel)){
				this.letters += vowel;
			}
		}

		//other letters
		var len = this.letters.length;
		for (var i = 0; i < 7 - len; i++){
			var consonant = consonants.charAt(Math.floor(Math.random() * consonants.length));
			if(!this.letters.includes(consonant)){
				this.letters += consonant;
			}
			else{
				i--;
			}
		}

		return this;
	}

	Puzzle.prototype.getAnswerKey = function(){
		return checkFactory.checkSpellingBee(this.letters)
		.then(function(answers){
			return answers;
		});
	}


	$scope.guess = "";
	$scope.addValue = function(val){
		$scope.guess += val;
	}

	$scope.clear = function(){
		$scope.guess = "";
		$scope.message = "";
	};

	$scope.submit = function(){
		if($scope.guess.length < 5){
			$scope.message = "Word must be 5 letters or more!";
		}
		else if ($scope.correctAnswers.includes($scope.guess)){
			$scope.message = "Already guessed this!";
			$scope.clear();
		}
		else if ($scope.myPuzz.answerKey.includes($scope.guess)){
			$scope.correctAnswers.push($scope.guess);
			$scope.clear();
			$scope.answerAmount--;
			if($scope.answerAmount === 0){
				$scope.endGame();
				alert("YOU DID IT!!!!!!!!!!!!");
			}
		}
		else{
			$scope.message = "Not an answer!";
		}
		
	}

	$scope.endGame = function(){
		$scope.message = "";
		$scope.answers = $scope.myPuzz.answerKey;
		$scope.showAnswers = true;
		$scope.guess = "";
	}

	$scope.makeFullPuzz = function(){
		$scope.clear();
		$scope.myPuzz = new Puzzle;
		$scope.myPuzz.generatePuzzle();
		$scope.correctAnswers = [];
		$scope.showAnswers = false;
		$scope.message = "";
		$scope.myPuzz.getAnswerKey()
		.then(function(answers){
			$scope.myPuzz.answerKey = answers;
			if(answers.length >= 10){
				var i = 0;
				$scope.allLetterWords = [];
				for(var i = 0; i < answers.length; i++){
					var answer = answers[i];
					if (answer.includes($scope.myPuzz.letters[1]) && answer.includes($scope.myPuzz.letters[2]) && answer.includes($scope.myPuzz.letters[3]) && answer.includes($scope.myPuzz.letters[4]) && answer.includes($scope.myPuzz.letters[5]) && answer.includes($scope.myPuzz.letters[6])){
						$scope.allLetterWords.push(answer);
					}
				};
				if ($scope.allLetterWords.length < 1){
					$scope.makeFullPuzz();
				}
				else{
					$scope.answerAmount = answers.length;
				}
			}
			else{
				$scope.makeFullPuzz();
			}
		});
		return;
	}

	$scope.makeFullPuzz();

});