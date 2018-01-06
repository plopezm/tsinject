export class InjectionStore {

    singletons: any;

    constructor() {
        this.singletons = {};
    }

    addInjection(name: string, object: any){
        this.singletons[name] = object;
    }

    getSingleton(name: string) {
        return this.singletons[name];
    }
    
}