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
    }
})();