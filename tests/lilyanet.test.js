var sinon = require('sinon');
require('jasmine-sinon');
var mongoose = require('mongoose')
import {Word} from '../app/model/word.js';
import {LilyaNet} from '../app/model/lilyanet.js';
import {LilyaNetDao} from '../app/model/lilyanetDao.js';

describe('lilyanet model tests', () => {
    let model, dao;
    let data ={
            chat : {
                location : 'remote',
                syllables : ['chat']

            }
        };

    beforeEach(() => {
        dao = new LilyaNetDao();
    });


    describe('back end connection tests', () => {
        it('should connect to database on init and fetch words and set dataMap', () => {
            dao.connect = sinon.spy();
            dao.getWords = sinon.stub();
            let word = {id : 1, value : 'word'};
            dao.getWords.returns(() => [word]);
            model = new LilyaNet(dao);
            model.init();
            expect(dao.connect).toHaveBeenCalledOnce();
            expect(model.dataMap.get(1)).toBe(word);
        });

        it('should get a data set from getSelectedWords', () => {
            var obj = {};
            dao.getWords = sinon.stub();
            dao.getWords.returns(() => obj );

            model = new LilyaNet(dao);
            var result = model.getAllWords();
            expect(result).toBe(obj);
        });

        it('should get a data set from getSelectedWords', () => {
            var obj = {selected:true};
            dao.getWords = sinon.stub();
            dao.getWords.returns(() => obj );

            model = new LilyaNet(dao);
            var result = model.getSelectedWords();
            expect(result).toBe(obj);
        });

    });


    describe('api tests', () =>{
        beforeEach(() => {
            model = new LilyaNet(dao);
        });

        it('should set word.selected to true on selectdWord', () => {
            var word = new Word('word', [], 'word', 'word');
            expect(word.selected).toBeFalsy();
            model.selectWord(word);
            expect(word.selected).toBeTruthy();
        });

        it('should return true if contains word, false if not', () => {
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([{id:'id', value : 'chat'}]);
            model.init();
            expect(model.containsWord('chat')).toBeTruthy();
            expect(model.containsWord('chien')).toBeFalsy();
            
        });

        it('should update letters on addLetter()', () => {
            expect(model.getLetters().length).toEqual(0);
            model.addLetter('l');
            expect(model.getLetters().indexOf('l') >= 0).toBeTruthy();
        });

        it('should return data object if word is stored in dataMap', () => {
            let word = {id:'id', value : 'chat'};
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([word]);
            model.init();
            let result = model.getWordData('chat').get();
            expect(result).toBe(word);
        });
        
        it('should reset letters', () => {
            model.addLetter('l');
            expect(model.getLetters().length).toEqual(1);
            model.resetWord();
            expect(model.getLetters().length).toEqual(0);
        });

        it('should get search term', () => {
            let word = {id:'id', value : 'chat', searchTerm : 'chat blanc'};
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([word]);
            model.init();
            expect(model.getSearchTerm('chat')).toEqual('chat blanc');

        });

        it('should get letters', () => {
            model.addLetter('l');    
            model.addLetter('o');    
            var letters = model.getLetters();
            expect(letters.length).toEqual(2);
            expect(letters[0]).toEqual('l');
            expect(letters[1]).toEqual('o');
        });

        it('should check is word resources are local', () => {
            let chat = {id:'id1', value : 'chat', location : 'remote'};
            let chien = {id:'id2', value : 'chien', location : 'local'};
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([chat, chien]);
            model.init();
            expect(model.isResourceLocal('chat')).toBeFalsy();            
            expect(model.isResourceLocal('chien')).toBeTruthy();            
        });

        it('should return true if word is complete on wordComplete() false if not', () => {
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([{id:'id', value : 'chat'}]);
            model.init();
            expect(model.wordComplete('chat')).toBeTruthy();
            expect(model.wordComplete('cha')).toBeFalsy();
        });

        it('should return all selected words');
        it('should return all selected syllables');
    });
});
