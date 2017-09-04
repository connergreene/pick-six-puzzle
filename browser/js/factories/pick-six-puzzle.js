'use strict'
app.factory('pickSix', function (checkFactory) {

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
	 	this.correctAnswers = [];
	}

	Puzzle.prototype.generatePuzzle = function(){
		var letters = "BCDFGHJKLMNPQRSTVWXYZ";
		var vowels = "AEIOU";
		var results = [];

		//4 to 9 vowels
		for(var i = 0; i <= Math.random() * (9 - 4)+ 4; i++){
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
		
		var traverse = function(possStartStates, nextIndex){
			if(!word[nextIndex]){
				return true;
			}
			for (var i = 0; i < possStartStates.length; i++){
				var startState = possStartStates[i];
				var transitions = puzz.states[startState].transitions;
				var newStartStates = [];
				for(var x = 0; x < transitions.length; x++){
					//checking if next letter in word is in curr state transitions
					if(puzz.states[transitions[x]].value === word[nextIndex]){
						newStartStates.push(transitions[x]);
					}
				}
				if(newStartStates.length > 0){
					nextIndex++;
					if(!traverse(newStartStates, nextIndex) && possStartStates.length > 1){
						newStartStates.reverse();
						traverse(newStartStates, nextIndex--)
					}
					else{
						return traverse(newStartStates, nextIndex);
					}
				}
			}
			return false;
		}

		var possStartStates = this.getKeyByLetter(word[0]);
			
		return traverse(possStartStates, 1);
	}

	Puzzle.prototype.getAnswerKey = function(){
		var letters = "";
		var answers = [];
		var puzz = this;
		for(var stateName in this.states){
			letters+=this.states[stateName].value
		}
		return checkFactory.checkPickSix(letters)
		.then(function(anagrams){
			for(var i = 0; i < anagrams.length; i++){
				if(puzz.checkWord(anagrams[i])){
					answers.push(anagrams[i]);
				}
			}
			return answers;
		});
	}

	return Puzzle;

});


