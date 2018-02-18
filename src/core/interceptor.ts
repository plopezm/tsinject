import 'reflect-metadata';
import { InjectionFactory } from '../store/injection-factory';

export interface InterceptorComponent {
    invoke(): void;
}

export interface InterceptorProperties {
    next: Function
}

interface ProxyPerformerProperties {
    interceptor: Function;
    target: Function;
}

// TODO: Declares an interceptor
export function Interceptor(interceptor: Function | InterceptorComponent) {
    console.log("Interceptor: ", interceptor);
    console.log("invoke: ", interceptor.prototype.invoke);
    InjectionFactory.registerInstance(interceptor.name, interceptor.prototype.invoke);
}

// TODO: Binds method with interceptor
export function Intercepted(clazzes: any) {
    return function(target: any, key: string, descriptor: PropertyDescriptor): any {
        //let metadata = Reflect.getMetadata('design:type', target, key);
        let interceptedMethod = target[key];
        let intanceToInjectName = interceptedMethod.name;
        console.log('metadata: ', interceptedMethod);
        console.log('clazzes', clazzes);
        console.log('descriptor', descriptor);
        let interceptor = InjectionFactory.getSingleton(clazzes.name);
        console.log('interceptor', interceptor);
                
        Object.defineProperty(target, 'interceptor', {
            value: interceptor
        });
        Object.defineProperty(target, 'target', {
            value: target[key]
        });
        descriptor.value = performInterception;        
    }
}

const performInterception = function(this: ProxyPerformerProperties){
    console.log("performInterception", "this =", this);
    return this.interceptor.apply({next: this.target});
}
