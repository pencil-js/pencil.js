# Contributing to Pencil.js

First of all, welcome and thanks for taking the time to contribute. :+1:

## Code of conduct

This project and everything about it is ruled by our [code of conduct](code_of_conduct.md).
Everyone is expected to follow those simples rules. If you see unacceptable behavior, be sure to report it to guillaume.martigny@gmail.com.

## How to contribute

### Report bugs

The easiest way to help us, is by reporting anything fishy about Pencil.js with a [new issue](https://github.com/pencil-js/pencil.js/issues/new).
But first, be sure to check if it's not already on [the list of known bugs](https://github.com/pencil-js/pencil.js/issues?q=is%3Aissue+is%3Aopen+label%3Abug).

Following our [issue template](.github/issue_template.md) allow for a better understanding and a quicker resolution.

### Suggesting features

We are eager to listen to the users, so if you feel like something missing or not working as you expect, you can fill a [feature request](https://github.com/pencil-js/pencil.js/issues/new).
As always, take a look first at the [list of requests](https://github.com/pencil-js/pencil.js/issues?q=is%3Aissue+is%3Aopen+label%3Aenhancement+) and upvote what you want most.

### Code contribution

You want to get your hands dirty ? Good :wink:

Here's a few steps to guide you.

#### Setup

You need to [fork the repo](https://help.github.com/articles/fork-a-repo/) to make a copy for you.
Then you can clone this copy to your machine.

    git clone git@github.com:<YOUR_GITHUB_ID>/pencil.js.git
    cd pencil.js
    npm install

We use [lerna](https://lernajs.io/) to manage the modular aspect of the project. So, you have to run the `init` script.

    npm run init

Then, you'll need to create a new branch to host your modifications. Use a relevant name for your branch (ex: new_heart_component, refacto_all_tests ...).

    git checkout -b <YOUR_BRANCH_NAME>

#### Coding

You can then start to make modification to the code. Here's a few useful commands.

To build the project, you can simply run the build script. It will automatically re-build each time you make any change.

    npm run play

In the [playground Javascript file](playground/playground.js), you'll find a basic setup script.
You can then mess with it to see your modifications in actions.

#### Check

In order for everyone to work in harmony, we have a few guidelines.

We use [eslint](https://eslint.org/) to check the code-style with a linting script.

    npm run lint

There's a test file for each modules. You can run all the tests with the test script.

    npm test

If you've made structural changes, you can build to check that everything is in order.

    npm run build

#### Committing

Once you're done editing the code, checking you forget no lint and running the tests successfully, you can create your pull request.

Commit your code, part by part, using meaningful commit message with git.

    git commit -m "Some description" file1 file2 ...

When no changes are left, you can push it online.

    git push

On your fork at https://github.com/your-name-here/pencil.js, you should see a button to create a new pull request.
Once you've clicked it, confirm the committed files and add a clear title and message linking to the issue or feature.

Finally, we'll review your code and eventually give you feedback.

If everything goes well, you'll be an official contributor of pencil.js ! :v:
