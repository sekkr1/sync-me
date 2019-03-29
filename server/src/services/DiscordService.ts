import {OnInit, Service, Value} from '@tsed/common';
import * as Discord from 'discord.js';
import {Message, MessageReaction, RichEmbed, TextChannel, User} from 'discord.js';
import {$log} from 'ts-log-debug';
import {RoomsStorage} from './RoomsStorage';
import {YoutubeService} from './YoutubeService';

@Service()
export class DiscordService implements OnInit {

  @Value('discordPrefix')
  prefix: string;
  private readonly client: Discord.Client;

  constructor(private roomsStorage: RoomsStorage,
              private youtubeService: YoutubeService) {
    this.client = new Discord.Client();
    this.client.on('ready', () => {
      $log.info(`Discord server started... Logged in as ${this.client.user.tag}`);
    });
    this.client.on('messageReactionAdd', (react, user) => this.reactionHandler(react, user));
    this.client.on('message', (msg) => this.commandHandler(msg));
    this.client.on('error', console.error);
  }

  async reactionHandler(react: MessageReaction, user: User) {
    if (user.bot || user.equals(this.client.user)) {
      return;
    }
    if (react.me) {
      await this.syncCommand(react.message.channel as TextChannel, react.message.content);
    }
  }

  async commandHandler(msg: Discord.Message) {
    let slice: number;
    if (msg.content.startsWith(`<@${this.client.user.id}>`)) {
      slice = `<@${this.client.user.id}>`.length;
    } else if (msg.content.startsWith(`<@!${this.client.user.id}>`)) {
      slice = `<@!${this.client.user.id}>`.length;
    } else if (msg.content.startsWith(this.prefix) && !msg.guild) {
      slice = this.prefix.length;
    } else if (msg.content.match(/(\?v=|youtu\.be\/)(.{11})/i)) {
      return msg.react('🔁');
    }

    const args = msg.content.slice(slice).trim().split(/ +/);
    const command = args.shift().toLowerCase();
    const channel = msg.channel as Discord.TextChannel;
    $log.info(`Recieved command "${command}" with arguments [${args.join(', ')}]`);
    switch (command) {
      case 'queue':
        if (args.length === 0) {
          return;
        }
        return this.queueCommand(channel, args.join(' '));
      case 'sync':
        return this.syncCommand(channel, args.join(' '));
    }
  }

  async queueCommand(channel: Discord.TextChannel, video: string) {
    const pinnedSyncList = await this.getSyncList(channel);
    let videoLink: string;
    const search = await this.youtubeService.createVideo(video, true);
    if (search) {
      videoLink = `https://youtu.be/${search.id}`;
      await channel.send(`Queueing **${search.title}...**`);
    }
    if (pinnedSyncList) {
      await pinnedSyncList.edit(`${pinnedSyncList.content}\n<${videoLink}>`);
    } else {
      const newSyncList: Discord.Message = await channel.send(`**SYNC LIST**\n<${videoLink}>`) as Discord.Message;
      await newSyncList.pin();
    }
  }

  async syncCommand(channel: Discord.TextChannel, video?: string) {
    let videoLinks: string[];
    if (video) {
      const search = await this.youtubeService.createVideo(video, true);
      if (!search) {
        return;
      }
      videoLinks = [`https://youtu.be/${search.id}`];
    } else {
      const pinnedSyncList = await this.getSyncList(channel);

      if (!pinnedSyncList) {
        return;
      }

      videoLinks = pinnedSyncList.content.split('\n').slice(1);
      await pinnedSyncList.delete();
    }

    const roomId = await this.roomsStorage.reserveRoom(videoLinks);
    const embed = new RichEmbed().setTitle(`Your sync is waiting over at ${process.env.DOMAIN}/${roomId}`).setColor('DARK_AQUA');
    const message = await channel.send(embed) as Message;
    await message.delete(60 * 1000);
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
    this.client.login(process.env.DISCORD_TOKEN);
  }
}