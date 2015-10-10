var monad = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
var _ = require('lodash');

var joinToLower = _.compose((x) => x.toLowerCase(), (x) => x.join(''));
export class DataModel {

    constructor() {
        this. data = require('../../../data/words.json');
        this.dataMap = new Map();
        this.allowedWords = [];
        this.letters = [];
        this.localImageUrl = '/images/';
        this.init();
    }

    init() {
        for(let d in this.data.words) {
            this.dataMap.set(d, this.data.words[d]);
            this.allowedWords.push(d);
        }
    }

    containsWord(word) {
        return Maybe.of(word).map((x) => x.toLowerCase()).map(this.hasWordData.bind(this)).join();
    };

    resetWord() {
        this.letters = [];
    };
    
    hasWordData(word) {
        return this.dataMap.has(word);
    };

    getWordData(word) {
        return Maybe.fromNullable(this.dataMap.get(word));
    };

    hasLocation(item) {
        return Maybe.fromNullable(item.location);
    }

    isResourceLocal() {
        return  Maybe.of(this.letters).map(joinToLower).
            chain(this.getWordData.bind(this)).map(hasLocation);
    };

    getSearchTerm(word) {
        return Maybe.of(word).map((x) => x.toLowerCase()).map(this.getWordData.bind(this)).map((x) => x.searchTerm || word).join();
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

