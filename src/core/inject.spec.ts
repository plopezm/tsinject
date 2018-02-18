import { Inject, Produces } from './inject';
import { InjectionFactory } from './../index';
import { expect } from 'chai';
import 'mocha';


describe('InjectionFactory', () => {
    class Example {
        data: any = {};
        constructor(){
            this.data['example'] = {
                "text": "example"
            }
        }
    }
    it('Object is registered', () => {
        class Tester {
            @Inject()
            example: Example;
        } 
        InjectionFactory.register(Example);
        let singletons = InjectionFactory.getSingletons();
        expect(Object.keys(singletons).length).not.to.equals(0);
        expect(singletons['Example']).to.not.equals(undefined);
    });

    it('Object is injected', () => {
        class Tester {
            @Inject()
            example: Example;
        } 
        InjectionFactory.register(Example);
        const tester = new Tester();
        expect(tester.example).to.not.equals(undefined);
    });

    it('Singleton object is modified and the value is present when injected', () => {
        InjectionFactory.register(Example);
        class Tester {
            @Inject()
            example: Example;
        }
        const tester = new Tester();
        expect(tester.example.data).to.not.equals(undefined);
        tester.example.data['other'] = "example value";
        const tester2UsesSingleton = new Tester();
        expect(tester2UsesSingleton.example.data["other"]).to.equals("example value");
    });

    it('Singleton object is gotten from a factory method', () => {
        InjectionFactory.register(Example);
        class Tester {
            @Inject("exampleFactory")
            example: Example;
        }
        class ExampleFactory {
            @Produces("exampleFactory")
            static produceExample(){
                let example: Example = new Example();
                example.data = "Initialized";
                return example;
            }
        }
        const tester = new Tester();
        expect(tester.example.data).to.not.equals(undefined);
        expect(tester.example.data).to.equals("Initialized");
    });
    
});
