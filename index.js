/*

Amethyst Discord Music Bot
v1.1.6 - The Overhaul Update

Made by: Joystick#7300


Hex Color: #9966cc

Features:
Play music from provided YouTube link

*/

const Discord = require('discord.js');
const client = new Discord.Client();
let isLoop = false;
let volumes = 1;
let loopText = "false";
const version = 'v1.1.6 - The Overhaul Update';
const ytSearch = require('yt-search');
const token = "";

client.on('ready', () => {
  console.log(`Amethyst in online!\n\nCurrent Guilds:\n====================`)
  client.guilds.cache.forEach((guild) =>{
    console.log(`${guild.name} - ${guild.memberCount} members.`);
  })
  console.log("\n\n");

  client.user.setActivity({
  	name: "Music!",
  	type: 2
  })
})

client.on('message', async message => {
  if (message.content.toLowerCase() == '~join' || message.content.toLowerCase() == '~j'){
    try{
      if (!message.guild) return;
      if(message.member.voice.channel){
        const connection = message.member.voice.channel.join();
      }else{
        message.reply('You need to be in a voice channel first!');
      }
    }catch(err){
      message.reply("Can't join, an error has occurred.\n" + err.message);
    }
  }
});

client.on('message', async message => {
  if (message.content.toLowerCase() == '~loop' || message.content.toLowerCase() == '~l'){
    try{
      if (!message.guild) return;
      if(message.member.voice.channel){
        if (isLoop){
          isLoop = false;
          message.reply('Loop Mode has been turned **off**');
          loopText = "false";
          console.log(`\n====================\nLoop has been set to ${loopText}\n====================`);
        }else{
          isLoop = true;
          message.reply('Loop Mode has been turned **on**');
          loopText = "true";
          console.log(`\n====================\nLoop has been set to ${loopText}\n====================`);
        }
      }else{
        message.reply('You need to be in a voice channel first!');
      }
    }catch(err){
      message.reply("Can't loop the song. An error has occurred.\n" + err.message);
    }
  }
});

    
client.on('message', async message => {
  if (message.content.toLowerCase().startsWith('~play') || message.content.toLowerCase().startsWith('~p')){
    try{
      if (!message.guild) return;
      if (message.member.voice.channel){
        const input = message.content;
        const amount = 1;
        let userInput = "";
        let n = "";
        if (input.substring(0, 3) == "~p " || input.substring(0, 3) == "~P "){
          userInput = input.slice(3);
        }else{
          userInput = input.slice(6);
        }

        console.log(`Playing song ${userInput}`);
        const ytdl = require('ytdl-core-discord');
        const info = await ytdl.getInfo(userInput)
        const title = info.videoDetails.title;
        const views = info.videoDetails.viewCount;
        const s = info.videoDetails.lengthSeconds;
        // Inserts commas into the views so it looks nice.
        var commas = views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        // Makes the length of the video appear in minutes.
        function fmtMSS(s){return(s-(s%=60))/60+(9<s?':':':0')+s}
        
        const connection = await message.member.voice.channel.join();

        async function play(connection, url){
          console.log(`\n====================\n${title} is now playing.\nLink: ${userInput}\nIn: ${message.guild.name}\nLoop = ${loopText}\n====================`)
          const dispatcher = connection.play(await ytdl(url), { type: 'opus' }, { highWaterMark: 1 });
          /*await ytdl(url,{ type: 'opus', filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25 }), { highWaterMark: 1 });*/
          connection.dispatcher.setVolumeLogarithmic(volumes);
          dispatcher.on('finish', () => {
            if(isLoop){
              play(connection, userInput);
            }else{
              console.log(`${title} has stopped playing\nIn: ${message.guild.name}\n====================`);
              dispatcher.destroy();
              client.user.setActivity({
                name: 'Music!',
                type: 2
              }); 
            }
          });
        }
        play(connection, userInput);

        const embed = new Discord.MessageEmbed()
            .setTitle(`${title}`)
            .setColor('#9966cc')
            .setURL(`${userInput}`)
            .setDescription(`Views: ${commas}\nLength: ${fmtMSS(s)}\nLoop: ${loopText}`)
            .setAuthor(message.author.username)
            .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)
            .setThumbnail()
            //'http://vignette1.wikia.nocookie.net/clubpenguin/images/2/2e/Amethyst.png/revision/latest?cb=20130105192038'

          message.channel.send(embed)
          
          client.user.setActivity({
            name: `${title} in ${message.guild.name}`,
            url: `${userInput}`,
            type: 2,
          })

      }else{
        message.reply("You need to be in a voice channel to request a song.");
      }
    }catch(err){
        message.reply("Can't play the song. An error has occurred\n" + err.message);
        if (err.message == "Status code: 410"){
          message.reply("This video is age restricted. Please find another.");
        }
    }
  }
});

