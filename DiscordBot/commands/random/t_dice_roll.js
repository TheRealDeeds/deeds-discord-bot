const commando = require('discord.js-commando');

module.exports = class TDiceRollCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 't-roll',
            group: 'random',
            memberName: 't-roll',
            description: 'Rolls a die and talks about it.',
        });
    }

    async run(message, args) {
        var roll;
        var argsArray = new Array();
        argsArray = args.split(" ");

        for (var i = 0; i < argsArray.length; i++) {
            argsArray[i] = parseInt(argsArray[i]);
        }

        if (!args) {
            roll = getRandomInt(1, 6);
            message.channel.send("With a 6-sided die, you rolled a " + roll + "!",
                { tts: true });
        } else if (/^([^0-9]*)$/.test(args)) {
            message.channel.send("Numbers only you fucking idiot.",
                { tts: true });
        } else if (argsArray.length > 1) {
            var returnedNumber = getRandomInt(argsArray[0], argsArray[1]);
            message.channel.send("With a " + argsArray[0] + " to " + argsArray[1] + "-sided die, you rolled a " + returnedNumber + "!",
                { tts: true });
        } else {
            roll = getRandomInt(1, argsArray[0]);
            message.channel.send("With a " + argsArray[0] + "-sided die, you rolled a " + roll + "!",
                { tts: true });
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
