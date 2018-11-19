import { Service, Value, OnInit } from "@tsed/common";
import * as Discord from 'discord.js';
import { RoomsStorage } from "./RoomsStorage";
import { $log } from 'ts-log-debug';

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
            messageCacheMaxSize: 1
        });
        this.client.on('ready', () => {
            $log.info(`Discord server started... Logged in as ${this.client.user.tag}`);
        });
        this.client.on('message', async (msg: Discord.Message) => {
            let slice: number;
            if (msg.content.startsWith(`<@${this.client.user.id}>`))
                slice = `<@${this.client.user.id}>`.length;
            else if (msg.content.startsWith(`<@!${this.client.user.id}>`))
                slice = `<@!${this.client.user.id}>`.length;
            else if (msg.content.startsWith(this.prefix) && !msg.guild)
                slice = this.prefix.length;
            else return;

            console.log('command');
            const args = msg.content.slice(slice).trim().split(/ +/);
            const command = args.shift().toLowerCase();
            const channel = msg.channel as Discord.TextChannel;
            console.log(args);
            switch (command) {
                case 'queue':
                    if (args.length === 0) return;
                    return this.queueCommand(channel, args[0]);
                case 'sync':
                    return this.syncCommand(channel, args[0]);
            }
        });
    }

    async queueCommand(channel: Discord.TextChannel, videoLink: string) {
        const pinnedSyncList = await this.getSyncList(channel);

        if (pinnedSyncList)
            await pinnedSyncList.edit(`${pinnedSyncList.content}\n<${videoLink}>`);
        else {
            const newSyncList: Discord.Message = await channel.send(`**SYNC LIST**\n<${videoLink}>`) as Discord.Message;
            await newSyncList.pin();
        }
    }

    async syncCommand(channel: Discord.TextChannel, videoLink?: string) {
        let videoLinks: string[];
        if (videoLink)
            videoLinks = [videoLink];
        else {
            const pinnedSyncList = await this.getSyncList(channel);

            if (!pinnedSyncList) return;

            videoLinks = pinnedSyncList.content.split('\n').slice(1);
            await pinnedSyncList.delete();
        }

        const roomId = await this.roomsStorage.reserveRoom(videoLinks);
        await channel.send(`Your sync is waiting over at ${this.domain}/${roomId}`);
    }

    async getSyncList(channel: Discord.TextChannel): Promise<Discord.Message | void> {
        const pinned = await channel.fetchPinnedMessages();
        return pinned.find(
            (pinMsg: Discord.Message) =>
                pinMsg.author === this.client.user &&
                pinMsg.content.startsWith('**SYNC LIST**\n')
        );
    }

    $onInit() {
        this.client.login(this.token);
    }
}