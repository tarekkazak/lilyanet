var sinon = require('sinon');
require('jasmine-sinon');
var mongoose = require('mongoose')
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
    beforeAll(() => {
    });

    beforeEach(() => {
        dao = new LilyaNetDao();
        model = new LilyaNet(dao);
    });

    it('should connect to database on init ', () => {
        dao.connect = sinon.spy();
        model.init();
        expect(dao.connect).toHaveBeenCalledOnce();
    });

    it('should get selected words on getSelectedWords', () => {
        var obj = {selected:true};
        dao.getWords = sinon.mock();
        dao.getWords.returns(() => obj);
        //reset model
        model = new LilyaNet(dao);
        var result = model.getSelectedWords();
        expect(result).toBe(obj);
    });

});
