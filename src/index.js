import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';

const bot = new Telegraf(process.env.BOT_TOKEN || 'none');
var idfoto = '';
var info = [];
const userStates = {};
let flagphoto = false;

bot.start((ctx) => {
  //   const userId = ctx.from.id;
  userStates[ctx.from.id] = { havephoto: false, data: { foto: [], oshibka: '', pin: '' } };

  ctx.reply(
    'Привет! Выберите действие:',
    Markup.keyboard([
      ['Оставить заявку'], // Кнопка "Оставить заявку"
    ]).resize(), // Автоматическое изменение размера клавиатуры
  );
});

bot.hears('Оставить заявку', async (ctx) => {
  userStates[ctx.from.id] = { havephoto: false, data: { foto: [], oshibka: '', pin: '' } };
  //   const userId = ctx.from.id;
  await ctx.reply('Пожалуйста, опишите вашу проблему.');
  userStates[ctx.from.id].havephoto = false;
  //ret = '';
});

bot.on(message('text'), async (ctx) => {
  const userId = ctx.from.id;
  const message = ctx.message.text;
  info.push(message);
  // Проверяем, что сообщение не является текстом с ответом
  if (userStates[userId].havephoto === false) {
    await ctx.reply('При наличии, отправьте скриншоты или отправьте номер.');
    userStates[userId].havephoto = true; // Устанавливаем флаг для ожидания фото
  } else if (userStates[userId].havephoto === true) {
    await ctx.reply('Данные получены, спасибо!');

    if (flagphoto === true) {
      //await ctx.telegram.sendMediaGroup(process.env.CHAT_ID, [{ type: 'photo', media: ret }]);
      const caption = `${info[0]}\n\n${info[1]}`;
    
      await ctx.telegram.sendPhoto(process.env.CHAT_ID, idfoto, {caption: caption,});
    }
    //await ctx.telegram.sendMessage(process.env.CHAT_ID, dat[0]);
    //await ctx.telegram.sendMessage(process.env.CHAT_ID, dat[1]);
    else {
      const caption = `${info[0]}\n\n${info[1]}`;
      await ctx.telegram.sendMessage(process.env.CHAT_ID, caption);
      
    }
    userStates[userId].havephoto = false; // Сбрасываем ожидание после получения данных
    info = [];
    flagphoto = false;
  }
});

bot.on(message('photo'), async (ctx) => {
  flagphoto = true;
  const userId = ctx.from.id;
  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Получаем самое большое изображение
  //   const fileId = photo.file_id;
  idfoto = photo.file_id;
  await ctx.reply('отправьте номер');

  userStates[userId].havephoto = true; // Флаг ожидания пина
});

bot.launch(() => {
  // eslint-disable-next-line no-console
  console.log('⚡️⚡️⚡️ Bot started ⚡️⚡️⚡️');
});
