'use strict';
import { dao } from '../common/appContainer';
export class Word {

    @dao
    public  dbConnect;

    constructor() {
        this.dbConnect = null;
        let Schema = this.dbConnect.Schema;
        let wordSchema = new Schema({
            value : String,
            syllables : Array,
            searchTerm : String,
            location : String,
            selected : Boolean
        });
         var Word = this.dbConnect.model('Word', wordSchema);

    }
}
