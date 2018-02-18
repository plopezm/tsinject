import { EventEmitter } from 'events';

export class InjectionStore {
    singletons: any;

    constructor() {
        this.singletons = {};
    }
}
