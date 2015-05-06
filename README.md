QZ-QP-ABOUTCOUNTRIES!
======
AboutCountries is a project in which data is pulled from the [World Bank](http://worldbank.org) API. You enter a country's two or three letter ISO code to see more information about it. The server file is located in se/server.js.
The page files [built by server using [Mustache](https://github.com/janl/mustache.js)] are located in the cl folder.
To start the server, run
    
    npm start
    
, which will trigger the server file mentioned before. By default, it will host at localhost:3000, but it will work instantly with [Heroku](http://herokuapp.com/).
