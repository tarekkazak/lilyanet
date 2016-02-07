'use strict';
var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
var _ = require('lodash');
import {Utils} from '../common/utils';

export class LilyaNet {

    private letters;
    private getSelectedItems;
    private getSelectedWords;
    private getAllWords;
    private wordDataCompose;
    private wordComplete;

    constructor(private dao) {
        this.letters = [];

        this.getSelectedItems = (prop) => _.compose(monads.map((x) => x.get()), 
                Utils.curriedFilter((x) => {
                    return x.isJust;
                }), 
                monads.map((x) => Maybe.fromNullable(x[prop])), 
                Utils.curriedFilter((x) => x.selected === true));

        this.wordDataCompose = _.compose(monads.chain(this.getWordData.bind(this)), 
                monads.map((x) => x.toLowerCase()),
                monads.map((x) => x.join ? x.join('') : x));

        this.wordComplete = this.containsWord;
        //api for dao
        this.getSelectedWords =  this.dao.getWords({selected : true});
        this.getAllWords =  this.dao.getWords();
    }

    init() {
        this.dao.connect();
    }
    
    getLetters() {
        return this.letters;
    }

    addLetter(letter)  {
        this.letters.push(letter);
    }
    
    selectWord(word) {
        word.selected = true;
    }

    getSyllablesList() {
        var getSelectedSyllabes =  this.getSelectedItems('syllables');
        var values = this.getAllWords();
        var syllables = getSelectedSyllabes(values)
        return syllables; 
    } 
    
    getWordList() {
        var getSelectedWords =  this.getSelectedItems('value');
        var values = this.getAllWords();
        var words = getSelectedWords(values)
        return words;
    }

    containsWord(word) {
        return !this.wordDataCompose(Maybe.of(word)).isNothing;
    }


    resetWord() {
        this.letters = [];
    }
    
    getWordData(word) {
        let wordData = this.getAllWords().filter((x) => x.value === word);
        return Maybe.fromNullable(wordData[0]);
    }
    
    isResourceLocal(word) {
        function getLocation(item) {
            return Maybe.fromNullable(item.location);
        }

        return this.wordDataCompose(Maybe.of(word))
                .chain(getLocation)
                .chain((x) => x === 'local');
    }

    getSearchTerm(word) {
        return this.wordDataCompose(Maybe.of(word))
                .chain((x) => x.searchTerm || word);
    }

}
