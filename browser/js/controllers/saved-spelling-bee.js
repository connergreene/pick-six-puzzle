'use strict'
app.controller('savedSpellingBeeCtrl', function ($scope, checkFactory, spellingBee, UserFactory, SpellingBeeFactory, Auth, savedSpellingBee) {
	
	$scope.myPuzz = new spellingBee;
	$scope.myPuzz.letters = savedSpellingBee.letters;
	$scope.myPuzz.correctAnswers = savedSpellingBee.correctAnswers;
	$scope.showAnswers = false;
	$scope.message = "";
	$scope.myPuzz.getAnswerKey()
	.then(function(answers){
		$scope.allLetterWords = [];
		for(var i = 0; i < answers.length; i++){
			var answer = answers[i];
			if (answer.includes($scope.myPuzz.letters[1]) && answer.includes($scope.myPuzz.letters[2]) && answer.includes($scope.myPuzz.letters[3]) && answer.includes($scope.myPuzz.letters[4]) && answer.includes($scope.myPuzz.letters[5]) && answer.includes($scope.myPuzz.letters[6])){
				$scope.allLetterWords.push(answer);
			}
		};
		$scope.myPuzz.answerKey = answers;
		$scope.answerAmount = answers.length;
	});

	$scope.guess = "";
	$scope.addValue = function(val){
		$scope.guess += val;
	}

	$scope.clear = function(){
		$scope.guess = "";
		$scope.message = "";
	};

	$scope.backspace = function(){
		$scope.guess = $scope.guess.slice(0, $scope.guess.length-1);
		$scope.message = "";
	};

	$scope.submit = function(){
		if($scope.guess.length < 5){
			$scope.message = "Word must be 5 letters or more!";
		}
		else if ($scope.myPuzz.correctAnswers.includes($scope.guess)){
			$scope.message = "Already guessed this!";
			$scope.clear();
		}
		else if ($scope.myPuzz.answerKey.includes($scope.guess)){
			$scope.myPuzz.correctAnswers.push($scope.guess);
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

	$scope.save = function(){
		var savedInfo = {};
		savedInfo._id = savedSpellingBee._id;
		savedInfo.correctAnswers = $scope.myPuzz.correctAnswers;
		SpellingBeeFactory.update(savedSpellingBee);
	}

	$scope.endGame = function(){
		$scope.message = "";
		$scope.answers = $scope.myPuzz.answerKey;
		$scope.showAnswers = true;
		$scope.guess = "";
	}


});