'use strict'
app.controller('spellingBeeCtrl', function ($scope, $state, checkFactory, spellingBee, UserFactory, SpellingBeeFactory, Auth) {
	$scope.isLoggedIn = Auth.isAuthenticated();
	$scope.isSavedPuzzle = false;
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
		else if(!$scope.guess.includes($scope.myPuzz.letters[0])){
			$scope.message = "Word must contain the middle letter!";
		}
		else{
			$scope.message = "Not an answer!";
		}
		
	}

	$scope.user = null;
	$scope.save = function(){
		$scope.savedInfo = {};
		Auth.getCurrentUser()
        .then(function (user) {
            $scope.user = user;
            $scope.savedInfo.letters = $scope.myPuzz.letters;
            $scope.savedInfo.correctAnswers = $scope.myPuzz.correctAnswers;
            $scope.savedInfo.owner = user._id;
            $scope.savedInfo.answerKeySize = $scope.answerAmount;
            SpellingBeeFactory
            .create($scope.savedInfo)
            .then(function(savedPuzz){
            	$state.go('saved-spelling-bee', {id : savedPuzz._id});
            });
        })
	}

	$scope.endGame = function(){
		$scope.message = "";
		$scope.answers = $scope.myPuzz.answerKey;
		$scope.showAnswers = true;
		$scope.guess = "";
	}

	$scope.makeFullPuzz = function(){
		$scope.clear();
		$scope.myPuzz = new spellingBee;
		$scope.myPuzz.generatePuzzle();
		$scope.myPuzz.correctAnswers = [];
		$scope.showAnswers = false;
		$scope.message = "";
		$scope.myPuzz.getAnswerKey()
		.then(function(answers){
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
					$scope.myPuzz.answerKey = answers;
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