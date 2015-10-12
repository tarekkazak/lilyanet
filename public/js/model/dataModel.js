var monad = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
var _ = require('lodash');

export class DataModel {

    constructor() {
        this. data = require('../../../data/words.json');
        this.dataMap = new Map();
        this.allowedWords = [];
        this.letters = [];
        this.localImageUrl = '/images/';
        this.init();
        this.wordDataCompose = _.compose(monad.chain(this.getWordData.bind(this)), monad.map((x) => x.toLowerCase()));
    }

    init() {
        for(let d in this.data.words) {
            this.dataMap.set(d, this.data.words[d]);
            this.allowedWords.push(d);
        }
    }

    containsWord(word) {
        return !this.wordDataCompose(Maybe.of(word)).isNothing;
    };

    resetWord() {
        this.letters = [];
    };
    
    getWordData(word) {
        return Maybe.fromNullable(this.dataMap.get(word));
    };


    isResourceLocal() {
        function getLocation(item) {
            return Maybe.fromNullable(item.location);
        }

        return this.wordDataCompose(Maybe.of(this.letters.join(''))).chain(getLocation)
                .chain((x) => x === 'local');
    };

    getSearchTerm(word) {
        return this.wordDataCompose(Maybe.of(word))
                .chain((x) => x.searchTerm || word);
    };


    wordComplete(){
        var word = this.letters.join('').toLowerCase();

        
        if(this.letters.length < 1) {
            return false;
        }
        return this.containsWord(word);
    };

}

