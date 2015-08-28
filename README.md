# MEAN Starter App #
Motivation: most apps require boilerplate code to set up user authentication. You can avoid this by using MEAN Starter.

Features:
- CRUD for Users
- Signup and Login forms with validation
- SSO (largely based off of [this tutorial](https://scotch.io/courses/easy-node-authentication))
- Front and back end authorization
- Admin panel
- Tests

### Technical Notes ###
- [Apiary Docs](http://docs.meanstarter.apiary.io)
- If you're going to be using Facebook/Twitter/Google, you'll need to register your app with them. Use the following links:
    - [Facebook](https://developers.facebook.com/apps/) ([tutorial](https://scotch.io/tutorials/easy-node-authentication-facebook))
    - [Twitter](https://apps.twitter.com/) ([tutorial](https://scotch.io/tutorials/easy-node-authentication-twitter))
    - [Google](https://console.developers.google.com) ([tutorial](https://scotch.io/tutorials/easy-node-authentication-google))
- After doing so, you'll want to rename `example-config.json` to `config.json` and add your app keys/ids/secrets. `config.json` is in `.gitignore`, so this sensitive data won't be tracked.
- Facebook appends `#_=_` to the return URL, which is ugly and potentially problematic. You may want to follow [this](http://stackoverflow.com/questions/7131909/facebook-callback-appends-to-return-url) advice in cleaning it up.
- You may want to add a `.notes.txt` file to keep notes with. It's in `.gitignore`, so it won't get tracked and it'd just be for your reference.
- SSO login flow:


![SSO Login Flow](/sso-flow.png)

### Ways you may want to expand the functionality ###
- Add fields to the schema.
- Add validations to the schema.
- Add the ability to authenticate with another service like [GitHub](https://github.com/cfsghost/passport-github) or [LinkedIn](https://github.com/jaredhanson/passport-linkedin). The code should be essentially the same as the existing Facebook/Twitter/Google code.
- Add the ability to connect a given account in multiple ways. Reference [this](https://scotch.io/tutorials/easy-node-authentication-linking-all-accounts-together) tutorial. I didn't add this functionality by default because I figured that it's a rather rare use case and I wanted to keep the code as simple as possible.
- The way it's designed, you can't connect to, say, more than one Google account (you also can't connect to more than one Local, Twitter, or Google account). Ie. I wouldn't be able to connect to my azerner3@gmail.com account _and_ my azerner@mobiquityinc.com account. If you need to support this sort of functionality, you'll have to redesign the schema. [Discriminators](http://thecodebarbarian.com/2015/07/24/guide-to-mongoose-discriminators) might be useful.

### Technologies Used ###
- Front end:
    - UI Router
    - UI Bootstrap
    - Karma + Jasmine
    - Todd Motto's [Angular style guide](https://github.com/toddmotto/angularjs-styleguide)
- Back end:
    - Mongoose
    - Passport (Local + FB + Google + Twitter)
    - Supertest + Mocha + Assert
- Gulp
- [Component-based](https://scotch.io/tutorials/angularjs-best-practices-directory-structure) file structure


### Commands ###
```
// START SERVER:
node server/app.js

// KARMA TESTS:
gulp karma

// MOCHA TESTS:
gulp mocha

// LIVE RELOAD:
gulp livereload
```

### To Do ###
- Fix run block problem for karma tests.
- Tests for directives.
- Gulp task for deploying.
- E2E tests?
- test
