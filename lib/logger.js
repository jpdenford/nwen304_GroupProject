var isLogging = true;

function log(message){
    if(isLogging) console.log(message);
}

function setLogging(b){
    isLogging = b;
}

module.exports = {
    log: log,
    setLogging: setLogging
}