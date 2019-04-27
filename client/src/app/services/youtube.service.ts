import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Video} from '@shared';
import {youtube_v3} from 'googleapis';
import {EMPTY, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeService {

  constructor(private http: HttpClient) {
    this.searchVideos('dunkey').subscribe(console.log);
  }

  public createVideo(video: string): Observable<Video> {
    const match = video.match(/(\?v=|youtu\.be\/)(.{11})/i);
    if (!match) {
      return EMPTY;
    }
    const id = match[2];
    return this.http.get<youtube_v3.Schema$VideoListResponse>('https://www.googleapis.com/youtube/v3/videos', {
      params: {
        part: 'snippet',
        id,
        key: environment.youtube_api_key
      }
    }).pipe(
      map((res: youtube_v3.Schema$VideoListResponse) => {
        console.log(res);
        if (res.items.length === 0) {
          return;
        }

        const title = res.items[0].snippet.title;
        const channel = res.items[0].snippet.channelTitle;

        return {
          id,
          title,
          channel
        };
      })
    );
  }

  public searchVideos(query: string): Observable<Video[]> {
    return this.http.get<youtube_v3.Schema$SearchListResponse>('https://www.googleapis.com/youtube/v3/search', {
      params: {
        q: query,
        part: 'id,snippet',
        maxResults: '40',
        type: 'video',
        key: environment.youtube_api_key
      }
    }).pipe(
      map((res: youtube_v3.Schema$SearchListResponse) =>
        res.items.map(rawVideo => ({
          id: rawVideo.id.videoId,
          title: rawVideo.snippet.title,
          channel: rawVideo.snippet.channelTitle
        }))
      )
    );
  }
}
