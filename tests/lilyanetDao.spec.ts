'use strict';
var mongooseMock = require('mongoose-mock');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

function Connection() {

}

util.inherits(Connection, EventEmitter);

import {LilyanetDao} from '../app/model/lilyanetDao';
describe('lilyanetDao tests', () => {
    let dao;
    
    beforeEach(() => {
       dao = new LilyanetDao(); 
       dao.dbConnect = mongooseMock;
       console.log('mockgoose', dao.dbConnect.connect);
    });
    
    it('should connect to database', (done) => {
        var conn = new Connection(); 
        dao.dbConnect.connection = conn;
        
        setTimeout(function() {
         conn.emit('open');  
        },10);

        dao.connect();
        setTimeout(() => {
            expect(dao.connected).toBeTruthy();
            done();
        }, 20);
    });
    it('should get words dataset', () => {
        
    });
});
