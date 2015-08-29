(function() {
    var root = this,
        events = {
        WORD_UPDATED : 'wordUpdated',
        VIEW_UPDATED : 'viewUpdated',
        RENDER_COMPLETE : 'renderComplete',
        LETTER_UPDATED : 'letterUpdated'
    };

    if(module && module.exports) {
        module.exports = events;
    } else {
        root.IO_EVENTS = events;
    }
 }());
