import { EventEmitter } from 'events';

export class InjectionStore {

    interceptors: any;
    singletons: any;

    constructor() {
        this.singletons = {};
        this.interceptors = {};
    }
}
