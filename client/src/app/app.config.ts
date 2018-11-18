import { InjectionToken } from "@angular/core";

export const SOCKET = new InjectionToken<SocketIOClient.Socket>('SocketIO Connection');