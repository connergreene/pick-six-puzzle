'use strict'
app.controller('homeCtrl', function ($scope) {
	function Puzzle(){
		this.states = { 
			"q0": {value : "", transitions : ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10", "q11", "q12"]},
			"q1": {value : "", transitions : ["q0", "q2", "q3", "q4", "q5"]},
			"q2": {value : "", transitions : ["q0", "q1", "q3", "q6", "q8"]},
			"q3": {value : "", transitions : ["q0", "q1", "q2", "q4", "q6"]},
			"q4": {value : "", transitions : ["q0", "q1", "q3", "q5", "q7"]},
			"q5": {value : "", transitions : ["q0", "q1", "q4", "q7", "q11"]},
			"q6": {value : "", transitions : ["q0", "q2", "q3", "q8", "q9"]},
			"q7": {value : "", transitions : ["q0", "q4", "q5", "q10", "q11"]},
			"q8": {value : "", transitions : ["q0", "q2", "q6", "q9", "q12"]},
			"q9": {value : "", transitions : ["q0", "q6", "q8", "q10", "q12"]},
			"q10": {value : "", transitions : ["q0", "q7", "q9", "q11", "q12"]},
			"q11": {value : "", transitions : ["q0", "q5", "q7", "q10", "q12"]},
			"q12": {value : "", transitions : ["q0", "q8", "q9", "q10", "q11"]}
	 	};
	}

	Puzzle.prototype.generatePuzzle = function(){
		var val = "";
		var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

		for(var stateName in this.states){
			var state = this.states[stateName];
			state.value = possible.charAt(Math.floor(Math.random() * possible.length));
		}
		return this;
	}

	var myPuzz = new Puzzle;
	myPuzz.generatePuzzle();

	$scope.states = myPuzz.states;

	$scope.nextStates = function(curr){
		for(var i = 0; i < curr.transitions.length; i++){
			
		}
	}
	
});