'use strict';

function DataModel() {

    var self = this;
    var data = require('../../../data/words.json');
    var dataMap = new Map();
    self.allowedWords = [];

    for(let d in data.words) {
        dataMap.set(d, data.words[d]);
        self.allowedWords.push(d);
    }

    this.letters = [];
    this.localImageUrl = '/images/';

    this.containsWord = function(word) {
        word = word.toLowerCase();
        return dataMap.has(word);
    };

    this.resetWord = function() {
        self.letters = [];
    };

    this.isResourceLocal = function() {
        var word = this.letters.join('').toLowerCase();
        var wordData = dataMap.get(word);
        return wordData ? wordData.location === 'local' : false;
    };

    this.getSearchTerm = function(word) {
        word = word.toLowerCase();
        var wordData = dataMap.get(word);
        return wordData.searchTerm ? wordData.searchTerm : word;
    };

    function wordIsValid(word) {
       var valid = false;
       for(let w of self.allowedWords) {
           if(w.length >= word.length) {
               valid = true;
           }
       }
       return valid;
    }

    this.wordComplete = function(){
        if(self.letters.length < 1) {
            return;
        }
        var word = self.letters.join('').toLowerCase();
        return this.containsWord(word) || !wordIsValid(word);
    };

}

module.exports =  new DataModel();
