# Tango #
Motivation: Thinking is difficult.

1. Because you need back-and-forth, and it's hard to get that by yourself.
2. Because it's hard to keep track of the nested structure of your logic.

Tango intends to help mitigate these two problems.

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

### Technical Notes ###
- [Apiary Docs](http://docs.tango2.apiary.io)
- For local login, I left the backend code, but removed the front end code (from mean-starter).
- SSO login flow:

![SSO Login Flow](/sso-flow.png)

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

### To Do ###
- Tests for directives.
- Gulp task for deploying.
- E2E tests?
