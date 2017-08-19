'use strict'
app.controller('homeCtrl', function ($scope, HomeFactory, $q) {
	function Puzzle(){
		this.states = { 
			"q0": {value : "", clickable : true, transitions : ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"]},
			"q1": {value : "", clickable : true, transitions : ["q0", "q2", "q3", "q4", "q5"]},
			"q2": {value : "", clickable : true, transitions : ["q0", "q1", "q3", "q6", "q8"]},
			"q3": {value : "", clickable : true, transitions : ["q0", "q1", "q2", "q4", "q6"]},
			"q4": {value : "", clickable : true, transitions : ["q0", "q1", "q3", "q5", "q7"]},
			"q5": {value : "", clickable : true, transitions : ["q0", "q1", "q4", "q7", "q11"]},
			"q6": {value : "", clickable : true, transitions : ["q0", "q2", "q3", "q8", "q9"]},
			"q7": {value : "", clickable : true, transitions : ["q0", "q4", "q5", "q10", "q11"]},
			"q8": {value : "", clickable : true, transitions : ["q0", "q2", "q6", "q9", "q12"]},
			"q9": {value : "", clickable : true, transitions : ["q0", "q6", "q8", "q10", "q12"]},
			"q10": {value : "", clickable : true, transitions : ["q0", "q7", "q9", "q11", "q12"]},
			"q11": {value : "", clickable : true, transitions : ["q0", "q5", "q7", "q10", "q12"]},
			"q12": {value : "", clickable : true, transitions : ["q0", "q8", "q9", "q10", "q11"]}
	 	};

	 	this.answerKey = [];
	}

	Puzzle.prototype.generatePuzzle = function(){
		var letters = "BCDFGHJKLMNPQRSTVWXYZ";
		var vowels = "AEIOU";
		var results = [];

		//between 8 and 4 vowels
		for(var i = 0; i <= Math.random() * (8 - 4)+ 4; i++){
			results.push(vowels.charAt(Math.floor(Math.random() * vowels.length)));
		}

		//other letters
		var len = results.length;
		for (var i = 0; i < 13 - len; i++){
			results.push(letters.charAt(Math.floor(Math.random() * letters.length)));
		}

		for(var stateName in this.states){
			var state = this.states[stateName];
			var ind = Math.floor(Math.random() * results.length);
			state.value = results.splice(ind, 1)[0];
		}

		//NEWSPAPER ORIGINAL PUZZLLLLLLEEEEEEEEE!!!!!!!!!!!!!!!
		// var ind = 0;
		// var results = ["D","I","C","A","N","T","E","O","O","R","E","P","L"];
		// for(var stateName in this.states){
		// 	var state = this.states[stateName];
		// 	// var ind = Math.floor(Math.random() * results.length);
		// 	state.value = results[ind];
		// 	ind++
		// }
		//////////////////////////////////////////////////////

		return this;
	}

	Puzzle.prototype.getKeyByValue = function(value){
		var states = this.states
		return Object.keys(states).find(function(key){
			if(states[key] === value){
				return key;
			}
		});
	}

	Puzzle.prototype.getKeyByLetter = function(letter){
		var states = this.states;
		var keys = [];

		Object.keys(states).find(function(key){
			if(states[key].value === letter){
				keys.push(key);
			}
		});
		return keys;
	}

	Puzzle.prototype.checkWord = function(word){
		var puzz = this;
		var possStartStates = this.getKeyByLetter(word[0]);
		var traverse = function(startState, nextIndex){
			var transitions = puzz.states[startState].transitions;
		
			for(var x = 0; x < transitions.length; x++){
				if(puzz.states[transitions[x]].value === word[nextIndex]){
					nextIndex++;
					if(!word[nextIndex]){
						pass = true;
						break;
					}
					traverse(transitions[x], nextIndex);
					break;
				}
			}
			return false;
		}

		for (var i = 0; i < possStartStates.length; i++){
			var pass = false;
			traverse(possStartStates[i], 1);
			if(pass){
				return true;
			}
	
		}
		return false;
	}

	Puzzle.prototype.getAnswerKey = function(){
		var letters = "";
		var answers = [];
		var puzz = this;
		for(var stateName in this.states){
			letters+=this.states[stateName].value
		}
		return HomeFactory.getPossibleAnswers(letters)
		.then(function(anagrams){
			for(var i = 0; i < anagrams.length; i++){
				if(puzz.checkWord(anagrams[i])){
					answers.push(anagrams[i]);
				}
			}
			return answers;
		});
	}

	$scope.clear = function(){
		$scope.guess = "";
		$scope.message = "";
		makeAllClickable();
		clearStateColor();
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
		//curr.clickable = true;
	}

	$scope.guess = "";
	var addValue = function(val){
		$scope.guess += val;
	}

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
		}
	}
	

	$scope.submit = function(){
		if($scope.guess.length < 6){
			$scope.message = "Word must be 6 letters or more!";
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
		makeAllUnclickable();
	}

	$scope.makeFullPuzz = function(){
		$scope.clear();
		$scope.myPuzz = new Puzzle;
		$scope.myPuzz.generatePuzzle();
		$scope.states = $scope.myPuzz.states;
		$scope.correctAnswers = [];
		$scope.showAnswers = false;
		$scope.message = "";
		$scope.myPuzz.getAnswerKey().then(function(answers){
			if(answers.length < 20){
				$scope.makeFullPuzz();
			}
			else{
				$scope.myPuzz.answerKey = answers;
				$scope.answerAmount = answers.length;
			}
		});
		return;
	}

	$scope.makeFullPuzz();
});