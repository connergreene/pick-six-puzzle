'use strict'
app.factory('spellingBee', function (checkFactory) {

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

	return Puzzle;

});