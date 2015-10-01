export class DataModel {

    constructor() {
        this. data = require('../../../data/words.json');
        this.dataMap = new Map();
        this.allowedWords = [];
        this.letters = [];
        this.localImageUrl = '/images/';
    }

    init() {
        for(let d in this.data.words) {
            dataMap.set(d, data.words[d]);
            this.allowedWords.push(d);
        }
    }


    containsWord(word) {
        word = word.toLowerCase();
        return dataMap.has(word);
    };

    resetWord() {
        this.letters = [];
    };

    isResourceLocal() {
        var word = this.letters.join('').toLowerCase();
        var wordData = dataMap.get(word);
        return wordData ? wordData.location === 'local' : false;
    };

    getSearchTerm(word) {
        word = word.toLowerCase();
        var wordData = dataMap.get(word);
        return wordData.searchTerm ? wordData.searchTerm : word;
    };


    wordComplete(){
        var word = this.letters.join('').toLowerCase();

        function wordIsValid(word) {
           var valid = false;
           for(let w of this.allowedWords) {
               if(w.length >= word.length) {
                   valid = true;
               }
           }
           return valid;
        }    
        
        if(this.letters.length < 1) {
            return false;
        }
        return this.containsWord(word) || !wordIsValid(word);
    };

}

