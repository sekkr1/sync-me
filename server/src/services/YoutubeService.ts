import { Service, Value, OnInit } from "@tsed/common";
import { google, youtube_v3 } from 'googleapis';
import { Video } from "@shared";
import { AxiosResponse } from "axios";

@Service()
export class YoutubeService implements OnInit {

    private yt: youtube_v3.Youtube;

    @Value('googleToken')
    googleToken: string;

    $onInit() {
        this.yt = google.youtube({
            version: 'v3',
            auth: this.googleToken
        });
    }

    public async createVideo(video: string, allowSearch = false): Promise<Video | void> {
        let id: string;
        const match = video.match(/(\?v=|youtu\.be\/)(.{11})/i);
        let ytRes: AxiosResponse<youtube_v3.Schema$VideoListResponse> |
            AxiosResponse<youtube_v3.Schema$SearchListResponse>;
        if (match) {
            id = match[2];
            ytRes = await this.yt.videos.list({
                id: id,
                part: 'snippet'
            })
        }
        else if (allowSearch)
            ytRes = await this.yt.search.list({
                q: video,
                part: 'id,snippet'
            })
        else return;
        if (ytRes.status !== 200 || ytRes.data.items.length === 0) return;

        const title = ytRes.data.items[0].snippet.title;
        id = id || (ytRes.data.items[0].id as youtube_v3.Schema$ResourceId).videoId;

        return {
            id,
            title
        };
    }
}