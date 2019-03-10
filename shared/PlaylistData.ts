import {Video} from './Video';

export interface PlaylistData {
  playlist: Video[];
  selected: number;
  connected: number;
}