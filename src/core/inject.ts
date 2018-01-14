import { InjectionStore } from "../store/injection-store";
import { EventEmitter } from 'events';
import 'reflect-metadata';

var injectionStore = new InjectionStore();
var subscriptions: EventEmitter = new EventEmitter;


function performInject(target: any, key: string, instanceToInject: any) {
    Object.defineProperty(target, key, {
        get: function () {
            return instanceToInject;
        },
        set: function (val) {
            instanceToInject = val;
        },
        enumerable:true,
        configurable:true
    });
}


export function Inject(named?: string){
    return function(target: any, key: string): any {
        let metadata = Reflect.getMetadata('design:type', target, key)
        let intanceToInjectName = named === undefined ? metadata.name : named;
        let instanceToInject = injectionStore.getSingleton(intanceToInjectName);
        if(instanceToInject !== undefined){
            performInject(target, key, instanceToInject);
            return;
        }
        subscriptions.on(intanceToInjectName, () => {
                let instanceToInject = injectionStore.getSingleton(intanceToInjectName);
                performInject(target, key, instanceToInject);
        });
    }
}

export function Produces(name: string) {
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any {
        let producer:any = descriptor.value;      
        let instance = producer.call(target);
        injectionStore.addInjection(name, instance);
        subscriptions.emit(name);
    }
}

export namespace InjectionFactory {
    export function register(...clazzes: any[]) {
        clazzes.forEach((clazz:any) => {
            let instance = new clazz.prototype.constructor;
            injectionStore.addInjection(clazz.name, instance);
            subscriptions.emit(clazz.name);
        });
    }

    export function getSingletons() {
       return injectionStore;
    }
}

