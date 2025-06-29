const PLUGIN_OWNER_ID = 'plugin:base-commands';

const createSetBlacklistCommand = require('./commands/setblacklist');
const createSetGroupCommand = require('./commands/setgroup');


async function onLoad(bot, options) {
    const log = bot.sendLog;

    const SetBlacklistCommand = createSetBlacklistCommand(bot);
    const SetGroupCommand = createSetGroupCommand(bot);

    try {
        await bot.api.registerPermissions([
            { name: 'admin.setblacklist', description: 'Доступ к команде setblacklist', owner: PLUGIN_OWNER_ID },
            { name: 'admin.setgroup', description: 'Доступ к команде setgroup', owner: PLUGIN_OWNER_ID },
        ]);

        await bot.api.addPermissionsToGroup('Admin', ['admin.setblacklist', 'admin.setgroup']);

        await bot.api.registerCommand(new SetBlacklistCommand());
        await bot.api.registerCommand(new SetGroupCommand());

        log('[BaseCommands] Плагин базовых команд успешно загружен.');
    } catch (error) {
        log(`[BaseCommands] [FATAL] Ошибка при загрузке плагина: ${error.stack}`);
    }
}


async function onUnload({ botId, prisma }) {
    console.log(`[BaseCommands] Начало процедуры удаления для бота ID: ${botId}`);
    try {
        await prisma.command.deleteMany({ where: { botId, owner: PLUGIN_OWNER_ID } });
        await prisma.permission.deleteMany({ where: { botId, owner: PLUGIN_OWNER_ID } });
        console.log(`[BaseCommands] Команды и права плагина успешно удалены из БД.`);
    } catch (error) {
        console.error(`[BaseCommands] Ошибка во время очистки ресурсов плагина:`, error);
    }
}

module.exports = {
    onLoad,
    onUnload
};
