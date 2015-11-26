import {monads} from 'folktale/control';
import {Maybe} from 'folktale/data';
import {_} from 'lodash';

export class LilyaNet {

    constructor(dao) {
        this.dao = dao;
        this.dataMap = new Map();
        this.letters = [];
        this.localImageUrl = '/images/';
        this.init();
        this.wordDataCompose = _.compose(monads.chain(this.getWordData.bind(this)), 
                monads.map((x) => x.toLowerCase()),
                monads.map((x) => x.join ? x.join('') : x));
        //api for dao
        this.getSelectedWords =  this.dao.getWords({selected : true});
        
    }

    init() {
        this.dao.connect();
    }

    selectWord(word) {
        var wordData = this.getWordData(word);
        wordData.map((x) => x.selected = true);
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
        this.letters = [];
    }
    
    getWordData(word) {
        return Maybe.fromNullable(this.dataMap.get(word));
    }

    isResourceLocal() {
        function getLocation(item) {
            return Maybe.fromNullable(item.location);
        }

        return this.wordDataCompose(Maybe.of(this.letters))
                .chain(getLocation)
                .chain((x) => x === 'local');
    }

    getSearchTerm(word) {
        return this.wordDataCompose(Maybe.of(word))
                .chain((x) => x.searchTerm || word);
    }

    wordComplete(){
        return this.containsWord(this.letters);
    }

}
