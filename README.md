# How to use

## Install VM

Go to https://adrcldvrasb01.corp.rgbk.com/vcac/org/ilab/.  Navigate to `Catalog`.  Select the `request` for `RedHat_7_x64`.  Select 30 days for leas.  Then go to `vSphere_Machine_1` under the `RedHat_7_64` and select ServerType `App`.  Submit.  This MAY ERROR several times before working.  Just keep resubmitting.

Once it deploys, navigate to the `Items` tab and click the dropdown on your deployment. The IP address of the machine should be desplayed. 

In putty (standard software request), put this IP address and use the username `root` and password `changeme`.  You will now have access to the VM through the command line.

## Install Chain

Once SSH'ed into the VM, run the following commands:

### Install Docker

`sudo yum install -y yum-utils`

`sudo yum-config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo`


`sudo yum makecache fast`

`sudo yum -y install docker-ce`

`sudo systemctl start docker`

### Start the chain docker

Note that you should change the "chooseANameHere"

`docker run -d -p 80:1999 --name chooseANameHere chaincore/developer:ivy-latest`

### Create access token

Note that the "nameOfChain" is the same as the name chosen in the previous step and "chooseATokenNameHere" should be some meaningful name.

`docker exec nameOfChain /usr/bin/chain/corectl create-token chooseATokenNameHere client-readwrite`

### Access chain dashboard

Navigate in chrome to the IP of the VM. It should ask for a token.  Paste the previously generated token in the following format:

`nameOfToken:token`

### Connect to existing blockchain

Select the `Connect to existing blockchain` and use the credentials provided by the generating chain.  Contact whoever administers the generating chain for connection details.

### Or, create new blockchain

If creating a new blockchain and you want to enable access from other nodes, do the following:


In the dashboard for your chain node, navigate to the gear at the top left near the "Chain" logo.  Then select `Access Control`.  Then create a new key that has then following policies:

* `Client read-only`
* `Cross-core`
* `Cross-core block signing`

Provide this token to anyone who you want to join the network.  For the "URL" and "Blockchain ID" values, navigate to `Core Status`. 


# Use the Node SDK

The node sdk that is included in the npm module is not the most up-to-date for Ivy.  Instead, in a different folder, perform the following:


`git clone https://github.com/chain/chain`

Then checkout the `ivy` branch:

`git checkout ivy`

Then install the packages required:

`cd chain/sdk/node` 

`npm install`

When using this sdk, you need to require the exact module.  For example, if you cloned the repo in the same directory as this repository, then you need to have the following "require":

`require('../chain/sdk/node/src/index')`

To access the same permissions as the dashboard, ensure that you use the token that you generated using the `docker exec` command above.