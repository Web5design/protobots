

After downloading Protobots, you need to make sure you have the appropriate gems. To do this, we use bundler.

```ruby
$ sudo gem install bundler
$ bundle
```

Next you will either want to point your server at the app folder, or install Grunt (preferred method). To install to install Grunt you will first need [Node](http://nodejs.org/download/) installed. Then:

```ruby
sudo npm install
```

This will download all of the appropriate packages based on the specifications of the package.json file. Once this is complete you can run "grunt server" and Protobots will spin up a grunt server and open up the start page for you. 
