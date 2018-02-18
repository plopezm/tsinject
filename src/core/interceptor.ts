import 'reflect-metadata';
import { InjectionFactory } from '../store/injection-factory';

export interface InterceptorComponent {
    invoke(): void;
}

export interface InterceptorProperties {
    next: Function;
    args: any[];
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
        let interceptor = InjectionFactory.getSingleton(clazzes.name);
        let performer = performInterception.bind({interceptor: interceptor, target: target[key]});
        descriptor.value = performer;
    }
}

const performInterception = function(this: ProxyPerformerProperties, ...args: any[]){
    console.log("performInterception", "this =", this);
    return this.interceptor.apply({next: this.target, args: args});
}
