import {messageBus} from '../../common/appContainer';

export abstract class AbstractMediator {

    @messageBus
    public messageBus;
    
    constructor(protected component) {
    }

}
export function mediate(...mediatorTypes) {
    return function (target:any) {
            var original = target;

            // a utility function to generate instances of a class
            function construct(constructor, args) {

                let instance =  new constructor(...args);
                for(let Type of mediatorTypes) {
                    let mediator = new Type(instance)
                }
                return instance;
            }

            // the new constructor behaviour
            var f : any = function () {
            //console.log("New: " + original.name); 
                return construct(original, arguments);
            }

            // copy prototype so intanceof operator still works
            f.prototype = original.prototype;

            // return new constructor (will override original)
            return f;

    };

} 
