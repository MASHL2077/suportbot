import { Telegraf, Markup } from 'telegraf';
import { message } from 'telegraf/filters';
import 'dotenv/config';

const bot = new Telegraf(process.env.BOT_TOKEN || 'none');

// Хранение состояний пользователей
const userStates = {};

// Инициализация состояния пользователя
function initializeUserState(userId) {
  userStates[userId] = {
    havePhoto: false,
    data: {
      foto: [],
      problem: '',
      pin: ''
    },
    photoReceived: false,
  };
}

// Удаление сессии пользователя
function clearUserState(userId) {
  if (userStates[userId]) {
    delete userStates[userId];
  }
}

bot.start((ctx) => {
  const userId = ctx.from.id;

  // Инициализируем состояние пользователя при старте
  initializeUserState(userId);

  ctx.reply(
    'Привет! Выберите действие:',
    Markup.keyboard([['Оставить заявку']]).resize()
  );
});

bot.hears('Оставить заявку', async (ctx) => {
  const userId = ctx.from.id;

  // Сбрасываем состояние при новой заявке
  initializeUserState(userId);

  await ctx.reply('Пожалуйста, опишите вашу проблему.');
});

// Обработка текстовых сообщений
bot.on(message('text'), async (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates[userId];
  const messageText = ctx.message.text;

  if (!userState) {
    // Если по какой-то причине нет сессии, инициализируем ее
    initializeUserState(userId);
  }

  if (!userState.data.problem) {
    // Сохраняем описание проблемы
    userState.data.problem = messageText;
    await ctx.reply('При наличии, отправьте скриншоты или отправьте номер.');
    userState.havePhoto = true; // Ожидание фото или пина
  } else if (userState.havePhoto) {
    // Если фото или номер были ожидаемы
    userState.data.pin = messageText;
    await ctx.reply('Данные получены, спасибо!');

    const caption = `${userState.data.problem}\n\n${userState.data.pin}`;

    if (userState.photoReceived) {
      // Отправка фото с описанием
      await ctx.telegram.sendPhoto(process.env.CHAT_ID, userState.data.foto[0], {
        caption: caption,
      });
    } else {
      // Отправка текста без фото
      await ctx.telegram.sendMessage(process.env.CHAT_ID, caption);
    }

    // Сброс сессии пользователя
    clearUserState(userId);
  }
});

// Обработка фото
bot.on(message('photo'), async (ctx) => {
  const userId = ctx.from.id;
  const userState = userStates[userId];
  
  if (!userState) {
    // Если нет сессии, инициализируем
    initializeUserState(userId);
  }

  const photo = ctx.message.photo[ctx.message.photo.length - 1]; // Самое большое изображение
  userState.data.foto.push(photo.file_id);
  userState.photoReceived = true;

  await ctx.reply('Фото получено, теперь отправьте номер.');
  userState.havePhoto = true; // Ожидание номера
});

// Запуск бота
bot.launch(() => {
  console.log('⚡️⚡️⚡️ Bot started ⚡️⚡️⚡️');
});
