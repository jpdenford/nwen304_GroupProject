var ERROR_LOG = console.error.bind(console);

//Need to remove all of the items from the cart database where user id 
function checkout(){
    $.ajax({
        method: 'POST',
        url: "/api/cart/buy",
    }).then(success(),ERROR_LOG);
}

function removeItem(id){
    $.ajax({
        method: 'DELETE',
        url: "/api/cart/"+id,
    }).then(removeSuccess(id), ERROR_LOG);
}

function success(){
    
    console.log("Success");
}
function removeSuccess(id){
    $("li").remove("."+id)
    console.log("Removed Item")
}
