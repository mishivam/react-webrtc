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

    socket.on("join-room",(data)=>{

        const { userName, mId} = data; //mId = meeting id
        console.log('join-room', userName, mId);
        
        //get others users...
        otherUsers = users.filter(({user})=>{
            return user.mId === mId;
        });

        //user Object...
        const userObj = {
            sId: socket.id,
            userName,
            mId,
        };

        //add user
        users.push(userObj);

        //notify other users...
        otherUsers.forEach(user => {
            socket.to(user.sId).emit('new-user-joined', {sId: userObj.sId, userName,})
        });
    });
});

server.listen(PORT, ()=> console.log("server is runnign at 5000"));
