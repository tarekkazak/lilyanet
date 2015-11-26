export class Word {
    constructor(value, syllables, location, searchTerm , selected = false) {
        this.value = value;
        this.syllables = syllables;
        this.searchTerm = searchTerm;
        this.location = location;
        this.selected = selected;
    }
}
