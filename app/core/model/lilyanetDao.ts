import {dao, Word, Tag} from '../../common/appContainer';

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
        return () => Word.find(query).sort({value : 'asc'}).exec();
    }


    findById(id) {
        return Word.findById(id).exec();
    }


    addWord(word):any {
        let newWord = new Word(word);
        return this.save(newWord);
    }

    getTags(query):any {
        query === undefined ? null : query;
        return () => Tag.find(query).sort({value : 'asc'}).exec();
    }

    addTag(tag):any {
        let newTag = new Tag(tag);
        console.log('new tag', newTag);
        return this.save(newTag);
    }
    deleteTag(tag):any {
        return Tag.findOneAndRemove({id: tag._id});
    }

    save(model):any {
        return model.save();
    }
}
