import {ErrorHandlerSocketMiddleware} from '@middlewares';
import {
  Args,
  Input,
  Nsp,
  Socket,
  SocketErr,
  SocketMiddlewareError,
  SocketService,
  SocketSession,
  SocketUseAfter
} from '@tsed/socketio';
import * as SocketIO from 'socket.io';
import {RoomsStorage} from './RoomsStorage';
import {YoutubeService} from './YoutubeService';

@SocketService()
@SocketUseAfter(ErrorHandlerSocketMiddleware)
export class MySocketService {
  @Nsp nsp: SocketIO.Namespace;

  constructor(private roomsStorage: RoomsStorage,
              private youtubeService: YoutubeService) {
  }

  /**
   * Triggered when a new client connects to the Namespace.
   */
  $onConnection(@Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    let roomId: string;
    if ('room' in socket.handshake.query && this.roomsStorage.hasRoom(socket.handshake.query.room)) {
      roomId = socket.handshake.query.room;
    } else {
      roomId = this.roomsStorage.generateRoom();
    }

    // add to room
    socket.join(roomId);

    // notify room id to client
    socket.emit('joined room', roomId);

    const room = this.roomsStorage.getRoom(roomId);

    // tell room new user joined
    room.connected++;
    this.nsp.to(roomId).emit('join');

    session.set('roomId', roomId);
    session.set('room', room);

    // give client data
    socket.emit('playlist data', room);
  }

  /**
   * Triggered when a client disconnects from the Namespace.
   */
  $onDisconnect(@SocketSession session: SocketSession) {
    session.get('room').connected--;
    if (session.get('room').connected > 0) {
      this.nsp.to(session.get('roomId')).emit('leave');
    } else {
      setTimeout(() => {
        if (session.get('room').connected === 0) {
          this.roomsStorage.deleteRoom(session.get('roomId'));
        }
      }, 60000);
    }

  }

  @Input('play video')
  playVideo(@Args(0) id: number, @SocketSession session: SocketSession, @SocketErr err: any, @SocketMiddlewareError err2: any) {
    if (id >= session.get('room').playlist.length || id < 0) {
      return;
    }
    session.get('room').selected = id;
    this.nsp.to(session.get('roomId')).emit('play video', id);
  }

  @Input('add video')
  async addVideo(@Args(0) video: string, @SocketSession session: SocketSession) {
    const newVideo = await this.youtubeService.createVideo(video);
    if (!newVideo) {
      return;
    }
    session.get('room').playlist.push(newVideo);
    this.nsp.to(session.get('roomId')).emit('video added', newVideo);
  }

  @Input('remove video')
  removeVideo(@Args(0) id: number, @SocketSession session: SocketSession) {
    if (id >= session.get('room').playlist.length || id < 0) {
      return;
    }
    if (id < session.get('room').selected) {
      session.get('room').selected--;
    } else if (id === session.get('room').selected) {
      if (session.get('room').selected === session.get('room').playlist.length - 1) {
        session.get('room').selected--;
      } else {
        session.get('room').selected++;
      }
    }
    session.get('room').playlist.splice(id, 1);
    this.nsp.to(session.get('roomId')).emit('remove video', id);
  }

  @Input('pause')
  pause(@Args(0) seconds: number, @Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    if (seconds < 0) {
      return;
    }
    socket.to(session.get('roomId')).emit('pause', seconds);
  }

  @Input('play')
  play(@Args(0) seconds: number, @Socket socket: SocketIO.Socket, @SocketSession session: SocketSession) {
    if (seconds < 0) {
      return;
    }
    socket.to(session.get('roomId')).emit('play', seconds);
  }
}
