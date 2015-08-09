'use strict';

var _ require('lodash');

function DataModel() {
    var self = this;
    var data = JSON.parse('../../../data/words.json');
    this.letters = [];
    this.localImageUrl = '/images/';
    this.allowedWords = _.pluck(data.words, 'word');
    this.containsWord = function(word) {
        return self.allowedWords.indexOf(word.toLowerCase()) !== -1;
    }

    function resetWord() {
        self.letters = [];
    }
    
    function wordIsValid(word) {
       var valid = false;
       for(let w of self.allowedWords) {
           if(w.length >= word.length) {
               valid = true;
           }
       }
       return valid;
    };

    this.validateWord = function(){
        var word = self.letters.join('');
        if(self.containsWord(word) || !wordIsValid(word)) {
            resetWord();
        }
    };
    
}



module.exports =  new DataModel();
