import { createServer } from 'http';
import { PlaylistData } from './share/PlaylistData';

import socketIo from 'socket.io';
import express, { Response } from 'express';

import { google } from 'googleapis';
import { Video } from './share/Video';
const yt = google.youtube({
    version: 'v3',
    auth: 'AIzaSyByzpzk6o8QvbwSzfXXf_LfL7JqdicwIzQ'
});

// Express server
const app = express();
const http = createServer(app);
const io = socketIo(http);
const rooms: {
    [roomId: string]: PlaylistData
} = {};
const PORT = process.env.PORT || 3000;

app.use(express.static(__dirname + '/dist/ngytsync'));

app.get('/*', function (_, res: Response) {
    res.sendFile(__dirname + '/dist/ngytsync/index.html');
});

io.on('connection', (socket: SocketIO.Socket) => {
    let roomId: string;
    if ('room' in socket.handshake.query && socket.handshake.query.room in rooms)
        roomId = socket.handshake.query.room;
    else {
        do
            roomId = Math.random().toString(36).substring(7);
        while (roomId in rooms)

        rooms[roomId] = {
            playlist: [],
            selected: 0,
            connected: 0
        };
    }
    socket.join(roomId);
    socket.emit('joined room', roomId);
    io.to(roomId).emit('join');
    const room = rooms[roomId];
    room.connected++;
    socket.emit('playlist data', room);
    socket.on('play video', (event: number) => {
        console.log('play video ' + event);
        room.selected = event;
        io.to(roomId).emit('play video', event);
    });
    socket.on('add video', async (event: string) => {
        const searchResults = (await yt.videos.list({
            id: event,
            part: 'snippet'
        })).data.items!;
        if (searchResults.length === 0)
            return;
        const title = searchResults[0].snippet!.title!;
        const newVideo: Video = { id: event, title };
        room.playlist.push(newVideo);
        console.log('add video ' + event);
        console.log(room);
        console.log(roomId);
        console.log(rooms);
        io.to(roomId).emit('video added', newVideo);
    });
    socket.on('remove video', (event: number) => {
        if (event < room.selected)
            room.selected--;
        else if (event === room.selected && room.selected < room.playlist.length - 1)
            room.selected++;
        room.playlist.splice(event, 1);
        console.log('remove video ' + event);
        io.to(roomId).emit('remove video', event);
    });
    socket.on('pause', (event: number) => {
        console.log('pause ' + event);
        socket.broadcast.to(roomId).emit('pause', event);
    });
    socket.on('play', (event: number) => {
        console.log('play ' + event);
        socket.broadcast.to(roomId).emit('play', event);
    });
    console.log('a user connected');

    socket.on('disconnect', () => {
        room.connected--;
        if (room.connected > 0)
            io.to(roomId).emit('leave');
        else
            delete rooms[roomId];
    });
});

// Start up the Node server
http.listen(PORT, () => {
    console.log(`Node server listening on http://localhost:${PORT}`);
});