import { EventEmitter } from 'events';
import { InjectionStore } from './injection-store';

export type NoficationCallback = (...args: any[]) => void;

export namespace InjectionFactory {
    const injectionStore = new InjectionStore();
    const subscriptions: EventEmitter = new EventEmitter;

    /**
     * Registers a default instance of Typescript classes
     * 
     * @param clazzes 
     */
    export function register(...clazzes: any[]) {
        clazzes.forEach((clazz:any) => {
            let instance = new clazz.prototype.constructor;
            injectionStore.singletons[clazz.name] = instance;
            subscriptions.emit(clazz.name);
        });
    }

    export function removeInstance(clazz: any) {
        delete injectionStore.singletons[clazz.name];
    }

    /**
     * Registers an specific instance in a given name
     * 
     * @param injectionName 
     * @param instance 
     */
    export function registerInstance(injectionName: string, instance: any){
        injectionStore.singletons[injectionName] = instance;
        subscriptions.emit(injectionName);
    }

    /**
     * Returns an specific Singleton
     * 
     * @param name 
     */
    export function getSingleton(name: string) {
        return injectionStore.singletons[name];
    }

    /** 
     * Returns all Singletons stored
    */
    export function getSingletons() {
       return injectionStore.singletons;
    }

    /**
     * Creates a subscription for a Singleton name
     * 
     * @param intanceToInjectName Singleton name
     * @param onNofication Callback when the event is emitted
     */
    export function subscribeToInjection(intanceToInjectName: string, onNofication: NoficationCallback) {
        subscriptions.on(intanceToInjectName, onNofication);
    }
}
