var monad = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
var _ = require('lodash');

export class DataModel {

    constructor() {
        this.data = require('../../../data/words.json');
        this.dataMap = new Map();
        this.letters = [];
        this.localImageUrl = '/images/';
        this.init();
        this.wordDataCompose = _.compose(monad.chain(this.getWordData.bind(this)), 
                monad.map((x) => x.toLowerCase()),
                monad.map((x) => x.join ? x.join('') : x));
    }

    init() {
        for(let d in this.data.words) {
            this.dataMap.set(d, this.data.words[d]);
        }
    }

    getWords(mode) {
        var syllables = Array.from(this.dataMap.values()).map((x) => Maybe.fromNullable(x.syllables))
            .filter((x) => x.isJust)
            .map((x) => x.get());
        var words = Array.from(this.dataMap.keys());
        var isDefault = Maybe.fromNullable(mode).isNothing || mode === 'default';
        return isDefault ? words : syllables;
    };

    containsWord(word) {
        console.log('contains word', word);
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

        return this.wordDataCompose(Maybe.of(this.letters.join('')))
                .chain(getLocation)
                .chain((x) => x === 'local');
    };

    getSearchTerm(word) {
        return this.wordDataCompose(Maybe.of(word))
                .chain((x) => x.searchTerm || word);
    };

    wordComplete(){
        return this.containsWord(this.letters.join(''));
    };

}
