'use strict'
app.controller('spellingBeeCtrl', function ($scope, checkFactory) {
	function Puzzle(){
		this.letters = "";
	 	this.answerKey = [];
	}

	Puzzle.prototype.generatePuzzle = function(){
		var alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		var results = [];

		for(var i = 0; i <= 6; i++){
			this.letters += alph.charAt(Math.floor(Math.random() * alph.length));
		}
		return this;
	}

	Puzzle.prototype.getAnswerKey = function(){
		console.log(this.letters)
		return checkFactory.checkSpellingBee(this.letters)
		.then(function(answers){
			console.log(answers)
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
		$scope.states = $scope.myPuzz.states;
		$scope.correctAnswers = [];
		$scope.showAnswers = false;
		$scope.message = "";
		$scope.myPuzz.getAnswerKey()
		.then(function(answers){
			$scope.myPuzz.answerKey = answers;
			$scope.answerAmount = answers.length;
		});
		return;
	}

	$scope.makeFullPuzz();

});