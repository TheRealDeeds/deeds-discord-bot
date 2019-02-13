const commando = require('discord.js-commando');
const bot = new commando.Client();
const config = require("./config.json");

bot.registry.registerGroup('random', 'Random');
bot.registry.registerDefaults();
bot.registry.registerCommandsIn(__dirname + "/commands");

bot.on("ready", () => {
    console.log("Bot Connected.");

    // var Count;
    // for(Count in bot.users.array()){
    //    var User = bot.users.array()[Count];
    //    console.log(`${User.username}, ${User.id}`);
    // }

});

bot.on('message', (message) => {

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    if (command === "ping") { 
        message.channel.send("Pong!");
    }

    if (command === "asl") {
        let [age, sex, location] = args;
        message.channel.send(`Hello ${message.author.username}, I see you're a ${age} year old ${sex} from ${location}. Wanna fuck?`);
    }

    if (command === "listuser") {
        if (!isGod(message)) {return};
        
        var id;
        bot.users.array().forEach(testUser => {
            if (args == testUser.username) {
                let name = testUser.username;
                id = testUser.id;
                message.channel.send(`${name}, ${id}`);
            }
        });

        if (id == undefined) {
            message.channel.send("Couldn't find user.");
        }
    }

    if (command === "kick") {
        if (!isGod(message)) {return};
        let member = message.mentions.members.first();
        let reason = args.slice(1).join(" ");
        member.kick(reason);
    }

    if (command === "say") {
        if (!isGod(message)) {return};
        let text = args.slice(0).join(" ");
        message.delete();
        message.channel.send(text);
    }

    if (command === "move") {
        console.log("Trying to move.");
        let channel = args.slice(1).join(" ");
        let channelId = message.guild.channels.find('name', channel).id;
        let member = message.mentions.members.first();
        
        member.setVoiceChannel(channelId);
    }

    if (command === "destroy") {
        if (!isGod(message)) {return};
        let member = message.mentions.members.first();
        var amount = args.slice(1);
        let channels = message.guild.channels;
        var channelsVoice = new Array();

        channels.forEach(element => {
            if (element.type == 'voice'){
                channelsVoice.push(element.id);
            }
        });

        for (let i = 0; i < amount; i++) {
            let e = getRandomInt(0, (channelsVoice.length - 1));
            member.setVoiceChannel(channelsVoice[e]);
        }
    }

    if(command === "test") {
        let channels = message.guild.channels;
        var channelsVoice = new Array();

        channels.forEach(element => {
            if (element.type == 'voice'){
                channelsVoice.push(element.id);
                // console.log(element.id + " : " + element.type);
            }
        });
        console.log(channelsVoice);
        // console.log(channels);
    }
});

// How to get User ID by name ~~

// It depends where you're at. If you have access to a message, the best would be
// message.server.members.get("name", "USERNAMEHERE").id;
// otherwise you can also get it globally
// client.users.get("name", "USERNAMEHERE").id;

function isGod(message){
    if (message.author.id !== config.ownerID) {
        message.reply("Fuck you, you're not god.");
        return false;
    }
    return true;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

bot.login(config.token);
