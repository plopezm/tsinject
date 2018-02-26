# tsinject

Dependency injection & cross-cutting concern library. This library provides the necessary tools to implement any application using DI and interceptors.

# Installing

```
npm install --save @plopezm/tsinject
```

# How to use it

1. Defining a simple class: 

```
@Injectable
export class UserService {

    users: any = {};

    constructor(){
        this.users["plopez"] = {
            username: "plopez",
            password: "testing"
        }
    }

    get(username: string): any{
        return this.users[username];
    }

    create(user: User): any{
        this.users[user.username] = user;
        return user;
    }

}

```

2. Use your singleton

```
import { UserService } from './services/user.service';
import { Inject } from '@plopezm/tsinject';

export class UserResource {

    @Inject()
    userService: UserService;

    constructor(){        
    }

}
```

# Using an implementation gotten from a factory

Injecting from a factory is really easy. In this case we don't have to register any class in the InjectionFactory. This is due to @Produces("") decorator registers a new singleton using the name included. To use this factory object we have to use @Inject("") with the same name that you used in @Produces("").

```
import { Inject, Produces } from "@plopezm/tsinject";

export class UserResource {

    // It gets the default singleton registered
    @Inject()
    userService: UserService;

    // It gets the specific singleton created in the named produces method
    @Inject("MyFactoryService")
    userServiceFromFactory: UserService;

    // Creates a new object and registers it in the InjectionFactory automatically using the name included in @Produces
    @Produces("MyFactoryService")
    produceUserService() {
        var userService = new UserService();
        userService.initialize(example, example2);
        return userService;
    }

    constructor(){        
    }

}
```

# Implementing Interceptors

Interceptors is the way that we use to implement cross-cutting functionalities. This library provides a way to implement our interceptors for a typescript nodejs application. This library supports multi-interceptor declaration, so you can declare multiple interceptors for a method.

1. Implementing interceptors

```
    import { Interceptor, Intercepted, InterceptorComponent, NextInterceptor, InterceptedClass } from "@plopezm/tsinject";

    @Interceptor
    class ExampleInterceptor implements InterceptorComponent{
        invoke(next: NextInterceptor, classIntercepted: InterceptedClass, ...args: any[]): any {

            // Here the real method (or next interceptor) is executed
            // We have to get the result returned by next function.
            // next() could be a call to the real method or a call to the next interceptor
            let result = next(...args);

            // Finally we have to return the value that we want to return ( we can modify it, or args, ...)
            // In this example we are going to modify the original method output adding '[]'
            return `[${result}]`;
        }
    }
```

2. Declaring the interceptor in the desired method

```
    @Intercepted(ExampleInterceptor)
    getNamedHelloString(name: string): string {
        return `Hello Mr ${name}`;
    }
```

3. Executing our method

```
    let obj = new ExampleIntercepted();
    // The output will be '[Hello Mr Pablo]' instead of 'Hello Mr Pablo'
    const result = obj.getNamedHelloString('Pablo');
```

In addition is it possible to set more than one interceptors for a method. The order of declaration is important because it will detemine the execution order. For example:

```
        @Intercepted(ExampleInterceptor, ExampleInterceptor2)
        getNamedHelloWithSurnameString2(name: string, surname: string, surname2: string): string {
            return `Hello Mr ${name} ${surname} ${surname2}`;
        }
```

In this example the interceptor 'ExampleInterceptor' will execute in first place, then 'ExampleInterceptor2' and finally the method 'getNamedHelloWithSurnameString2'
