import {Client, IntentsBitField, TextChannel} from 'discord.js';
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.DISCORD_BOT_TOKEN;
const channelId = process.env.DISCORD_CHANNEL_ID!;

const client = new Client({ intents: [IntentsBitField.Flags.Guilds]});


export async function sendCongratulatoryMessage(username: string, title: string, gifUrl: string, messageTemplate: string) {
    try {
        const channel = await client.channels.fetch(channelId);

        if (!channel || !(channel instanceof TextChannel)) {
            throw new Error('Channel not found or not a text channel');
        }

        return await channel.send({ content: `${username} just finished ${title}, ${messageTemplate}`, files: [gifUrl] });

    } catch (error) {
        return console.error('Error sending congratulatory message:', error);
    }
}

client.login(apiKey)
  .then(() => {
    console.log('Bot logged in successfully!');
  })
  .catch(error => {
    console.error('Error logging in:', error);
  });
