$(window).load(function() {
    $.get('/api/products/suggest', { city: geoplugin_city() },
      function(result) {
      console.log(result);

      for (var i = 0; i < result.data.length; i++) {
        $('#product_' + result.data[i].product_id).addClass('suggested');
      }
    });
});
