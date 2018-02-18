import 'reflect-metadata';
import { InjectionFactory } from '../store/injection-factory';

export type NextInterceptor = (...args: any[]) => any;

export interface InterceptorComponent {
    invoke(next: NextInterceptor, ...args: any[]): void;
}

interface ProxyPerformerProperties {
    nextStack: Function[];
    result?: any;
}

// It declares an interceptor
export function Interceptor(interceptor: InterceptorComponent | any) {
    if (!interceptor.prototype.invoke) {
        throw Error("An interceptor class MUST implements interface InterceptorComponent");
    }
    InjectionFactory.registerInstance(interceptor.name, interceptor.prototype.invoke);
}

// It binds method with interceptor
export function Intercepted(...clazzes: (InterceptorComponent | any)[]) {
    return function(target: any, key: string, descriptor: PropertyDescriptor): any {
        let interceptors = [];
        let i = clazzes.length;
        while(i--) {
            let interceptor = InjectionFactory.getSingleton(clazzes[i].name);
            interceptors.push(interceptor);
        }
        interceptors.push(target[key]);
        let performer = performInterception.bind({nextStack: interceptors});
        descriptor.value = performer;
    }
}

const performInterception = function(this: ProxyPerformerProperties, ...args: any[]){
    let next = this.nextStack.shift();
    if (next === undefined) {
        return this.result;
    }
    let performer = performInterception.bind({nextStack: this.nextStack, result: this.result});
    if (this.nextStack.length !== 0){
        this.result = next.apply({},[performer, ...args]);
    } else {
        this.result = next.apply({}, args);
    }
    return this.result;
}
