import { Inject, Produces } from './inject';
import { InjectionFactory } from './../index';
import { expect } from 'chai';
import 'mocha';
import { Interceptor, Intercepted, InterceptorComponent, InterceptorProperties } from './interceptor';


describe('Interceptors', () => {

    @Interceptor
    class ExampleInterceptor implements InterceptorComponent{
        invoke(this: InterceptorProperties): any {
            let result = this.next(...this.args);
            return `[${result}]`;
        }
    }

    @Interceptor
    class ExampleInterceptor2 {
        invoke(this: InterceptorProperties): any {
            let result = this.next(...this.args);
            return `<${result}>`;
        }
    }

    class ExampleIntercepted {
        @Intercepted(ExampleInterceptor)
        getHelloString(): string {
            return 'Hello';
        }

        @Intercepted(ExampleInterceptor)
        getNamedHelloString(name: string): string {
            return `Hello Mr ${name}`;
        }

        @Intercepted(ExampleInterceptor)
        getNamedHelloWithSurnameString(name: string, surname: string, surname2: string): string {
            return `Hello Mr ${name} ${surname} ${surname2}`;
        }

        @Intercepted(ExampleInterceptor, ExampleInterceptor2)
        getHelloString2(): string {
            return 'Hello';
        }
    }
    
    it('Interceptor is executed with function without parameters', () => {
        let obj = new ExampleIntercepted();
        const result = obj.getHelloString();
        expect(result).to.equals('[Hello]');
    });

    it('Interceptor is executed with function with parameters', () => {
        let obj = new ExampleIntercepted();
        const result = obj.getNamedHelloString('Pablo');
        expect(result).to.equals('[Hello Mr Pablo]');
    });

    it('Interceptor is executed with a lot of parameters', () => {
        let obj = new ExampleIntercepted();
        const result = obj.getNamedHelloWithSurnameString('Pablo', 'Lopez', 'Martinez');
        expect(result).to.equals('[Hello Mr Pablo Lopez Martinez]');
    });

    it('Multiple interceptors are executed', () => {
        let obj = new ExampleIntercepted();
        const result = obj.getHelloString2();
        expect(result).to.equals('<[Hello]>');
    });
});