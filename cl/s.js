(function() {
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
        $('#countryGo').attr("placeholder","Enter ISO or ISO 2 Code and press enter.");
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
                num = "$" + (typeof num == "number" ? num : parseInt(num)).toLocaleString("en-GB" );
            }
            $('#gdp').text(num);
        });
    }
})();