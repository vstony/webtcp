function WebTCPAPI() {
  this.onEvent = function(eventName, data) {
    this["on" + eventName](data);
    
    // call custom event handler
    if (this["on" + eventName + "Custom"])
      this["on" + eventName + "Custom"](data);
  };

  // Assign client's event handlers
  // socket.on('data', function() {...} ) 
  this.on = function(eventName, callback) {
    this["on" + eventName + "Custom"] = callback;
  }

  this.rpc = function(command, args) {
     var pck = this.createPacket();
     pck.command = command;
     pck.args = args;

     this.send( JSON.stringify(pck) );
     return 1;
   }

  this.write = function(data) {
     var pck = this.createPacket();
     pck.data = data;
     
     this.send( JSON.stringify(pck) );
     return 1;
   }

  this.send = function(data) {
    if(this.webtcp.ready)
      this.webtcp.sock.send(data);
    else if(this.webtcp.outputBuffer > this.webtcp.BUFF_SIZE) {
      throw "Output buffer is already full, but sockJS connection is not ready yet";
    }
    else {
      this.webtcp.outputBuffer.push(data);
    }
  }

  this.onerror = function(error) {
    throw error;
  }
}