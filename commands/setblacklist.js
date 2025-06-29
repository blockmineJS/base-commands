module.exports = (bot) => {
    class SetBlacklistCommand extends bot.api.Command {
        constructor() {
            super({
                name: 'setblacklist',
                aliases: ['blacklist', 'чс'],
                description: 'Добавляет или удаляет пользователя из черного списка.',
                permissions: 'admin.setblacklist',
                owner: 'plugin:base-commands',
                allowedChatTypes: ['chat', 'private', 'clan'],
                args: [{ name: 'username', type: 'string', required: true, description: 'Ник пользователя' }]
            });
        }

        async handler(bot, typeChat, user, { username }) {
            try {
                const result = await bot.api.performUserAction(username, 'toggle_blacklist');
                
                const newStatus = result.newStatus;
                
                const reply = newStatus 
                    ? `&aПользователь &e${username}&a был добавлен в &8черный список&a.`
                    : `&aПользователь &e${username}&a был удален из &8черного списка&a.`;
                
                bot.api.sendMessage(typeChat, reply, user.username);

            } catch (error) {
                bot.sendLog(`[BaseCommands|setblacklist] Ошибка: ${error.message}`);
                bot.api.sendMessage(typeChat, `&cОшибка: &f${error.message}`, user.username);
            }
        }
    }
    return SetBlacklistCommand;
};
