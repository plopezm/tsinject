# tsinject

Dependency injection library. Currently only Singletons are implemented

# Installing

```
npm install --save @plopezm/tsinject
```

# How to use it

1. Defining a simple class: 

```
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

2. Import it in index.ts and call to InjectorFactory

```
import { InjectionFactory } from '@plopezm/tsinject'
import { UserService } from './services/user-service';
import { UserResource } from "./resources/user-resource";

InjectionFactory.register(UserService);
```

3. Use your singleton

```
import { Inject } from "@plopezm/tsinject";

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

