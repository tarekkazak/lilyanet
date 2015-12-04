import {monads} from 'folktale/control';
import {Maybe} from 'folktale/data';
import {_} from 'lodash';

let letters;
export class LilyaNet {

    constructor(dao) {
        this.dao = dao;
        this.dataMap = new Map();
        letters = [];
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
        let words = this.getAllWords();
        for(let word of words) {
            this.dataMap.set(word.id, word);
        }
    }
    
    getLetters() {
        return letters;
    }

    addLetter(letter)  {
        letters.push(letter);
    }
    
    selectWord(word) {
        word.selected = true;
    }

    getWords(mode) {
        //TODO: lazy evaluate syllables and words once mode is determine
        var getSelectedItems = (prop) => _.compose(monads.map((x) => x.get()), 
                monads.filter((x) => x.isJust), 
                monads.map((x) => Maybe.fromNullable(x[prop])), 
                monads.filter((x) => x.selected === true));

        var getSelectedSyllables =  getSelectedItems('syllables');
        var getSelectedWords =  getSelectedItems('value');
        var syllables = getSelectedSyllables(Array.from(this.dataMap.values()))
        var words = getSelectedWords(Array.from(this.dataMap.values()))
        var isDefault = Maybe.fromNullable(mode).isNothing || mode === 'default';
        return isDefault ? words : syllables;
    }

    containsWord(word) {
        return !this.wordDataCompose(Maybe.of(word)).isNothing;
    }


    resetWord() {
        letters = [];
    }
    
    getWordData(word) {
        let wordData = Array.from(this.dataMap.values()).filter((x) => x.value === word);
        console.log('wordData', wordData);
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
