'use strict'
app.controller('homeCtrl', function ($scope, HomeFactory) {
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

		this.answerKey = this.getAnswerKey();
		console.log(this.answerKey)

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
		return Object.keys(states).find(function(key){
			if(states[key].value === letter){
				return key;
			}
		});
	}

	Puzzle.prototype.checkWord = function(word){
		for(var i = 0; i < word.length; i++){
			var currLetter = word[i];
			if(!word[i+1]){
				return true;
			}
			var nextLetter = word[i+1]
			var currState = this.getKeyByLetter(currLetter);
			var nextState = this.getKeyByLetter(nextLetter);
			var transitions = this.states[currState].transitions;
			if(!transitions.includes(nextState)){
				return false;
			}
		}
		return true;
	}

	Puzzle.prototype.getAnswerKey = function(){
		var letters = '';
		var anagrams;
		var answers = [];
		var puzz = this;
		for(var stateName in this.states){
			letters+=this.states[stateName].value
		}
		HomeFactory.getPossibleAnswers(letters)
		.then(function(ans){
			anagrams = ans;
		})
		.then(function(){
			for(var i = 0; i < anagrams.length; i++){
				if(puzz.checkWord(anagrams[i])){
					answers.push(anagrams[i]);
				}
			}
			//check if enough answers
			if(answers.length < 20){
				puzz.generatePuzzle();
			}
			console.log(answers)
			return answers;
		});

		return answers;
	}



	var myPuzz = new Puzzle;
	myPuzz.generatePuzzle();
	
	$scope.states = myPuzz.states;

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

	var makeOthersUnclickable = function(curr){
		var nextTransitions = curr.transitions;
		for(var state in $scope.states){
			if(nextTransitions.indexOf(state) < 0){
				$scope.states[state].clickable = false;
			}
		}
		curr.clickable = true;
	}

	$scope.guess = '';
	var addValue = function(val){
		$scope.guess += val;
	}

	$scope.select = function(curr){
		if(curr.clickable){
			clearStateColor();
			makeOthersUnclickable(curr);
			for(var i = 0; i < curr.transitions.length; i++){
				var nextState = angular.element(document.querySelector('.state-'+ curr.transitions[i]));
				nextState.css("fill", "grey");
				$scope.states[curr.transitions[i]].clickable = true;
			}
			var currState = angular.element(document.querySelector('.state-'+ myPuzz.getKeyByValue(curr)));
			currState.css("fill", "lightgreen");
			addValue(curr.value);
		}
	}

	$scope.clear = function(){
		$scope.guess = '';
		makeAllClickable();
		clearStateColor();
	}



	$scope.submit = function(){
		if($scope.guess.length < 6){
			alert("Word must be 6 letters or more!");
		}
		else if (myPuzz.answerKey.includes($scope.guess)){
			alert("Hoooorayyyy");
		}
		else{
			alert("BOOOO");
		}
		
	}
});