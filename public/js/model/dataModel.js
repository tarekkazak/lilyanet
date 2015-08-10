'use strict';

var _ require('lodash');

function DataModel() {
    var self = this;
    var data = new Map(JSON.parse('../../../data/words.json').words);
    console.log(data.entries());
    this.letters = [];
    this.localImageUrl = '/images/';
    this.allowedWords = data.values();

    function contains(word) {
        return data.has(word);
    }

    this.resetWord = function() {
        self.letters = [];
    }

    this.isResourceLocal = function() {
        var wordData = data.get(this.letters.join(''));
        return wordData.location === 'local';
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

    this.wordComplete = function(){
        var word = self.letters.join('');
        return containsWord(word) || !wordIsValid(word);
    }



module.exports =  new DataModel();
