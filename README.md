# ShopperBuddy - Create and share lists with your buddy.
  Vue 2 PWA app created with Firebase authentication, firestore database and hosting.
  
## Demo

 [Live site](https://shopper-buddy-c27a9.web.app/)
 
## Preview
 
 ![ShopperBuddy demo](media/ShopperBuddy_Demo.gif)
 
## Share your list with your buddy

![ShopperBuddy sharing demo](media/ShopperBuddy_Live_Sharing.gif)

## Firebase Setup

ShopperBuddy uses Firebase for authentication, database and hosting. Create your app on firebase and replace the environment keys with your configuration setting.

```js
// .env
VUE_APP_APIKEY = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VUE_APP_AUTHDOMAIN = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VUE_APP_DATABASEURL = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VUE_APP_PROJECTID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VUE_APP_STORAGEBUCKET = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VUE_APP_MESSAGINGSENDERID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
VUE_APP_APPID = "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

## Build Setup

``` bash
# install dependencies
npm install
# serve with hot reload at localhost:8080
npm run serve
# build for production with minification
npm run build
# deploy on Firebase
npm run deploy
```
