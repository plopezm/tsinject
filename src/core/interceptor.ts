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

// It declares an interceptor
export function Interceptor(interceptor: InterceptorComponent | any) {
    if (!interceptor.prototype.invoke) {
        throw Error("An interceptor class MUST implements interface InterceptorComponent");
    }
    InjectionFactory.registerInstance(interceptor.name, interceptor.prototype.invoke);
}

// It binds method with interceptor
export function Intercepted(...clazzes: any[]) {
    return function(target: any, key: string, descriptor: PropertyDescriptor): any {
        for (let clazz of clazzes) {
            let interceptor = InjectionFactory.getSingleton(clazz.name);
            let performer = performInterception.bind({interceptor: interceptor, target: target[key]});
            descriptor.value = performer;
        }
    }
}

const performInterception = function(this: ProxyPerformerProperties, ...args: any[]){
    return this.interceptor.apply({next: this.target, args: args});
}
