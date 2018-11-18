import { Service, Value, OnInit } from "@tsed/common";
import * as Discord from 'discord.js';
import { RoomsStorage } from "./RoomsStorage";

@Service()
export class DiscordService implements OnInit {

    private readonly client: Discord.Client;

    @Value('domain')
    domain: string;

    @Value('discord.token')
    token: string;

    @Value('discord.prefix')
    prefix: string;

    constructor(private roomsStorage: RoomsStorage) {
        this.client = new Discord.Client({
            messageCacheMaxSize: 0
        });
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}`);
        });
        this.client.on('message', async (msg: Discord.Message) => {
            if (msg.guild && !msg.isMentioned(this.client.user))
                return;

            let slice: number;

            if (msg.content.startsWith(this.prefix))
                slice = this.prefix.length;
            else if (msg.content.startsWith(`<@!${this.client.user.id}>`))
                slice = `<@!${this.client.user.id}>`.length;
            else
                return;

            const args = msg.content.slice(slice).trim().split(/ +/);
            const command = args.shift().toLowerCase();

            if (command === 'queue') {
                if (args.length === 0)
                    return;


                // find synclist
                const pinned = await (msg.channel as Discord.TextChannel).fetchPinnedMessages();
                const pinnedSyncList = pinned.find((pinMsg: Discord.Message) => pinMsg.author === this.client.user && pinMsg.content.startsWith('**SYNC LIST**\n'));
                if (pinnedSyncList)
                    await pinnedSyncList.edit(`${pinnedSyncList.content}\n<${args[0]}>`);

                else {
                    const newSyncList: Discord.Message = await (msg.channel as Discord.TextChannel).send(`**SYNC LIST**\n<${args[0]}>`) as Discord.Message;
                    await newSyncList.pin();
                }
            } else if (command === 'sync') {
                if (args.length === 0) {
                    const pinned = await (msg.channel as Discord.TextChannel).fetchPinnedMessages();
                    const pinnedSyncList = pinned.find((pinMsg: Discord.Message) => pinMsg.author === this.client.user && pinMsg.content.startsWith('**SYNC LIST**\n'));
                    if (!pinnedSyncList)
                        return;

                    const videoIds = pinnedSyncList.content.split('\n').slice(1).map((videoLink: string) => {
                        if (videoLink.length === 11)
                            return videoLink;
                        return videoLink.match(/(\?v=|youtu\.be\/)(.{11})/i)[2];
                    });

                    const roomId = await this.roomsStorage.reserveRoom(videoIds);
                    await (msg.channel as Discord.TextChannel).send(`Your sync is waiting over at ${this.domain}/${roomId}`);
                    await pinnedSyncList.delete();
                } else {
                    const videoLink = args[0];
                    const videoId = videoLink.match(/(\?v=|youtu\.be\/)(.{11})/i)[2];
                    const roomId = await this.roomsStorage.reserveRoom([videoId]);
                    await (msg.channel as Discord.TextChannel).send(`Your sync is waiting over at ${this.domain}/${roomId}`);
                }
            }
        }
        );
    }

    $onInit() {
        this.client.login(this.token);
    }
}