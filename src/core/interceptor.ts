import 'reflect-metadata';
import { InjectionFactory } from '../store/injection-factory';

export type NextInterceptor = (...args: any[]) => any;

export interface InterceptorComponent {
    invoke(next: NextInterceptor, classIntercepted: InterceptedClass, ...args: any[]): void;
}

export interface InterceptedClass {
    targetClass: any;
    targetMethodName: string;
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

        // Defining the initial state
        let state: ProxyPerformerProperties = {
            nextStack: interceptors,
            interceptedClass:{
                targetClass: target,
                targetMethodName: key
            }
        }
        // It creates a copy of the function with a specific this
        let performer = performInterception.bind(state);
        descriptor.value = performer;
    }
}

interface ProxyPerformerProperties {
    /** 
     * The next function to be executed (could be an interceptor or the target method)
    */
    nextStack: Function[];
    /** 
     * The intercepted class
    */
    interceptedClass: any;
    /** 
     * Result of every interceptor executed is stored here in order to be provided to the next function
    */
    result?: any;
}

const performInterception = function(this: ProxyPerformerProperties, ...args: any[]){
    let next = this.nextStack.shift();
    if (next === undefined) {
        return this.result;
    }
    let state: ProxyPerformerProperties = {
        nextStack: this.nextStack,
        interceptedClass: this.interceptedClass,
        result: this.result
    }
    let performer = performInterception.bind(state);
    if (this.nextStack.length !== 0){
        // Executes 'next' function with performer and args if there are more interceptors
        this.result = next.apply({},[performer, this.interceptedClass, ...args]);
    } else {
        // Executes 'next' function with args if there aren't more interceptors
        this.result = next.apply({}, args);
    }
    return this.result;
}
