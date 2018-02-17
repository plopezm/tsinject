import 'reflect-metadata';
import { InjectionStore } from '../store/injection-store';
import { InjectionFactory } from '../store/injection-factory';

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
        let instanceToInject = InjectionFactory.getSingleton(intanceToInjectName);

        if(instanceToInject !== undefined){
            performInject(target, key, instanceToInject);
            return;
        }

        InjectionFactory.subscribeToInjection(intanceToInjectName, () => {
            let instanceToInject = InjectionFactory.getSingleton(intanceToInjectName);
            performInject(target, key, instanceToInject);
        });
    }
}

export function Produces(name: string) {
    return function (target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any {
        let producer:any = descriptor.value;      
        let instance = producer.call(target);
        InjectionFactory.registerInstance(name, instance);
    }
}

