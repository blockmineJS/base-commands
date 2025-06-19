module.exports = (Command) => {
    class SetGroupCommand extends Command {
        constructor() {
            super({
                name: 'setgroup',
                aliases: ['sg', 'setg'],
                description: 'Выдает или забирает группу у пользователя.',
                permissions: 'admin.setgroup',
                owner: 'plugin:base-commands',
                allowedChatTypes: ['chat', 'private', 'clan'],
                args: [
                    { name: 'username', type: 'string', required: true, description: 'Ник пользователя' },
                    { name: 'groupname', type: 'string', required: true, description: 'Название группы' }
                ]
            });
        }

        async handler(bot, typeChat, user, { username, groupname }) {
            try {
                const result = await bot.api.performUserAction(username, 'toggle_group', { groupName: groupname });

                const actionText = result.actionTaken === 'added' ? '&bвыдана' : '&cотозвана';
                const reply = `&aГруппа &e${groupname}&a была успешно ${actionText}&a пользователю &e${username}&a.`;

                bot.api.sendMessage(typeChat, reply, user.username);

            } catch (error) {
                bot.sendLog(`[BaseCommands|setgroup] Ошибка: ${error.message}`);
                bot.api.sendMessage(typeChat, `&cОшибка: &f${error.message}`, user.username);
            }
        }
    }
    return SetGroupCommand;
};