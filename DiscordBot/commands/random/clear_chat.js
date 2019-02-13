const commando = require('discord.js-commando');

module.exports = class ClearChatCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: 'clearall',
            group: 'random',
            memberName: 'clearall',
            description: 'Clears the entire channel.'
        });
    }

    async run(message) {
        if (message.member.hasPermission("MANAGE_MESSAGES")) {
            message.channel.fetchMessages()
                .then(function (list) {
                    message.channel.bulkDelete(list);
                }, function (err) { message.channel.send("ERROR: ERROR CLEARING CHANNEL.") })
        }
    }

}