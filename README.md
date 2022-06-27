![](https://iproyal.com/wp-content/uploads/2018/11/Logo-1.png)
## IPRoyal Residential API Wrapper

JavaScript Async/Await API for proxy service [IPRoyal.com](https://iproyal.com/)

## API

To work with the API, you must have an account token. 
You can get it in your personal account on the portal.

## Starting

Connect the IPRoyal module to Node.JS and create a new instance of the class.

```javascript
let iproyal = require(`iproyal-wrapper`);
let token = `abc`; // IPRoyal account token

let account = new iproyal(token);
```

## Methods
* new IPRoyal();
* account.getInfo();
* account.getSubUsers();
* account.createSubUser();
* account.getSubUserInfo();
* account.updateSubUserInfo();
* account.addSubUserTraffic();
* account.takeSubUserTraffic();
* account.getAvailableCountries();
* account.getAvailableCountrySets();
* account.getAvailableRegions();
* account.getProxyHostNames();
* account.generateUserProxyList();

## Examples

```javascript
let account = new iproyal(`abc`);
let subusersList = await account.getSubUsers(10);
console.log(subusersList);
console.log(await subusersList.next());
console.log(await subusersList.next());
```

```javascript
let account = new iproyal(`abc`);
let newSubUser = await account.creteSubUser(`login`, `password`, traffic);
console.log(anewSubUser);
```

```javascript
let newSubUser = await account.creteSubUser(`login`, `password`, traffic);
console.log(await account.addSubUserTraffic(newSubUser.id, 4));
```
