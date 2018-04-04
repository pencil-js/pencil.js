# Contributing to Pencil.js

First of all, welcome and thanks for taking the time to contribute. :+1:

## Code of conduct

This project and everything about it is ruled by our [code of conduct](code_of_conduct.md).
Everyone is expected to follow those simples rules. If you see unacceptable behavior, be sure to report it to guillaume.martigny@gmail.com.

## How to contribute

### Report bugs

The easiest way to help us, is by reporting anything fishy about Pencil.js with a [new issue](https://github.com/GMartigny/pencil.js/issues/new).
But first, be sure to check if it's not already on [the list of known bugs](https://github.com/GMartigny/pencil.js/issues?q=is%3Aissue+is%3Aopen+label%3Abug).

Following our [issue template](.github/issue_template.md) allow for a better understanding and a quicker resolution.

### Suggesting features

We are eager to listen to the users, so if you feel like something missing or not working as you expect, you can fill a [feature request](https://github.com/GMartigny/pencil.js/issues/new).
As always, take a look first at the [list of requests](https://github.com/GMartigny/pencil.js/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement+) and upvote what you want most.

### Code contribution

You want to get your hands dirty ? Good :wink:

Here's a few steps to guide you.

#### Setup

You need to [fork the repo](https://help.github.com/articles/fork-a-repo/) to make a copy for you.
Then you can clone this copy to your machine.

    git clone git@github.com:your-name-here/pencil.js.git

We use [lerna](https://lernajs.io/) to manage the modular aspect of the project, so you'll need it too.

    npm install -g lerna

Lastly, ask lerna to boot everything up.

    lerna bootstrap

#### Coding

You can then start to make modification to the code. Here's a few useful commands.

To build the project, you can simply run the build script once or ask it to run at each modifications you make.

    npm run build
    # or
    npm run build -- --watch

In the [playground directory](playground/), you'll find a basic HTML page pointing to the build file.
You can then mess with the result to see your modifications in actions.

#### Check

In order for everyone to work in harmony, we have a few guidelines.

We use [eslint](https://eslint.org/) to check the code-style. Configure your IDE to follow the [code-style](.eslintrc) or run the linting script.

    npm run lint

There should be a test file for each modules. You can run all the tests with the test script.

    npm test

#### Committing

Once you're done editing the code, checking you forget no lint and running the tests successful, you can create your pull request.

Commit your code, part by part, using meaningful commit message with git.

    git commit -m "Some description" file1 file2 ...

When no changes are left, you can push it online.

    git push

On your fork at https://github.com/your-name-here/pencil.js, you should see a button to create a new pull request.
Once you've clicked it, confirm the committed files and add a clear title and message linking to the issue or feature.

Finally, we'll review your code and eventually give you feedback.

If everything goes well, you'll be an official contributor of pencil.js ! :v:
