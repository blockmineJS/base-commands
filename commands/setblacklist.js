module.exports = (bot) => {
    class SetBlacklistCommand extends bot.api.Command {
        constructor(settings = {}) {
            super({
                name: 'setblacklist',
                aliases: ['blacklist', 'чс'],
                description: 'Добавляет или удаляет пользователя из черного списка.',
                permissions: 'admin.setblacklist',
                owner: 'plugin:base-commands',
                allowedChatTypes: ['chat', 'private', 'clan'],
                args: [{ name: 'username', type: 'string', required: true, description: 'Ник пользователя' }]
            });
            this.settings = settings;
        }

        async handler(bot, typeChat, user, { username }) {
            try {
                const currentStatus = await bot.api.performUserAction(username, 'isBlacklisted');
                
                const newStatus = !currentStatus;
                await bot.api.performUserAction(username, 'setBlacklisted', { value: newStatus });
                
                let messageTemplate;
                if (newStatus) {
                    messageTemplate = this.settings?.setblacklist_added || '&aПользователь &e{user}&a был добавлен в &8черный список&a.';
                } else {
                    messageTemplate = this.settings?.setblacklist_removed || '&aПользователь &e{user}&a был удален из &8черного списка&a.';
                }
                
                const reply = messageTemplate.replace('{user}', username);
                bot.api.sendMessage(typeChat, reply, user.username);

            } catch (error) {
                let errorMessage = 'Неизвестная ошибка';
                if (typeof error === 'object' && error !== null) {
                    if (error.message) {
                        errorMessage = error.message;
                    } else if (error.code === 'P2002') {
                        errorMessage = 'Пользователь уже существует в базе данных';
                    } else {
                        errorMessage = JSON.stringify(error);
                    }
                } else {
                    errorMessage = String(error);
                }
                bot.sendLog(`[BaseCommands|setblacklist] Ошибка при работе с пользователем ${username}: ${errorMessage}`);
                bot.api.sendMessage(typeChat, `&cОшибка при работе с пользователем &e${username}&c: &f${errorMessage}`, user.username);
            }
        }
    }
    return SetBlacklistCommand;
};