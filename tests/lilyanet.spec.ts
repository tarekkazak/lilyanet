'use strict';
var sinon = require('sinon');
//require('jasmine-sinon'); doesn't work with grunt-jasmine-nodejs
import {LilyaNet} from '../app/model/lilyanet';
import {LilyanetDao} from '../app/model/lilyanetDao';

describe('lilyanet model tests', () => {
    let model, dao;
    let data ={
            chat : {
                location : 'remote',
                syllables : ['chat']

            }
        };

    beforeEach(() => {
        dao = new LilyanetDao();
        model = new LilyaNet(dao);
        console.log('log')
    });


    describe('back end connection tests', () => {
        it('should connect to database on init', () => {
            dao.connect = sinon.spy();
            model.init();
            sinon.assert.calledOnce(dao.connect);
        });

        it('should get a data set from getAllWords', () => {
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

        xit('should set word.selected to true on selectdWord', () => {
        //var word = new Word('word', [], 'word', 'word');
        //   expect(word.selected).toBeFalsy();
        //  model.selectWord(word);
        //  expect(word.selected).toBeTruthy();
        });

        it('should return true if contains word, false if not', () => {
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([{id:'id', value : 'chat'}]);
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
            expect(model.isResourceLocal('chat')).toBeFalsy();            
            expect(model.isResourceLocal('chien')).toBeTruthy();            
        });

        it('should return true if word is complete on wordComplete() false if not', () => {
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([{id:'id', value : 'chat'}]);
            expect(model.wordComplete('chat')).toBeTruthy();
            expect(model.wordComplete('cha')).toBeFalsy();
        });

        it('should return all selected words', () => {
            let chat = {selected : true, id:'id1', value : 'chat', location : 'remote'};
            let chien = { id:'id2', value : 'chien', location : 'local'};
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([chat, chien]);
            let result = model.getWordList();
            expect(result.length).toEqual(1);
            expect(result[0]).toBe('chat');
        });

        it('should return all selected syllables', () => {
            let cheval = {selected : true, id:'id1', value : 'cheval', syllables : ['che', 'val'], location : 'remote'};
            let chien = { selected:true, id:'id2', syllables: ['chien'], value : 'chien', location : 'local'};
            let koala = { id:'id3', syllables: ['ko', 'a', 'la'], value : 'chien', location : 'local'};
            model.getAllWords = sinon.stub();
            model.getAllWords.returns([cheval, chien]);
            let result = model.getSyllablesList();
            expect(result.length).toEqual(2);
            expect(result[0].length).toEqual(2);
            expect(result[0][0]).toBe('che');
            expect(result[0][1]).toBe('val');
            expect(result[1].length).toEqual(1);
            expect(result[1][0]).toBe('chien');
        });
    });
});
