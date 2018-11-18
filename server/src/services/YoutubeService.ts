import { Service } from "@tsed/common";
import { google, youtube_v3 } from 'googleapis';
import { Video } from "@shared";

@Service()
export class YoutubeService {

    private readonly yt: youtube_v3.Youtube;

    constructor() {
        this.yt = google.youtube({
            version: 'v3',
            auth: 'AIzaSyByzpzk6o8QvbwSzfXXf_LfL7JqdicwIzQ'
        });
    }

    public async createVideo(videoId: string): Promise<Video | void> {
        const ytRes = await this.yt.videos.list({
            id: videoId,
            part: 'snippet'
        })
        if (ytRes.status !== 200 || ytRes.data.items.length === 0)
            return;

        const title = ytRes.data.items[0].snippet.title;

        return {
            id: videoId,
            title
        };
    }
}