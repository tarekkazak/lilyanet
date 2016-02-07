'use strict';
import {dao, Word} from '../common/appContainer';

export class LilyanetDao {
    @dao
    public dbConnect;
    public connected;

    connect() {
        let db = this.dbConnect.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open',  (callback) => {
            console.log('connected');
            this.connected = true;
        });
        this.dbConnect.connect('mongodb://107.170.31.85/lilyanet');

    }

    getWords(query) {
         return () => Word.find(query).exec();
    }
}
