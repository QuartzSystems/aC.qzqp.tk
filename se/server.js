//INCLUDES
var express = require("express"),
    app = express(),
    Mustache = require("mustache"),
    fs = require("fs"),
    http = require("http");
var files, fileNames, lF;
//UTIL
var u = {
    gRI: function(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    },
    _rF: function(path, cb) {
        return fs.readFile(path, {
            encoding: "utf-8"
        }, cb);
    },
    rF: function(name, cb) {
        return this._rF("cl/" + name, cb);
    },
    r: function(tmplt, v) {
        return Mustache.render(tmplt, v);
    },
    vO: function() {
        return {
            css: files["cssIncludes.html"],
            js: files["jsIncludes.html"],
            nav: files["nav.html"],
            foot: files["foot.html"],
            data: {}
        };
    },
    dU: "http://api.worldbank.org/country?per_page=500&format=json",
    gD: function(cb) {
        http.get(this.dU, function(res) {
            console.log("Got response: " + res.statusCode);
            var r = "";
            res.on('data', function(chunk) {
                r += chunk;
            });
            res.on('end', function() {
                cb(r);
            });
        }).on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    },
    lF: function(path) {
        console.log(path);
        u.rF(path, function(err, data) {
            if(err) {
                console.log(err);
            } else {
                files[path] = data;
            }
        });
    },
    gF: function() {
        for(var fileName in fileNames) {
            this.lF(fileNames[fileName]);
        }
    },
    sR: function(cb) {
        setInterval(cb, 30000);
    }
};
//ERROR TEXTS
var errorTexts = ["What were you trying to do anyway?", "Who do you think you are?", "Wat?", "Who?", "Huh?", "It must be twenty tippity-two now!", "Bo Dietl approves.", "Take off your aba-daba-doo hat!"];
var getError = function() {
    return errorTexts[u.gRI(0, errorTexts.length)];
};
//FILE MANAGE
fileNames = ["index.html", "country.html", "foot.html", "cssIncludes.html", "jsIncludes.html", "nav.html", "s.js", "s.css", "error.html"];
files = {};
u.gF();
u.sR(function() {
    u.gF();
});
//DATA MANAGE
var data;
u.gD(function(d) {
    data = JSON.parse(d);
});
u.sR(function() {
    u.gD(function(d) {
        data = JSON.parse(d);
    });
});
//ROUTING
app.get("/c/:cN", function(req, res) {
    if(req.params.cN.toUpperCase() != req.params.cN) res.redirect("./" + req.params.cN.toUpperCase());
    var pD = data[1];
    var n = 1000;
    for(var c in pD) {
        if(pD[c].id == req.params.cN) {
            res.redirect("./" + pD[c].iso2Code);
        } else if(pD[c].iso2Code == req.params.cN) {
            console.log(c);
            n = c;
        }
    }
    var country = pD[n];
    country.incomeLevelFixed = country.incomeLevel.value.split("(")[0].split(":")[0];
    var view = u.vO();
    view.lcISO = req.params.cN.toLowerCase();
    view.data = (country || {
        reason: "The country " + req.params.cN + " does not exist.",
        errorText: getError()
    });
    res.end(u.r(files[(n != 1000 ? "country.html" : "error.html")], view));
});
/*app.get("/api/p/:cIC", function(req, res) {
    var code = req.params.cIC;
    var url = "http://www.quandl.com/api/v1/datasets/WORLDBANK/" + code + "_SP_POP_TOTL.json";
    http.get(url, function(dR) {
        var r = "";
        dR.on("data", function(chunk) {
            r += chunk;
        });
        dR.on("end", function() {
            res.end(JSON.stringify({
                num: (JSON.parse(r).data ? JSON.parse(r).data[0][1] : "unknown")
            }));
        });
    }).on("error", function(e) {
        console.log(e.message);
    });
});*/
app.get("/api/g/:cIC", function(req, res) {
    var code = req.params.cIC;
    var url = "http://api.worldbank.org/countries/" + code + "/indicators/NY.GDP.MKTP.CD?format=JSON";
    http.get(url, function(dR) {
        var r = "";
        dR.on("data", function(chunk) {
            r += chunk;
        });
        dR.on("end", function() {
            res.end(JSON.stringify({
                num: (JSON.parse(r)[1] ? JSON.parse(r)[1][0].value : "unknown")
            }));
        });
    }).on("error", function(e) {
        console.log(e.message);
    });
});
app.get("/file/:name", function(req, res) {
    if(req.params.name.split(".")[1] == "js") {
        res.set({
            'Content-Type': 'text/javascript'
        });
    } else if(req.params.name.split(".")[1] == "css") {
        res.set({
            'Content-Type': 'text/css'
        });
    }
    res.end(files[req.params.name]);
});
app.get("/", function(req, res) {
    res.end(u.r(files["index.html"], u.vO()));
});
app.use(function(err, req, res, next) {
    var reason = "unknown";
    var errorText = getError();
    var v = u.vO;
    reason = "404";
    v.data = (v.date ? v.data : {});
    v.data.reason = reason;
    v.data.errorText = errorText;
    res.end(u.r(files["error.html"], v));
    next();
});
//LISTEN
var server = app.listen(process.env.PORT || 3000, function() {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Listening at http://%s:%s', host, port);
});