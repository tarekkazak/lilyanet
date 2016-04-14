import {dao, Word} from '../../common/appContainer';

export class LilyanetDao {
    @dao
    public dbConnect;
    public connected;

    connect() {
        let db = this.dbConnect.connection;
        return new Promise((resolve, reject) => {
            db.on('error', console.error.bind(console, 'connection error:'));
            db.once('open',  (callback) => {
                console.log('db connected');
                this.connected = true;
                resolve();
            });
            this.dbConnect.connect('mongodb://104.131.104.228/lilyanet');
        });

    }

    close() {
        this.dbConnect.connection.close();
    }

    getWords(query):any {
        query === undefined ? null : query;
        console.log('query', query);
        return () => Word.find(query).exec();
    }

    findById(id) {
        return Word.findById(id).exec();
    }

    addWord(word):any {
        let newWord = new Word(word);
        return this.save(newWord);
    }

    save(word):any {
    //console.log('save', word);
        return word.save();
    }
}
