export const translations = {
  en: `
    <b>Apr 4 update</b> <i>chappie is now as powerful as chatGPT!</i>

    We've updated chappie's model. It's is now as capable as chatGPT. It should now give better responses and can understand non-english languages. Plus much more!

    More updates are coming soon....join <a href="t.me/chappieupdates">this channel</a> for all updates about chappie.

    Enjoy!😊
  `,
  ar: `
    <b>تحديث 4 أبريل</b> <i>chappie الآن قوي مثل chatGPT!</i>

    لقد قمنا بتحديث نموذج تشابي. إنه الآن قادر مثل chatGPT. يجب أن تقدم الآن ردودًا أفضل ويمكن أن تفهم اللغات غير الإنجليزية. بالإضافة إلى أكثر من ذلك بكثير!

    المزيد من التحديثات قريبًا .... انضم إلى <a href="t.me/chappieupdates"> هذه القناة </a> للحصول على جميع التحديثات حول Chappie.

    😊!استمتع
  `,
  es: `
    <b>Actualización del 4 de abril</b> <i>¡chappie ahora es tan poderoso como chatGPT!</i>

    Hemos actualizado el modelo de chappie. Ahora es tan capaz como chatGPT. Ahora debería dar mejores respuestas y puede entender idiomas distintos del inglés. ¡Y mucho más!

    Próximamente habrá más actualizaciones... únete a <a href="t.me/chappieupdates">este canal</a> para conocer todas las actualizaciones sobre chappie.

    ¡Disfruta!😊
  `,
  ru: `
    <b>Обновление от 4 апреля</b> <i>chappie теперь так же мощен, как chatGPT!</i>

    Мы обновили модель Чаппи. Теперь он так же функционален, как и chatGPT. Теперь он должен давать лучшие ответы и понимать языки, отличные от английского. Плюс многое другое!

    Скоро появятся новые обновления... присоединяйтесь к <a href="t.me/chappieupdates">этому каналу</a>, чтобы быть в курсе всех обновлений о Чаппи.

    Наслаждайтесь!😊
  `,
  fr: `
    <b>Mise à jour du 4 avril</b> <i>chappie est désormais aussi puissant que chatGPT !</i>

    Nous avons mis à jour le modèle de Chappie. Il est maintenant aussi performant que chatGPT. Il devrait maintenant donner de meilleures réponses et peut comprendre des langues autres que l'anglais. Et bien plus encore !

    D'autres mises à jour sont à venir... rejoignez <a href="t.me/chappieupdates">cette chaîne</a> pour toutes les mises à jour sur chappie.

    Profitez-en!😊
  `,
  zh: `
    <b>4 月 4 日更新</b> <i>chappie 現在和 chatGPT 一樣強大！</i>

    我們更新了 chappie 的模型。它現在和 chatGPT 一樣有能力。它現在應該給出更好的響應並且可以理解非英語語言。還有更多！

    即將推出更多更新....加入 <​​a href="t.me/chappieupdates">此頻道</a> 以獲取有關 chappie 的所有更新。

    享受吧！😊
  `,
};

export const options = {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'Español',
          callback_data: 'translate_chappie_uses_chatgpt_es',
        },
        {
          text: 'Русский',
          callback_data: 'translate_chappie_uses_chatgpt_ru',
        },
        {
          text: 'عربي',
          callback_data: 'translate_chappie_uses_chatgpt_ar',
        },
      ],
      [
        {
          text: 'Français',
          callback_data: 'translate_chappie_uses_chatgpt_fr',
        },
        {
          text: '中国人',
          callback_data: 'translate_chappie_uses_chatgpt_zh',
        },
        {
          text: 'English',
          callback_data: 'translate_chappie_uses_chatgpt_en',
        },
      ],
    ],
  },
};