$(window).load(function() {
  $.getJSON('https://geoip-db.com/json/geoip.php?jsonp=?')
    .done (function(location) {
      $.get('/api/products/suggest', { city: location.city },
        function(result) {
          console.log(result);

          for (var i = 0; i < result.data.length; i++) {
            $('#product_' + result.data[i].product_id).addClass('suggested');
          }
        });
    });
});
