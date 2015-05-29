(function() {
    var th = ['', 'thousand', 'million', 'billion', 'trillion'];
    var dg = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    var tn = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
    var tw = ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

    function toWords(s) {
        s = s.toString();
        s = s.replace(/[\, ]/g, '');
        if(s != parseFloat(s)) return 'not a number';
        var x = s.indexOf('.');
        if(x == -1) x = s.length;
        if(x > 15) return 'too big';
        var n = s.split('');
        var str = '';
        var sk = 0;
        for(var i = 0; i < x; i++) {
            if((x - i) % 3 == 2) {
                if(n[i] == '1') {
                    str += tn[Number(n[i + 1])] + ' ';
                    i++;
                    sk = 1;
                } else if(n[i] != 0) {
                    str += tw[n[i] - 2] + ' ';
                    sk = 1;
                }
            } else if(n[i] != 0) { // 0235
                str += dg[n[i]] + ' ';
                if((x - i) % 3 == 0) str += 'hundred ';
                sk = 1;
            }
            if((x - i) % 3 == 1) {
                if(sk) str += th[(x - i - 1) / 3] + ' ';
                sk = 0;
            }
        }
        if(x != s.length) {
            var y = s.length;
            str += 'point ';
            for(var i = x + 1; i < y; i++) str += dg[n[i]] + ' ';
        }
        return str.replace(/\s+/g, ' ');
    };
    $('.mdi-navigation-close').click(function() {
        $(this).parent().children("input").val("");
    });
    $('form').submit(function(e) {
        e.preventDefault();
        if($('#countryGo').val().split(" ").join("") != "") {
            location.assign("/c/" + $('#countryGo').val().split(" ").join("").toUpperCase());
        }
    });
    if(location.pathname == "/") {
        $('.brand-logo').text("aC");
        $('#countryGo').attr("placeholder", "Enter ISO or ISO 2 Code and press enter.");
    } else if($('#pop').length) {
        $.get("/api/p/" + $isoCode, function(d) {
            if(typeof d == "string") {
                d = JSON.parse(d);
            }
            var num = d.num;
            if(typeof d.num == "number") {
                num = num.toLocaleString("en-US");
            }
            $('#pop').text(num);
        });
        $.get("/api/g/" + $isoCode, function(d) {
            if(typeof d == "string") {
                d = JSON.parse(d);
            }
            var num = d.num;
            if(d.num != "unknown") {
                num = toWords((typeof num == "number" ? num : parseInt(num))) + " dollars";
            }
            $('#gdp').text(num);
        });
    }
})();
(function() {
    window.doorbellOptions = {
        appKey: 'rREx3Vw84HsOM8GobFMOQJQWxQ7X2twY7mHAhqv0REX9BBQbrUroiaXBJwXkYhA0'
    };
    (function(d, t) {
        var g = d.createElement(t);
        g.id = 'doorbellScript';
        g.type = 'text/javascript';
        g.async = true;
        g.src = 'https://embed.doorbell.io/button/1441?t=' + (new Date().getTime());
        (d.getElementsByTagName('head')[0] || d.getElementsByTagName('body')[0]).appendChild(g);
    }(document, 'script'));
})();