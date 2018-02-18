import { Inject, Produces } from './inject';
import { InjectionFactory } from './../index';
import { expect } from 'chai';
import 'mocha';
import { Interceptor, Intercepted, InterceptorComponent, InterceptorProperties } from './interceptor';


describe('Interceptors', () => {

    @Interceptor
    class ExampleInterceptor implements InterceptorComponent{
        data: any = {};
        constructor(){
        }                
        invoke(this: InterceptorProperties): any {
            let result = this.next(...this.args);
            return `PRE${result}POST`;
        }
    }

    class ExampleIntercepted {
        @Intercepted(ExampleInterceptor)
        getHelloString(): string {
            console.log('METHOD CALLED');
            return 'hello';
        }

        @Intercepted(ExampleInterceptor)
        getNamedHelloString(name: string): string {
            return `Hello-Mr-${name}`;
        }
    }
    
    it('Interceptor is executed with function without parameters', () => {
        let obj = new ExampleIntercepted();
        const result = obj.getHelloString();
        expect(result).to.equals('PREhelloPOST');
    });

    it('Interceptor is executed with function with parameters', () => {
        let obj = new ExampleIntercepted();
        const result = obj.getNamedHelloString('pablo');
        expect(result).to.equals('PREHello-Mr-pabloPOST');
    });
});