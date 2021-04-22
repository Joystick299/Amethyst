/*

Amethyst Discord Music Bot
v1.0.5

Hex Color: #9966cc

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
      const amount = 1;
      const n = input.replace('~play', '~p')
      const userInput = n.replace('~p', '').slice(1)
      const ytdl = require('ytdl-core');
      const connection = await message.member.voice.channel.join();
      const dispatcher = connection.play(ytdl(`${userInput}`, {filter: 'audioonly' }), {
        volume: 0.4,
      });
      dispatcher.on('start', () => {
        console.log(`${userInput} is now playing!`);
        
        message.channel.messages.fetch({ limit: amount }).then(messages =>{
          message.channel.bulkDelete(messages)
        })
      
      const embed = new Discord.MessageEmbed()
          .setTitle(`${userInput}`)
          .setColor('#9966cc')
          .setURL(`${userInput}`)
          .setAuthor(message.author.username)
          .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)
          .setThumbnail('http://vignette1.wikia.nocookie.net/clubpenguin/images/2/2e/Amethyst.png/revision/latest?cb=20130105192038')

        message.channel.send(embed)
        client.user.setActivity({
          name: `${message.author.username}'s Song`,
          type: 2
        })
                              // The Boyz Chat
        //firstMessage(client, '665724213189017622', `Media Controls `, ['⏯️'])
      });
      
      dispatcher.on('finish', () => {
        console.log(`${userInput} has stopped playing!`);
        dispatcher.destroy();
        client.user.setActivity({
          name: 'Music!',
          type: 2
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
    }else{
      message.reply("You need to be in a voice channel to ask the bot to stop!");
    }
  })

/*
Putting this on the backburner because it's really powerful. Removed in (v1.0.5)
  command(client, ['c', 'clear'], message => {
    if(message.member.hasPermission('ADMINISTRATOR')){
      const args = message.content.split(' ').slice(1);
      const amount = args.join(' ');
      const finalAmount = Number(amount) + 1;
      if (!amount) return message.reply('You haven\'t given an amount of messages to delete');
      if (isNaN(amount)) return message.reply('The amount has to be a number from 1-99');
      
      if (amount >= 100) return message.reply('You can\'t delete more than 99 messages at once!');
      if (amount < 1) return message.reply('You can\t delete 0 messages loser.');
      
      message.channel.messages.fetch({ limit: finalAmount }).then(messages => {
          message.channel.bulkDelete(messages)
      });
    }
  })
*/

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



  // Help command
  command(client, ['h', 'help'], message =>{
    if(!message.guild) return
      const embed = new Discord.MessageEmbed()
          .setTitle(`Help`)
          .setDescription('A help menu for the Amethyst Discord Bot')
          .addFields(
              {name: '~j, ~join', value: 'Makes the bot join the voice channel.'},
              {name: '~p, ~play {link}', value: 'Takes a YouTube link as input to play any song/video'},
              {name: '~s, ~stop', value: "Makes the bot leave the current voice channel"},
              {name: '~status', value: 'Changes the bot\'s status temporarily.'},
              {name: '~h, ~help', value: 'Makes the help menu appear. A.K.A This menu'}
          )
          .setColor('#9966cc')
          .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)
          .setThumbnail('http://vignette1.wikia.nocookie.net/clubpenguin/images/2/2e/Amethyst.png/revision/latest?cb=20130105192038')
      message.channel.send(embed)
  })







  //Last one
})



client.login(config.token);