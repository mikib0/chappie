const translations = {
  en: `<b>chappie is alive!💪</b>\nAs you might be aware chappie had recently experienced a downtime. We understand how frustrating and inconvenient it can be and for that, we sincerely apologize. We're now happy to inform you that the issue has been resolved and we've taken measures to ensure that it does not happen again in the future. We appreciate your patience and understanding during this challenging time. Go ahead and ask chappie!😉`,
  es: '<b>¡Chappie está vivo!💪</b> \nComo sabrá, chappie había experimentado recientemente un tiempo de inactividad. Entendemos lo frustrante e inconveniente que puede ser y por eso, nos disculpamos sinceramente. Ahora estamos encantados de informarle que el problema se ha resuelto y hemos tomado medidas para garantizar que no vuelva a suceder en el futuro. Agradecemos su paciencia y comprensión durante este momento difícil. ¡Adelante y pregúntale a chappie!😉',
  ru: '<b>Чаппи жив!💪</b>\nКак вы, возможно знаете Чаппи недавно пережил простой. Мы понимаем, насколько это может быть неприятно и неудобно, и за это приносим искренние извинения. Теперь мы рады сообщить вам, что проблема была решена, и мы приняли меры для того, чтобы она не повторилась в будущем. Мы ценим ваше терпение и понимание в это непростое время. Давай, спроси чаппи! 😉',
  ar: '<b> تشابي على قيد الحياة! 💪 </b>  n كما تعلمون ، تشابي تعرضت مؤخرًا لوقت توقف. نحن نتفهم كيف يمكن أن يكون الأمر محبطًا ومزعجًا ولهذا ، نعتذر بصدق. يسعدنا الآن إبلاغك بأن المشكلة قد تم حلها وأننا اتخذنا إجراءات لضمان عدم تكرارها في المستقبل. نحن نقدر سعة صدرك وتفهمك خلال هذا الوقت الصعب. انطلق واسأل تشابي!',
  fr: "<b>chappie est vivant ! 💪</b>\nComme vous le savez peut-être, chappie a récemment connu un temps d'arrêt. Nous comprenons à quel point cela peut être frustrant et gênant et pour cela, nous nous en excusons sincèrement. Nous sommes maintenant heureux de vous informer que le problème a été résolu et que nous avons pris des mesures pour que cela ne se reproduise plus à l'avenir. Nous apprécions votre patience et votre compréhension pendant cette période difficile. Allez-y et demandez à chappie ! 😉",
  fa: '<b>chappie زنده است!💪</b>\nهمانطور که ممکن است آگاه باشید chappie اخیراً یک خرابی را تجربه کرده بود. ما درک می کنیم که چقدر می تواند خسته کننده و ناخوشایند باشد و به همین دلیل، صمیمانه عذرخواهی می کنیم. اکنون خوشحالیم که به اطلاع شما برسانیم که مشکل حل شده است و اقداماتی را انجام داده ایم تا در آینده تکرار نشود. ما از صبر و درک شما در این دوران چالش برانگیز قدردانی می کنیم. برو و بپرس چپی!😉',
  zh: '<b>chappie 还活着！💪</b>\n您可能知道 chappie 最近经历了一次停机。 我们理解这会带来多么令人沮丧和不便，为此，我们深表歉意。 现在，我们很高兴地通知您，该问题已得到解决，我们已采取措施确保以后不会再发生此类问题。 在这个充满挑战的时期，我们感谢您的耐心和理解。 去问查比吧！😉',
};

const options = {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'English',
          callback_data: 'translate_chapppieisback_en',
        },
        {
          text: 'Español',
          callback_data: 'translate_chapppieisback_es',
        },
        {
          text: 'Русский',
          callback_data: 'translate_chapppieisback_ru',
        },
        {
          text: 'عربي',
          callback_data: 'translate_chapppieisback_ar',
        },
      ],
      [
        {
          text: 'Français',
          callback_data: 'translate_chapppieisback_fr',
        },
        {
          text: 'فارسی',
          callback_data: 'translate_chapppieisback_fa',
        },
        {
          text: '中国人',
          callback_data: 'translate_chapppieisback_zh',
        },
      ],
    ],
  },
};

module.exports = {
  translations,
  options,
};
