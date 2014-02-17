var socketIO = require('socket.io');

function error(msg) {
  console.log(msg)
  return;
}

function Server( options ){
  
  var options = options || {};
  var port = options.port || 8080;
  var bootstrapSize = options.bootstrap || 5;

  var io = socketIO.listen(port);
  
  
  io.set('transports', ['websocket']);
  
  io.sockets.on('connection', function (socket){
    console.log('connect: ' + socket.id)
    socket.emit('hello', {id: socket.id, peers: selectRandom(socket.id, bootstrapSize) });
    dumpClients();
    
    socket.on('disconnect', function (data){
      console.log('disconnect: ' + socket.id)
      dumpClients();
      
    });    
      
    socket.on('message', function(message){
      // message = { src: id, dst: id , type: enum("SDP_OFFER", "SDP_REQUEST" , "SDP_RESPONSE") , data }}
      if (! message.src) error("No src for " + message);
      if (! message.dst) error("No dst for " + message);
      if (! message.type) error("No Type for " + message);
      if (! message.data) error("No data for " + message);
	
      if (!io.sockets.sockets(src) ) error("No peer for src " + src + " in " + message);
      if (!io.sockets.sockets(dst) ) error("No peer for dst " + dst + " in " + message);
      
      io.sockets.sockets(dst).send(message);
    });
    
  }); 
  
  // TODO: clearly not optimized
  function selectRandom(id, nb){
    var ret=[];
    for (var x in io.sockets.sockets) ret.push(x);
    while (ret.length > nb) ret.pop(Math.random * ret.length)
    return ret;
  }
  
  function dumpClients(){
    var clients="Connected clients: {";
    for (client in io.sockets.sockets) clients += " " + client + " ";
    clients += "}";
    console.log(clients);
  }
  
}

var server = new Server( {port:8080, bootstrap: 5} );
