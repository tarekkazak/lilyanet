var monads = require('folktale/control').monads;
var Maybe = require('folktale/data').Maybe;
var _ = require('lodash');
import {Utils} from '../../common/utils';
import {LetterGenerator} from '../service/letterGeneratorService';
import {LilyanetDao} from './lilyanetDao';
import {IOEvents as IO_EVENT} from '../../common/events';
import {messageService} from '../../common/appContainer';

@messageService
export class LilyaNet {

    
    private letters;
    private getSelectedItems;
    private getSelectedWords;
    private getAllWords;
    private wordDataCompose;

    private getAllTags;
    private dao;

    public messageService;


    constructor(private mode) {
        this.dao = new LilyanetDao();
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

        //api for dao
        this.getSelectedWords =  this.dao.getWords({selected : true});
        this.getAllWords =  this.dao.getWords(undefined);
        this.getAllTags =  this.dao.getTags(undefined);

    }

    init() {
        this.dao.connect().then(() => {
            let generator = new LetterGenerator(this, this.mode).init();
            return Promise.all([this.getAllWords(), this.getAllTags()]);
        }).then((result) => {
            this.messageService.sendMessage(IO_EVENT.WORD_LIST_UPDATED, result[0]);
            this.messageService.sendMessage(IO_EVENT.TAG_LIST_UPDATED, result[1]);
        });

        this.messageService.on(IO_EVENT.UPDATE_WORD, (word) => {
            this.updateWord(word); 
        });

        this.messageService.on(IO_EVENT.ADD_WORD, (word) => {
            this.addWord(word); 
        });

        this.messageService.on(IO_EVENT.SELECT_WORD, (word) => {
            this.selectWord(word); 
        });

        this.messageService.on(IO_EVENT.DELETE_WORD, (word) => {
            this.deleteWord(word); 
        });

        this.messageService.on(IO_EVENT.ADD_TAG, (tag) => {
            this.addTag(tag); 
        });

        this.messageService.on(IO_EVENT.DELETE_TAG, (tag) => {
            this.deleteTag(tag); 
        });
    }

    close() {
        this.dao.close();
    }
    
    getLetters() {
        return this.letters;
    }

    addLetter(letter)  {
        this.letters.push(letter);
    }
    
    deleteWord(word) {
        console.log('delete word', word);
        this.dao.findById(word._id).then((word) => {
            return word.remove();
        }).then(() => {
            return this.getAllWords();
        }).then((words) => {
            this.messageService.sendMessage(IO_EVENT.WORD_LIST_UPDATED, words);
        });
    }

    updateWord(word) {
        console.log('update word', word);
        this.dao.findById(word._id).then((w) => {
            for(let key in word) {
                w[key] = word[key]
            }
            console.log('update word model', w);
            return this.dao.save(w);
        }).then(() => {
            return this.getAllWords();
        }).then((words) => {
            this.messageService.sendMessage(IO_EVENT.WORD_LIST_UPDATED,  words);
        });
    }

    selectWord(word) {
        console.log('select word', word);
        this.dao.findById(word._id).then((word) => {
            word.selected = !word.selected;
            return this.dao.save(word);
        }).then(() => {
            return this.getAllWords();
        }).then((words) => {
            this.messageService.sendMessage(IO_EVENT.WORD_LIST_UPDATED, words);
        });
    }


    addWord(word) {
        this.dao.addWord(word).then(() => {
            return this.getAllWords();
        }).then((words) => {
        //console.log('all words after add', words)
            this.messageService.sendMessage(IO_EVENT.WORD_LIST_UPDATED, words);
        });
    }

    getSyllablesList() {
        var getSelectedSyllabes =  this.getSelectedItems('syllables');
        var values = this.getAllWords();
        var syllables = getSelectedSyllabes(values)
        return syllables; 
    } 
    
    getWordList() {
        var getSelectedWords =  this.getSelectedItems('value');
        return this.getAllWords().then((values) => {
            return getSelectedWords(values);
        });
    }

    containsWord(word) {
        return !this.wordDataCompose(Maybe.of(word)).isNothing;
    }
    
    getWordData(word) {
        return this.getAllWords().then((result) => {
            return result.filter((x) => x.value === word)
        });
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

    addTag(tag) {
        this.dao.addTag(tag).then(() => {
            return this.getAllTags();
        }).then((tags) => {
        //console.log('all words after add', words)
            this.messageService.sendMessage(IO_EVENT.TAG_LIST_UPDATED, tags);
        });
    }

    deleteTag(tag) {
        this.dao.findById(tag._id).then((tag) => {
            return tag.remove();
        }).then(() => {
            return this.getAllTags();
        }).then((tags) => {
            this.messageService.sendMessage(IO_EVENT.TAG_LIST_UPDATED, tags);
        });
    }

}
