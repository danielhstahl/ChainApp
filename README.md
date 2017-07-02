# How to use

First, install chain core.  When doing this, chain should provide a key.  Put this key in a file titled `client_key.json`

# Auto generate accounts and assets

Accounts will be automatically generated when accessing the Ivy playground `http://localhost:1999/ivy/`.

# Start docker

`docker run -it -p 1999:1999 chaincore/developer:ivy-latest`

# Note on integration test script
This uses the ivy branch of the chain github branch.  It is not available as part of the npm module.  To use the node from the ivy branch, clone the chain repo:

`git clone https://github.com/chain/chain`

Then checkout the `ivy` branch:

`git checkout ivy`

Then install the packages required:

`cd chain/sdk/node` 

`npm install`

