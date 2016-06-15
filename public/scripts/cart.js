var ERROR_LOG = console.error.bind(console);

//Need to remove all of the items from the cart database where user id 
function checkout(){
    console.log("Got to checkout function")
    $.ajax({
        method: 'POST',
        url: "/api/cart/buy",
    }).then(success(),ERROR_LOG);
}

function removeItem(id){
    console.log("Removing Item")
    $.ajax({
        method: 'DELETE',
        url: "/api/cart/"+id,
    }).then(success(), ERROR_LOG);
}

function success(){
    console.log("Success");
    
}
