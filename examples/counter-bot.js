const { Telegraf, Markup } = require('telegraf');
const { CallbackData } = require('telegraf-callback-data');

const bot = new Telegraf(process.env.BOT_TOKEN);

let counter = 0;

const counterResetCallbackData = new CallbackData('counter', ['action']);
const counterData = new CallbackData('counter', ['number', 'action']);

const inlineKeyboard = [
  [
    Markup.button.callback(
      '+1',
      counterData.create({
        number: String(1),
        action: 'plus'
      })
    ), // button callback data is equal to `counter:1:plus`

    Markup.button.callback(
      '+5',
      counterData.create({
        number: String(5),
        action: 'plus'
      })
    ), // button callback data is equal to `counter:5:plus`

    Markup.button.callback(
      '+15',
      counterData.create({
        number: String(15),
        action: 'plus'
      })
    ) // button callback data is equal to `counter:15:plus`
  ],
  [
    Markup.button.callback(
      '-1',
      counterData.create({
        number: String(1),
        action: 'minus'
      })
    ), // button callback data is equal to `counter:1:minus`

    Markup.button.callback(
      '-5',
      counterData.create({
        number: String(5),
        action: 'minus'
      })
    ), // button callback data is equal to `counter:5:minus`

    Markup.button.callback(
      '-15',
      counterData.create({
        number: String(15),
        action: 'minus'
      })
    ) // button callback data is equal to `counter:15:minus`
  ],
  [
    Markup.button.callback(
      'Reset',
      counterResetCallbackData.create({
        action: 'reset'
      })
    ) // button callback data is equal to `counter:reset`
  ]
];

bot.start((ctx) =>
  ctx.reply(`Hi! Counter: ${counter}`, {
    ...Markup.inlineKeyboard(inlineKeyboard)
  })
);

bot.action(
  counterData.filter({
    action: 'minus'
  }),
  async (ctx) => {
    const { number, action } = counterData.parse(ctx.callbackQuery.data);

    counter -= Number(number);

    await ctx.answerCbQuery();
    await ctx.editMessageText(`Counter: ${counter}`, {
      ...Markup.inlineKeyboard(inlineKeyboard)
    });
  }
);

bot.action(
  counterData.filter({
    action: 'plus'
  }),
  async (ctx) => {
    const { number, action } = counterData.parse(ctx.callbackQuery.data);

    counter += Number(number);

    await ctx.answerCbQuery();
    await ctx.editMessageText(`Counter: ${counter}`, {
      ...Markup.inlineKeyboard(inlineKeyboard)
    });
  }
);

bot.action(
  counterResetCallbackData.filter({
    action: 'reset'
  }),
  async (ctx) => {
    counter = 0;

    await ctx.answerCbQuery();
    await ctx.editMessageText(`Counter: ${counter}`, {
      ...Markup.inlineKeyboard(inlineKeyboard)
    });
  }
);

bot.launch();
