import { InjectionFactory } from '../store/injection-factory';

// TODO: Declares an interceptor
export function Interceptor() {

}

// TODO: Binds method with interceptor
export function Interceptors(...clazzes: Function[]) {
    return function(target: any, key: string): any {
        let metadata = Reflect.getMetadata('design:type', target, key)
        let intanceToInjectName = metadata.name;
    }
}

