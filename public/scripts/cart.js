var ERROR_LOG = console.error.bind(console);

//Need to remove all of the items from the cart database where user id 
function checkout(){
    $.ajax({
        method: 'POST',
        url: "/api/cart/buy",
    }).then(function(data, error) {
        //Need to do shit to show receipt now
        $("#content").html("<h2> Thank you </h2>");

        var total = 0;
        for (var i = 0; i < data.data.length; i++) {
          total += data.data[i].total_price;
        }
        $("#content").append("<p>You spent: $" + total + "<br> This will go towards our student loan debts :)</p>")
    },ERROR_LOG);
}


function addOne(id) {
    var idName = "#" + id;
    var quantity = parseInt($("#add" +id).attr("_quantity"));
    var value = quantity+1;
    $.ajax({
        method: 'PATCH',
        url: "/api/cart/" + id,
        data: {
            quantity: value
        },
    }).then(function (data, err) {
        var update = data.data.quantity;
        $(idName + " span[class='quantity']").text("x" + update);
        $("#add" +id).attr("_quantity", update);
        $("#remove" +id).attr("_quantity", update);
    }, ERROR_LOG);
}

function removeOne(id) {
    var idName = "#" + id;
    var quantity =  $("#remove" +id).attr("_quantity");
    if (quantity > 1) {
        var value = quantity-1;
        $.ajax({
            method: 'PATCH',
            url: "/api/cart/" + id,
            data: {
                quantity: value
            },
        }).then(function (data, err) {
            var update = data.data.quantity;
            $(idName + " span[class='quantity']").text("x" + update);
            $("#add" +id).attr("_quantity", update);
            $("#remove" +id).attr("_quantity", update);
        }, ERROR_LOG);
    }
    else {
        removeItem(id);
    }
}

function removeItem(id){
    var idName = "#" + id;
    $.ajax({
        method: 'DELETE',
        url: "/api/cart/"+id,
    }).then(function(){
        $(idName).remove();
    }, ERROR_LOG);
}
