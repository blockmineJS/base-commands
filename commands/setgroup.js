module.exports = (bot) => {
    class SetGroupCommand extends bot.api.Command {
        constructor(settings = {}) {
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
            this.settings = settings;
        }

        async handler(bot, typeChat, user, { username, groupname }) {
            try {
                const currentGroups = await bot.api.performUserAction(username, 'getGroups');
                
                const hasGroup = currentGroups.includes(groupname);
                
                if (hasGroup) {
                    await bot.api.performUserAction(username, 'removeGroup', { group: groupname });
                    const messageTemplate = this.settings?.setgroup_removed || '&aГруппа &e{group}&a &cудалена&a у пользователя &e{user}&a.';
                    const reply = messageTemplate
                        .replace('{group}', groupname)
                        .replace('{user}', username);
                    bot.api.sendMessage(typeChat, reply, user.username);
                } else {
                    await bot.api.performUserAction(username, 'addGroup', { group: groupname });
                    const messageTemplate = this.settings?.setgroup_added || '&aГруппа &e{group}&a &bдобавлена&a пользователю &e{user}&a.';
                    const reply = messageTemplate
                        .replace('{group}', groupname)
                        .replace('{user}', username);
                    bot.api.sendMessage(typeChat, reply, user.username);
                }

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
                bot.sendLog(`[BaseCommands|setgroup] Ошибка при работе с пользователем ${username}: ${errorMessage}`);
                bot.api.sendMessage(typeChat, `&cОшибка при работе с пользователем &e${username}&c: &f${errorMessage}`, user.username);
            }
        }
    }
    return SetGroupCommand;
};