client.on('message', async message => {
  if (message.content.toLowerCase() == '~stop' || message.content.toLowerCase() == '~s'){
    try{
      if(!message.guild) return;
      if (message.member.voice.channel){
        message.member.voice.channel.leave();
        client.user.setActivity({
          name: 'Music!',
          type: 2
        })
        const embed2 = new Discord.MessageEmbed()
            .setTitle("The song has been stopped!")
            .setColor('#9966cc')
            .setAuthor(message.author.username)
            .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)
            .setThumbnail()
            //'http://vignette1.wikia.nocookie.net/clubpenguin/images/2/2e/Amethyst.png/revision/latest?cb=20130105192038'

          message.channel.send(embed2)
          console.log(`Amethyst has been stopped in: ${message.guild.name}`)
      }else if(!message.member.voice.channel){
        message.reply("You need to be in a voice channel to ask the bot to stop!");
      }
    }catch(err){
      message.reply("Can't stop the bot. An error has occurred.\n" + err.message);
    }
  }
});


client.on('message', async message => {
  if (message.content.toLowerCase().startsWith('~status')){
    if(message.member.hasPermission('ADMINISTRATOR')){
      try{
        const content = message.content.toLowerCase().replace('~status', '')
        if (content == ' d' || content == ' default'){
          client.user.setPresence({
            activity: {
              name: "Music!",
              type: 2
            }
          })
        }else{
          client.user.setPresence({
            activity: {
              name: content,
              type: 2
            }
          })
        }
      }catch(err){
        message.reply("Can't change status, an error has occurred.\n" + err.message);
      }
    }
  }
});


client.on('message', async message => {
  if (message.content.toLowerCase() == '~help' || message.content.toLowerCase() == 'h'){
    try{
      if(!message.guild) return
        const embed = new Discord.MessageEmbed()
            .setTitle(`Help`)
            .setDescription('A help menu for the Amethyst Discord Bot')
            .addFields(
                {name: '~j, ~join', value: 'Makes the bot join the voice channel.'},
                {name: '~p, ~play {link}', value: 'Takes a YouTube link as input to play any song/video'},
                //{name: '~c, ~christmas', value: 'Plays Festive Music.'},
                {name: '~s, ~stop', value: "Makes the bot leave the current voice channel"},
                {name: '~status', value: 'Changes the bot\'s status temporarily.'},
                {name: '~l, ~loop', value: 'Loops a song.'},
                {name: '~v, ~volume {int}, {d}', value: 'Changes the volume of the bot.'},
                {name: '~h, ~help', value: 'Makes the help menu appear. A.K.A This menu'},
                {name: '~st, ~stats', value: 'Prints a dedicated statistic menu for the bot'}
            )
            .setColor('#9966cc')
            .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)
            .setThumbnail('http://vignette1.wikia.nocookie.net/clubpenguin/images/2/2e/Amethyst.png/revision/latest?cb=20130105192038')
        message.channel.send(embed)
    }catch(err){
      message.reply("Can't send help. An error occurred.\n" + err.message);
    }
  }
});

client.on('message', async message => {
  if (message.content.toLowerCase().startsWith('~volume') || message.content.toLowerCase().startsWith('~v')){
    try{
      if(!message.guild) return
        const vInput = message.content.toLowerCase();
        
        const n1 = vInput.replace('~volume', '~v')
        const userInput1 = n1.replace('~v', '').slice(1)
        if (userInput1 > 0){
          volumes = userInput1;
          message.reply(`Volume: ${volumes}`);
          console.log(`\nVolume: ${volumes} - In: ${message.guild.name}`);
        }else if (userInput1 == "d"){
          volumes = 1;
          message.reply("Volume: Default");
          console.log(`\nVolume: Default - In: ${message.guild.name}`);
        }
    }catch(err){
      message.reply("Can't change volume. An error has occurred.\n" + err.message);
    }
  }
});

client.on('message', async message => {
  if (message.content.toLowerCase() == '~stats' || message.content.toLowerCase() == '~st'){
    try{
      if(!message.guild)return
    var s = client.uptime;
      // Print the uptime of the bot
    
      var ms = s % 1000;
      s = (s - ms) / 1000;
      var secs = s % 60;
      s = (s - secs) / 60;
      var mins = s % 60;
      var hrs = (s - mins) / 60;
      var days = (s - hrs) / 24;
      const uptime = `**${days}** days, **${hrs}** hours, **${mins}** mins, **${secs}** seconds.`
      const verNum = `${version}`


      // Print embed

    const embed = new Discord.MessageEmbed()
      .setTitle("Stats")
      .setDescription("Made by: Joystick#7300")
      .addFields(
        {name: `Uptime:`, value: uptime},
        {name: `Version:`, value: verNum}
      )
        .setColor('#9966cc')
        .setFooter(`Requested by: ${message.author.username}`, `${message.author.avatarURL()}`)
        //.setThumbnail()
      message.channel.send(embed);
      
    }catch(err){
      message.reply("Can't print uptime. An error has occurred.\n" + err.message)
    }
  }
});

client.login(token);