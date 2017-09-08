'use strict'
app.controller('savedPickSixCtrl', function ($scope, pickSix, checkFactory, $q, UserFactory, Auth, PickSixFactory, savedPickSix) {
	
	$scope.myPuzz = new pickSix;
	$scope.myPuzz.states = savedPickSix.states;
	$scope.states = savedPickSix.states;
	$scope.myPuzz.correctAnswers = savedPickSix.correctAnswers;
	$scope.showAnswers = false;
	$scope.message = "";
	$scope.myPuzz.getAnswerKey().then(function(answers){
		$scope.myPuzz.answerKey = answers;
		$scope.answerAmount = answers.length;
	});

	$scope.backspace = function(){
		if($scope.guess.length>0){
			$scope.guess = $scope.guess.slice(0, $scope.guess.length-1);
			$scope.clicked.pop();
			var curr = $scope.clicked[$scope.clicked.length-1];
			$scope.message = "";
			clearStateColor();
			if(curr){
				makeOthersUnclickable(curr);
				for(var i = 0; i < curr.transitions.length; i++){
					var nextState = angular.element(document.querySelector('.state-'+ curr.transitions[i]));
					nextState.css("fill", "grey");
					$scope.states[curr.transitions[i]].clickable = true;
				}
				var currState = angular.element(document.querySelector('.state-'+ $scope.myPuzz.getKeyByValue(curr)));
				currState.css("fill", "lightgreen");
			}
			else{
				makeAllClickable();
			}
		}
	};

	$scope.clear = function(){
		$scope.guess = "";
		$scope.message = "";
		makeAllClickable();
		clearStateColor();
		$scope.clicked = [];
	};


	var clearStateColor = function(){
		for(var state in $scope.states){
			var currState = angular.element( document.querySelector('.state-'+ state));
			currState.css("fill", "black");
		}
	}

	var makeAllClickable = function(){
		for(var state in $scope.states){
			$scope.states[state].clickable = true;
		}
	}

	var makeAllUnclickable = function(){
		for(var state in $scope.states){
			$scope.states[state].clickable = false;
		}
		clearStateColor();
	}

	var makeOthersUnclickable = function(curr){
		var nextTransitions = curr.transitions;
		for(var state in $scope.states){
			if(nextTransitions.indexOf(state) < 0){
				$scope.states[state].clickable = false;
			}
		}
	}

	$scope.guess = "";
	var addValue = function(val){
		$scope.guess += val;
	}

	$scope.clicked = [];

	$scope.select = function(curr){
		if(curr.clickable){
			$scope.message = "";
			clearStateColor();
			makeOthersUnclickable(curr);
			for(var i = 0; i < curr.transitions.length; i++){
				var nextState = angular.element(document.querySelector('.state-'+ curr.transitions[i]));
				nextState.css("fill", "grey");
				$scope.states[curr.transitions[i]].clickable = true;
			}
			var currState = angular.element(document.querySelector('.state-'+ $scope.myPuzz.getKeyByValue(curr)));
			currState.css("fill", "lightgreen");
			addValue(curr.value);
			$scope.clicked.push(curr);
		}
	}
	

	$scope.submit = function(){
		if($scope.guess.length < 6){
			$scope.message = "Word must be 6 letters or more!";
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
		savedInfo._id = savedPickSix._id;
		savedInfo.correctAnswers = $scope.myPuzz.correctAnswers;
		PickSixFactory.update(savedPickSix);

	}
	
	$scope.endGame = function(){
		$scope.message = "";
		$scope.answers = $scope.myPuzz.answerKey;
		$scope.showAnswers = true;
		$scope.guess = "";
		$scope.clicked = [];
		makeAllUnclickable();
	}


});