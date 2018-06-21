var net = require('net');
var streams = Array();

function onStreamData(data){
    if (0 === data.indexOf('.down')){
        server.close();
        return ;
    }
    var current_stream = this;
    streams.forEach(function(stream){
        if (stream != current_stream)
            stream.write(current_stream.remoteAddress + ':' + data, 'utf8');
    });
}

var server = net.createServer(function (c) {
    c.setEncoding('utf8');
    streams.push(c);
    streams.forEach(function(stream){
        stream.write(c.remoteAddress + ' - is connected\n', 'utf8');
    });
    c.on('data', onStreamData);
});

server.on('close', function(){
    streams.forEach(function(stream){
        stream.write('Server is going down! Bye-bye!','utf8');
        stream.destroy();
    });
});

server.maxConnections = 2; // Максимальное кол-во подключений
server.listen(8000, '192.168.1.17'); // Задайте свой внешний ip или localhost