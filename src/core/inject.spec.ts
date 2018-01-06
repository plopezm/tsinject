import { Inject, InjectionFactory } from './inject';
import { expect } from 'chai';
import 'mocha';


describe('InjectionFactory', () => {
    class Example {
        text: string;
    }
    it('Object is registered', () => {
        InjectionFactory.register(Example);
        class Tester {
            @Inject example: Example;
        } 
        let singletons = InjectionFactory.getSingletons();
        expect(Object.keys(singletons.singletons).length).to.equals(1);
        expect(singletons.singletons['Example']).to.not.equals(undefined);
    });

    it('Object is injected', () => {
        InjectionFactory.register(Example);
        class Tester {
            @Inject example: Example;
        } 
        const tester = new Tester();
        expect(tester.example).to.not.equals(undefined);
    });

    it('Singleton object is modified and the value is present when injected', () => {
        InjectionFactory.register(Example);
        class Tester {
            @Inject example: Example;
        }    
        const tester = new Tester();
        tester.example.text = "example value";
        const tester2UsesSingleton = new Tester();
        expect(tester2UsesSingleton.example.text).to.equals("example value");
    });
    
});
