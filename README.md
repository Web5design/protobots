
After downloading Protobots, you need to make sure you have the appropriate Ruby gems. To do this, we use bundler.

```ruby
$ sudo gem install bundler
$ bundle
```

Next you will either want to point your server at the app folder, or install Grunt (preferred method). To install to install Grunt you will first need [Node](http://nodejs.org/download/) installed. Then:

```ruby
$ sudo npm install
```

This will download all of the appropriate javascript packages needing to create the server. Once this is complete you can run "grunt server" and Protobots will spin up a grunt server and open up the start page for you.

## Editing the Home Page
To edit the start page in Protobots simply add valid markup to the views/home.html file. All pages inherit the basic HTML structure of index.html which includes <html> <head> <body> and a <div class="page"> page wrapper.

## Partials
To create a HTML snippet or "partial", just create a new html file in the views/partials directory. The partial may only contain a single parent element, but can have as many child elements as needed.

To include a partial into your homepage Protobots comes with a custom directive called <partial>. So if you have a partial called "navigation.html" in your partials folder this is the markup to insert into your home page:

```html
<partial file="navigation"></partial>
```

Note that you don't need to specify the view or partial folder as they are assumed, and you will also ommit the extension as it is assumed. If you decide to organize your partials into folders you simply include the path from the partials folder:

```html
<partial file="path/from/partial/folder/navigation"></partial>
```

Partials can also be called from within other partials. When doing so you will always specify their path from the partials folder, not relative to where the partial is (if the partial is inside a folder).

## Layout and Regions
