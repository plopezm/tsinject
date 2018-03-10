import 'reflect-metadata';
import { InjectionFactory } from '../store/injection-factory';

function performInject(target: any, key: string, instanceToInject: any) {
    Object.defineProperty(target, key, {
        get: function() {
            return instanceToInject;
        },
        set: function(val) {
            instanceToInject = val;
        },
        enumerable: true,
        configurable: true
    });
}

export function Injectable(clazz: any) {
    InjectionFactory.register(clazz);
}

export function Inject(named?: string) {
    return function(target: any, key: string): any {
        const metadata = Reflect.getMetadata('design:type', target, key);
        if (!metadata && !named) {
            throw new Error('[Inject] The target class has not been defined. If you already defined it, please import the class before');
        }
        const intanceToInjectName = named === undefined ? metadata.name : named;
        const instanceToInject = InjectionFactory.getSingleton(intanceToInjectName);

        if (instanceToInject !== undefined) {
            performInject(target, key, instanceToInject);
            return;
        }

        InjectionFactory.subscribeToInjection(intanceToInjectName, () => {
            performInject(target, key, InjectionFactory.getSingleton(intanceToInjectName));
        });
    };
}

export function Produces(name: string) {
    return function(target: any, key: string, descriptor: TypedPropertyDescriptor<any>): any {
        const producer: any = descriptor.value;
        const intanceBuild = producer.call();
        InjectionFactory.registerInstance(name, intanceBuild);
    };
}
