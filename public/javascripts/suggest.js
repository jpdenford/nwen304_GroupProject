$(window).on('load', function () {
  $.get("http://ipinfo.io", function(response) {
    console.log(response.city, response.country);
    $.get('/api/products/suggest', {
      data: {
        city: response.city
      }
    }).success( function(data) {
      console.log(data);
    });
  }, "jsonp");
});
