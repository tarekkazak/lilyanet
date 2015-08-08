'use strict';

function DataModel() {
    var self = this;
    this.letters = [];
    this.allowedWords = ['chat', 'vache', 'chien', 'zebre', 'hibou', 'elephant' , 'singe', 'lapin', 'tortue', 'cochon', 'cheval', 'canard', 'souris', 'elmo', 'tchoupi', 'lion', 'loup', 'mouton', 'oiseau', 'ours', 'triangle', 'carre', 'rond', 'coq', 'poule', 'bebe', 'pomme', 'banane'];

    this.containsWord = function(word) {
        return self.allowedWords.indexOf(word.toLowerCase()) !== -1;
    }

    function resetWord() {
        self.letters = [];
    }
    
    function wordIsValid(word) {
       var valid = false;
       for(let w of self.allowedWords) {
           if(w.length >= word.length) {
               valid = true;
           }
       }
       return valid;
    };

    this.validateWord = function(){
        var word = self.letters.join('');
        if(self.containsWord(word) || !wordIsValid(word)) {
            resetWord();
        }
    };
    
}



module.exports =  new DataModel();
