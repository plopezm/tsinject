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
InjectionFactory.register(UserService);
import { UserResource } from "./resources/user-resource";
```

**NOTE: It is required to register the class in InjectionFactory before importing the classes who injects it**

3. Use your singleton

```
import { Inject } from "@plopezm/tsinject";

export class UserResource {

    @Inject
    userService: UserService;

    constructor(){        
    }

}
```

