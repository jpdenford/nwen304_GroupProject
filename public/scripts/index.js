var ERROR_LOG = console.error.bind(console);

function addItem(id){
    $.ajax({
        method: 'POST',
        url: "/api/cart/",
        data: {
            product_id: id
        }
    }).then(success(),ERROR_LOG);
}

function success(){
    console.log("Success");
}
