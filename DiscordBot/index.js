const discord = require('discord.js');
const bot = new discord.Client();
const config = require("./config.json");

bot.on("ready", () => {
    console.log("Bot Connected.");
});

bot.on('message', (message) => {

    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    // if (message.toString().toLowerCase().indexOf("nani") != -1) {
    //     message.channel.send("omae wa mou shindeiru");
    //     naniLink(message);
    // }

    if (!message.content.startsWith(config.prefix) || message.author.bot) return;

    if (command === "ping") {
        message.channel.send("Pong!");
    }

    if (command === "listuser") {
        if (!isGod(message)) { return };

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
        if (!isGod(message)) { return };
        let member = message.mentions.members.first();
        let reason = args.slice(1).join(" ");
        member.kick(reason);
    }

    if (command === "say") {
        if (!isGod(message)) { return };
        let text = args.slice(0).join(" ");
        message.delete();
        message.channel.send(text);
    }

    if (command === "move") {
        let channel = args.slice(1).join(" ");
        let channelId = message.guild.channels.find('name', channel).id;
        let member = message.mentions.members.first();
        member.setVoiceChannel(channelId);
    }

    if (command === "destroy") {
        if (!isGod(message)) { return };
        let member = message.mentions.members.first();
        var amount = args.slice(1);
        let channels = message.guild.channels;
        var channelsVoice = new Array();

        channels.forEach(element => {
            if (element.type == 'voice') {
                channelsVoice.push(element.id);
            }
        });

        for (let i = 0; i < amount; i++) {
            let e = getRandomInt(0, (channelsVoice.length - 1));
            member.setVoiceChannel(channelsVoice[e]);
        }
    }

    if (command === "clear") {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
                .then(function (list) {
                    message.channel.bulkDelete(list);
                }, function (err) { message.channel.send("ERROR: ERROR CLEARING CHANNEL.") })
        }
    }

    if (command === "roll") {
        var roll;
        var argsArray = new Array();
        argsArray = args;

        for (var i = 0; i < argsArray.length; i++) {
            if (isNaN(parseInt(argsArray[i]))) {
                message.reply("Numbers only you fucking idiot.");
                return;
            } else {
                argsArray[i] = parseInt(argsArray[i]);
            }
        }

        if (args.length < 1) {
            roll = getRandomInt(1, 6);
            message.reply("With a 6-sided die, you rolled a " + roll + "!");
        } else if (argsArray.length > 1 && argsArray.length < 3) {
            var returnedNumber = getRandomInt(argsArray[0], argsArray[1]);
            message.reply("With a " + argsArray[0] + " to " + argsArray[1] + "-sided die, you rolled a " + returnedNumber + "!");
        } else if (argsArray.length > 2) {
            message.reply("Only choose between 2 numbers.");
        } else {
            roll = getRandomInt(1, argsArray[0]);
            message.reply("With a " + argsArray[0] + "-sided die, you rolled a " + roll + "!");
        }
    }

    if (command === "play") {
        if (args.length > 1) {
            let channel = args.slice(1).join(" ");
            const ytdl = require('ytdl-core');
            var argsString = args.toString();
            let timestamp = getYoutubeTimestamp(args);
            const streamOptions = { seek: timestamp, volume: 1 };
            const broadcast = bot.createVoiceBroadcast();

            let selectedChannel = bot.channels.find('name', channel);
            selectedChannel.join()
                .then(connection => {
                    const stream = ytdl(argsString, { filter: 'audioonly' });
                    broadcast.playStream(stream, streamOptions);
                    const dispatcher = connection.playBroadcast(broadcast);
                })
                .catch(console.error);

        } else {
            const ytdl = require('ytdl-core');
            var argsString = args.toString();
            let timestamp = getYoutubeTimestamp(args);
            const streamOptions = { seek: timestamp, volume: 1 };
            const broadcast = bot.createVoiceBroadcast();

            message.member.voiceChannel.join()
                .then(connection => {
                    const stream = ytdl(argsString, { filter: 'audioonly' });
                    broadcast.playStream(stream, streamOptions);
                    const dispatcher = connection.playBroadcast(broadcast);
                })
                .catch(console.error);
        }
    }

    if (command === "stop") {
        message.member.voiceChannel.leave();
    }

    if (command === "test") {
        console.log(args);
        if (args.length > 1) {
            let channel = args.slice(1).join(" ");

        }
    }
});

function isGod(message) {
    if (message.author.id !== config.ownerID) {
        message.reply("Fuck you, you're not god.");
        return false;
    }
    return true;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getYoutubeTimestamp(args) {
    var argsString = args.toString();
    var search = "?t=";
    var searchIndex;
    if (argsString.indexOf(search) != -1) {
        let amount = parseInt(argsString.substring(argsString.indexOf(search) + 3));
        return amount;
    }
}

function naniLink(message) {
    const ytdl = require('ytdl-core');
    var link = "https://youtu.be/YSgpU70MZno?t=31";
    let timestamp = getYoutubeTimestamp(link);
    const streamOptions = { seek: timestamp, volume: 1 };
    const broadcast = bot.createVoiceBroadcast();

    message.member.voiceChannel.join()
        .then(connection => {
            const stream = ytdl(link, { filter: 'audioonly' });
            broadcast.playStream(stream, streamOptions);
            const dispatcher = connection.playBroadcast(broadcast);
        })
        .catch(console.error);
}

bot.login(config.token);
