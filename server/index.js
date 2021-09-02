const app = require('express')();
const server = require('http').createServer(app);
const cors = require('cors');

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

app.use(cors());

const PORT = process.env.PORT || 5000;

app.get('/', (req, res)=> {
    res.send('server is runnign!');
});

let users = [];

io.on('connection', (socket)=>{
    socket.emit('me', socket.id);
	users.push(socket.id);
	console.log(users);

    socket.on('disconnect', ()=>{
        socket.broadcast.emit('call-ended');
        users = users.filter(user=> {
        	return user !== socket.id;
        }) ;
        console.log("user removed", socket.id, users);
    });

    socket.on('call-user', ({userToCall, signalData, from, name})=>{
        console.log("call-user:", userToCall, signalData, from, name);
        io.to(userToCall).emit('call-user', {signal: signalData, from, name});
    });

    socket.on('answer-call', (data)=>{
        console.log("ans call",data);
        io.to(data.to).emit('call-accepted', data.signal);
    });

    socket.on('call-rejected', (data)=>{
        console.log('call-rejected', data);
        io.to(data.to).emit('call-rejected');
    });

    socket.on('call-ended', (data)=>{
        console.log('call-ended', data.userID);
        users = users.filter(user=> {
        	return user !== socket.id;
        });
        socket.to(data.userID).emit('user-left');
    });
})

server.listen(PORT, ()=> console.log("server is runnign at 5000"));
