import { InjectionStore } from "../store/injection-store";
import 'reflect-metadata';

var injectionStore = new InjectionStore();

export function Inject(target: any, key: string): any {
    let metadata = Reflect.getMetadata('design:type', target, key);
    let instanceToInject = injectionStore.getSingleton(metadata.name);
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

export namespace InjectionFactory {
    export function register(...clazzes: any[]) {
        clazzes.forEach((clazz:any) => {
            injectionStore.addInjection(clazz.name, Object.create(clazz.prototype));
        });
    }

    export function getSingletons() {
       return injectionStore;
    }
}

