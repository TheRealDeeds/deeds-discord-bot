const commando = require('discord.js-commando');

module.exports = class DiceRollCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'roll',
            group: 'random',
            memberName: 'roll',
            description: 'Rolls a die.',
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
            message.reply("With a 6-sided die, you rolled a " + roll + "!");
        } else if (/^([^0-9]*)$/.test(args)) {
            message.reply("Numbers only you fucking idiot.");
        } else if (argsArray.length > 1) {
            var returnedNumber = getRandomInt(argsArray[0], argsArray[1]);
            message.reply("With a " + argsArray[0] + " to " + argsArray[1] + "-sided die, you rolled a " + returnedNumber + "!");
        } else {
            roll = getRandomInt(1, argsArray[0]);
            message.reply("With a " + argsArray[0] + "-sided die, you rolled a " + roll + "!");
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
