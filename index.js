/*

Amethyst Discord Music Bot
v1.0.3

Features:
Also added on GitHub!
Play music from provided YouTube link

*/

const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const command = require('./command');
const firstMessage = require('./first-message');


client.on('ready', () => {
  console.log(`Amethyst in online!\n\nCurrent Guilds:\n===============`)
  client.guilds.cache.forEach((guild) =>{
    console.log(`${guild.name} - ${guild.memberCount} members.`);
    
  })
  


  //Tell the bot to join
  command(client, ['j', 'join'] , (message) => {
    if (!message.guild) return;
    if(message.member.voice.channel){
      const connection = message.member.voice.channel.join();
    }else{
      message.reply('You need to be in a voice channel first!');
    }
  })


  //Tell the bot to play some music
  command(client, ['p', 'play'], async message => {
    if (!message.guild) return;
    if (message.member.voice.channel){
      const input = message.content;
      const n = input.replace('~play', '~p')
      const userInput = n.replace('~p', '').slice(1)
      const ytdl = require('ytdl-core');
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(`${userInput}`, {filter: 'audioonly' }), {
        volume: 0.4,
      });
      dispatcher.on('start', () => {
        console.log(`${userInput} is now playing!`);
        message.channel.messages.fetch().then(results =>{
          message.channel.bulkDelete(results)
        })
      
      const embed = new Discord.MessageEmbed()
          .setTitle(`${userInput}`)
          .setURL(`${userInput}`)
          .setAuthor(message.author.username)
          .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)

        message.channel.send(embed)
        firstMessage(client, '833456821590949919', `Media Controls `, ['⏯️'])
      });
      
      dispatcher.on('finish', () => {
        console.log(`${userInput} has stopped playing!`);
        dispatcher.destroy();
        message.channel.messages.fetch().then(results =>{
          message.channel.bulkDelete(results)
        })
      });
    }else{
      message.reply("You need to be in a voice channel to request a song.");
    }
  })

  //Tell the bot to leave
  command(client, ['s', 'stop'], async message => {
    if(!message.guild) return;
    if (message.member.voice.channel){
      message.member.voice.channel.leave();
      message.channel.messages.fetch().then(results =>{
        message.channel.bulkDelete(results)
      })
    }else{
      message.reply("You need to be in a voice channel to ask the bot to stop!");
    }
  })


  command(client, ['c', 'clear'], message => {
    if(message.member.hasPermission('ADMINISTRATOR')){
      message.channel.messages.fetch().then(results =>{
        message.channel.bulkDelete(results)
      })
    }
  })


  command(client, 'embed', (message) =>{
    
  })

  client.user.setPresence({
    activity: {
      name: 'Music!',
      type: 2
    }
  })

  command(client, 'status', message =>{
    if(message.member.hasPermission('ADMINISTRATOR')){
      const content = message.content.replace('~status', '')

      client.user.setPresence({
        activity: {
          name: content,
          type: 2
        }
      })
    }
  })

//Last one
})



client.login(config.token);