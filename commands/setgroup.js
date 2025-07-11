module.exports = (bot) => {
    class SetGroupCommand extends bot.api.Command {
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
                const currentGroups = await bot.api.performUserAction(username, 'getGroups');
                
                const hasGroup = currentGroups.includes(groupname);
                
                let actionText;
                if (hasGroup) {
                    await bot.api.performUserAction(username, 'removeGroup', { group: groupname });
                    actionText = '&cудалена';
                } else {
                    await bot.api.performUserAction(username, 'addGroup', { group: groupname });
                    actionText = '&bдобавлена';
                }

                const reply = `&aГруппа &e${groupname}&a ${actionText}&a у пользователя &e${username}&a.`;
                bot.api.sendMessage(typeChat, reply, user.username);

            } catch (error) {
                let errorMessage = 'Неизвестная ошибка';
                if (typeof error === 'object' && error !== null) {
                    errorMessage = error.message || JSON.stringify(error);
                } else {
                    errorMessage = error;
                }
                bot.sendLog(`[BaseCommands|setgroup] Ошибка: ${errorMessage}`);
                bot.api.sendMessage(typeChat, `&cОшибка: &f${errorMessage}`, user.username);
            }
        }
    }
    return SetGroupCommand;
};