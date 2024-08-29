import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';

const bot = new Telegraf(process.env.BOT_TOKEN || 'none');
var ret = '';
var dat = [];
const userStates = {};
let ree = false;

bot.start((ctx) => {
  //   const userId = ctx.from.id;
  userStates[ctx.from.id] = { gs: false, data: { foto: [], oshibka: '', pin: '' } };

  ctx.reply(
    'Привет! Выберите действие:',
    Markup.keyboard([
      ['Оставить заявку'], // Кнопка "Оставить заявку"
    ]).resize(), // Автоматическое изменение размера клавиатуры
  );
});

bot.hears('Оставить заявку', async (ctx) => {
  userStates[ctx.from.id] = { gs: false, data: { foto: [], oshibka: '', pin: '' } };
  //   const userId = ctx.from.id;
  await ctx.reply('Пожалуйста, опишите вашу проблему.');
  userStates[ctx.from.id].gs = false;
});

bot.on(message('text'), async (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text;
  dat.push(message);
  // Проверяем, что сообщение не является пином и текстом с ответом
  if (userStates[userId].gs === false) {
    await ctx.reply('При наличии, отправьте скриншоты или отправьте пин.');
    userStates[userId].gs = true; // Устанавливаем флаг для ожидания фото
  } else if (userStates[userId].gs === true) {
    await ctx.reply('Данные получены, спасибо!');

    if (ree === true) {
      await ctx.telegram.sendMediaGroup(process.env.CHAT_ID, [{ type: 'photo', media: ret }]);
    }
    await ctx.telegram.sendMessage(process.env.CHAT_ID, dat[0]);
    await ctx.telegram.sendMessage(process.env.CHAT_ID, dat[1]);

    userStates[userId].gs = false; // Сбрасываем ожидание после получения данных
    dat = [];
    ree = false;
  }
});

bot.on(message('photo'), async (ctx) => {
  ree = true;
  const userId = ctx.from.id;
  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Получаем самое большое изображение
  //   const fileId = photo.file_id;
  ret = photo.file_id;
  await ctx.reply('отправьте пин');

  userStates[userId].gs = true; // Флаг ожидания пина
});

bot.launch(() => {
  // eslint-disable-next-line no-console
  console.log('⚡️⚡️⚡️ Bot started ⚡️⚡️⚡️');
});
