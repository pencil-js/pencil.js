workflow "Test on push" {
  resolves = [
    "NPM test"
  ]
  on = "push"
}

action "NPM install" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "install"
}

action "NPM test" {
  uses = "actions/npm@59b64a598378f31e49cb76f27d6f3312b582f680"
  args = "test"
  needs = ["NPM install"]
}
