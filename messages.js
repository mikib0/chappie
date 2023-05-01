const messages = {
  en: {
    START_MSG: `Hi, <b>%%first_name%%</b>!\nI'm chappie, your AI assistant powered by chatGPT. Talk to me and I'll give you human like response and I can also generate images! —type /help for more info. Try now!\n\nJoin <a href="t.me/chappieupdates">this channel</a> for updates about chappie.`,
    NO_ENOUGH_IMAGE_TOKENS:
      "You don't have enough tokens to generate an image. \nYou can get free tokens by referring someone using your referral link <code>%%reflink%%</code> \nOr you can purchase tokens (/purchase).",
    RESPONSE_GEN_ERROR_MESSAGE:
      'an error occured...please try resending your message. Mail mikibo.hamilton@aleeas.com or contact @miki_b0 on telegram if the problem persists.',
    IMAGE_GEN_HELP:
      '📷 Image generation \n\n Type: /image followed by a detailed image description \n Example: /image a white siamese cat',
    PURCHASED: `purchased`,
    FREE: `free`,
    REFERRAL: `referral`,
    REFERRAL_MSG: `get free tokens by referring someone using your referral link.`,
    PURCHASED_SUCCESSFUL: `congratulations🙌 your purchase for %%tokens%% tokens was successful!`,
    PAID_USER_BENEFITS: `Your benefits as a paid user:\n- purchased tokens never expire 🕒\n- faster response 🚀\n- constant availability 🌐\n- higher support priority 🚨`,
    BROKE_MSG: `<b>You don't have tokens.</b>\nYour daily free tokens will be funded by %%tomorrowMidNight%%.\nYou can get free tokens by referring someone using your referral link <code>%%reflink%%</code> \nOr you can purchase tokens (/purchase).`,
    NO_FREE_TOKENS: `Sorry there aren't free tokens available to service your request at the moment. Please check back later, or you can purchase tokens.`,
    HELP: `Hi! I'm chappie, your AI assistant powered by chatGPT.  I can give human like responses to your questions and also generate images. Try now! \n
commands info:
/image [your prompt] - generate image
/reflink - get your referral link —you get tokens reward when a new user starts chappie using the link
/account - view your account info  and settings
/balance - view your balance
/purchase - buy tokens
/support - contact support`,
    SUPPORT: `hey, please contact @miki_b0 on telegram for any problem or suggestion you might have. thank you😊`,
    ACCOUNT_INFO: `hi <b>%%firstName%%!</b>\nacccount type: %%accountType%% \nreferral link: <code>%%refLink%%</code>\nbalance: \n\t %%purchased%% referral: %%referral%%\n\t  %%free%%\n<i>%%referralMsg%%</i>`,
    PAID: 'paid',
    FREE: 'free',
    PURCHASE_TOKENS: 'purchase tokens',
    DONATE: 'donate',
    REGENERATE: 'regenerate',
    BACK_TO_ACCOUNT: '« Back to Account',
    CHECKOUT: `You are purchasing the <b>%%thePlanName%% plan.</b> \nTokens: %%tokens%%\nPrice: $%%price%%\nAccepted Payment Methods:\n\t- 🅿️ PayPal\n\t- 💳 Debit or Credit Card\n\n🛈 Click the <b>«Purchase»</b> button to proceed.\n`,
    PURCHASE: 'purchase',
    BACK_TO_PURCHASE: '« Back to Purchase Plans',
    TRANSLATION: 'translation',
  },

  es: {
    START_MSG: `¡Hola, <b>%%first_name%%</b>!\nSoy Chappie, tu asistente de inteligencia artificial impulsado por chatGPT. ¡Háblame y te daré respuestas humanas y también puedo generar imágenes! —escribe /help para obtener más información. ¡Inténtalo ahora!\n\nÚnete a <a href="t.me/chappieupdates">este canal</a> para recibir actualizaciones sobre Chappie.`,
    NO_ENOUGH_IMAGE_TOKENS:
      'No tienes suficientes tokens para generar una imagen. \nPuedes obtener tokens gratis refiriendo a alguien usando tu enlace de referencia <code>%%reflink%%</code> \nO puedes comprar tokens (/purchase).',
    RESPONSE_GEN_ERROR_MESSAGE:
      'ocurrió un error...por favor, intenta reenviar tu mensaje. Envía un correo electrónico a mikibo.hamilton@aleeas.com o contacta con @miki_b0 en Telegram si el problema persiste.',
    IMAGE_GEN_HELP:
      '📷 Generación de imágenes \n\n Escribe: /image seguido de una descripción detallada de la imagen \n Ejemplo: /image un gato siamés blanco',
    PURCHASED: `comprados`,
    FREE: `gratuitos`,
    REFERRAL: `referencia`,
    REFERRAL_MSG: `obtén tokens gratis refiriendo a alguien usando tu enlace de referencia.`,
    PURCHASED_SUCCESSFUL: `¡Felicidades🙌 tu compra de %%tokens%% tokens fue exitosa!`,
    PAID_USER_BENEFITS: `Tus beneficios como usuario de pago:\n- los tokens comprados nunca caducan 🕒\n- respuesta más rápida 🚀\n- disponibilidad constante 🌐\n- prioridad en soporte más alta 🚨`,
    BROKE_MSG: `<b>No tienes tokens.</b>\nTus tokens gratuitos diarios serán financiados antes de las %%tomorrowMidNight%%.\nPuedes obtener tokens gratis refiriendo a alguien usando tu enlace de referencia <code>%%reflink%%</code> \nO puedes comprar tokens (/purchase).`,
    NO_FREE_TOKENS: `Lo siento, no hay tokens gratuitos disponibles para atender tu solicitud en este momento. Por favor, vuelve más tarde o puedes comprar tokens.`,
    HELP: `¡Hola! Soy Chappie, tu asistente de inteligencia artificial impulsado por chatGPT. Puedo dar respuestas humanas a tus preguntas y también generar imágenes. ¡Inténtalo ahora! \n
información de comandos:
/image [tu descripción] - generar imagen
/reflink - obtén tu enlace de referencia —obtienes una recompensa en tokens cuando un nuevo usuario comienza a usar Chappie usando el enlace
/account - ve tu información de cuenta y configuraciones
/balance - ve tu saldo
/purchase - compra tokens
/support - contacta con soporte`,
    SUPPORT: `hola, por favor contacta con @miki_b0 en Telegram para cualquier problema o sugerencia que puedas tener. Gracias😊`,
    ACCOUNT_INFO: `hola <b>%%firstName%%!</b>\ntipo de cuenta: %%accountType%% \nenlace de referencia: <code>%%refLink%%</code>\nsaldo: \n\t %%purchased%% referencia: %%referral%%\n\t  %%free%%\n<i>%%referralMsg%%</i>`,
    PAID: 'de pago',
    FREE: 'gratuito',
    PURCHASE_TOKENS: 'comprar tokens',
    DONATE: 'donar',
    REGENERATE: 'regenerar',
    BACK_TO_ACCOUNT: '« Volver a la cuenta',
    CHECKOUT: `Estás comprando el plan <b>%%thePlanName%%.</b> \nTokens: %%tokens%%\nPrecio: $%%price%%\nMétodos de pago aceptados:\n\t- 🅿️ PayPal\n\t- 💳 Tarjeta de débito o crédito\n\n🛈 Haz clic en el botón <b>«Comprar»</b> para continuar.\n`,
    PURCHASE: 'comprar',
    BACK_TO_PURCHASE: '« Volver a los planes de compra',
    TRANSLATION: 'traducción',
  },

  ru: {
    START_MSG:
      'Привет, <b>%%first_name%%</b>! \nЯ chappie, твой AI-ассистент, работающий на chatGPT. Общайся со мной, и я дам тебе ответ, похожий на человеческий, а также могу генерировать изображения! —набери /help для получения дополнительной информации. Попробуй сейчас! \n\nПрисоединяйся к <a href="t.me/chappieupdates">этому каналу</a> для получения обновлений о chappie.',
    NO_ENOUGH_IMAGE_TOKENS:
      'У тебя недостаточно токенов для создания изображения. \nТы можешь получить бесплатные токены, пригласив кого-то с помощью своей реферальной ссылки <code>%%reflink%%</code> \nИли ты можешь купить токены (/purchase).',
    RESPONSE_GEN_ERROR_MESSAGE:
      'произошла ошибка...пожалуйста, попробуй повторно отправить свое сообщение. Если проблема сохраняется, отправь письмо на mikibo.hamilton@aleeas.com или свяжись с @miki_b0 в Telegram.',
    IMAGE_GEN_HELP:
      '📷 Создание изображения \n\n Введите: /image, а затем следуйте подробному описанию изображения. \n Пример: /image белый сиамский кот',
    PURCHASED: 'куплено',
    FREE: 'бесплатно',
    REFERRAL: 'реферал',
    REFERRAL_MSG:
      'получите бесплатные токены, пригласив кого-то с помощью своей реферальной ссылки.',
    PURCHASED_SUCCESSFUL:
      'поздравляем🙌 ваша покупка для %%tokens%% токенов прошла успешно!',
    PAID_USER_BENEFITS:
      'Ваши преимущества как платного пользователя:\n- купленные токены никогда не истекают 🕒\n- более быстрый ответ 🚀\n- постоянная доступность 🌐\n- более высокий приоритет поддержки 🚨',
    BROKE_MSG:
      '<b>У тебя нет токенов.</b>\nТвои ежедневные бесплатные токены будут пополнены до %%tomorrowMidNight%%.\nТы можешь получить бесплатные токены, пригласив кого-то с помощью своей реферальной ссылки <code>%%reflink%%</code> \nИли ты можешь купить токены (/purchase).',
    NO_FREE_TOKENS:
      'Извините, нет свободных токенов, чтобы обработать ваш запрос в данный момент. Пожалуйста, попробуйте позже, или вы можете купить токены.',
    HELP: 'Привет! Я chappie, твой AI-ассистент, работающий на chatGPT. Я могу давать ответы на твои вопросы, похожие на человеческие, а также генерировать изображения. Попробуйте сейчас! \n команды: /image [твое описание] - создание изображения /reflink - получить свою реферальную ссылку —ты получишь награду в токенах, когда новый пользователь начнет использовать chappie, используя эту ссылку /account - просмотр информации и настроек своей учетной записи /balance - просмотр баланса /purchase - купить токены /support - связаться с поддержкой',
    SUPPORT:
      'пожалуйста, свяжитесь с @miki_b0 в Telegram, если у вас возникли какие-либо проблемы или предложения. Спасибо😊',
    ACCOUNT_INFO:
      'Привет, <b>%%firstName%%!</b>\nТип аккаунта: %%accountType%% \nРеферальная ссылка: <code>%%refLink%%</code>\nБаланс: \n\t %%purchased%% реферальных: %%referral%%\n\t  %%free%%\n<i>%%referralMsg%%</i>',
    PAID: 'оплаченный',
    FREE: 'бесплатный',
    PURCHASE_TOKENS: 'купить токены',
    DONATE: 'пожертвовать',
    REGENERATE: 'восстановить',
    BACK_TO_ACCOUNT: '« Назад к аккаунту',
    CHECKOUT:
      'Вы покупаете план <b>%%thePlanName%%.</b> \nТокены: %%tokens%%\nЦена: $%%price%%\nПринимаемые способы оплаты:\n\t- 🅿️ PayPal\n\t- 💳 Дебетовая или кредитная карта\n\n🛈 Нажмите кнопку <b>«Купить»</b>, чтобы продолжить.\n',
    PURCHASE: 'купить',
    BACK_TO_PURCHASE: '« Назад к планам покупки',
    TRANSLATION: 'перевод',
  },
  fr: {
START_MSG: `Salut, <b>%%first_name%%</b> !\nJe suis chappie, votre assistant IA alimenté par chatGPT. Parlez-moi et je vous donnerai une réponse humaine et je peux également générer des images ! —tapez /help pour plus d'informations. Essayez maintenant !\n\nRejoignez <a href="t.me/chappieupdates">ce canal</a> pour les mises à jour sur chappie.`,
NO_ENOUGH_IMAGE_TOKENS:
"Vous n'avez pas assez de jetons pour générer une image. \nVous pouvez obtenir des jetons gratuits en recommandant quelqu'un en utilisant votre lien de parrainage <code>%%reflink%%</code> \nOu vous pouvez acheter des jetons (/purchase).",
RESPONSE_GEN_ERROR_MESSAGE:
"une erreur s'est produite...veuillez réessayer en renvoyant votre message. Envoyez un mail à mikibo.hamilton@aleeas.com ou contactez @miki_b0 sur Telegram si le problème persiste.",
IMAGE_GEN_HELP:
`📷 Génération d'image \n\n Tapez: /image suivi d'une description détaillée de l'image \n Exemple: /image un chat siamois blanc`,
PURCHASED: 'acheté',
FREE: 'gratuit',
REFERRAL: 'parrainage',
REFERRAL_MSG: `obtenez des jetons gratuits en recommandant quelqu'un en utilisant votre lien de parrainage.`,
PURCHASED_SUCCESSFUL: `Félicitations🙌 votre achat de %%tokens%% jetons a été effectué avec succès !`,
PAID_USER_BENEFITS: `Vos avantages en tant qu'utilisateur payant:\n- les jetons achetés n'expirent jamais 🕒\n- réponse plus rapide 🚀\n- disponibilité constante 🌐\n- priorité de support plus élevée 🚨`,
BROKE_MSG: `<b>Vous n'avez pas de jetons.</b>\nVos jetons gratuits quotidiens seront financés par %%tomorrowMidNight%%.\nVous pouvez obtenir des jetons gratuits en recommandant quelqu'un en utilisant votre lien de parrainage <code>%%reflink%%</code> \nOu vous pouvez acheter des jetons (/purchase).`,
NO_FREE_TOKENS: `Désolé, il n'y a pas de jetons gratuits disponibles pour répondre à votre demande pour le moment. Veuillez revenir plus tard, ou vous pouvez acheter des jetons.`,
HELP: `Salut ! Je suis chappie, votre assistant IA alimenté par chatGPT. Je peux donner des réponses humaines à vos questions et également générer des images. Essayez maintenant ! \n commandes info: /image [votre prompt] - générer une image /reflink - obtenir votre lien de recommandation - vous obtenez une récompense de jetons lorsque qu'un nouvel utilisateur commence à utiliser chappie en utilisant le lien /account - voir vos informations de compte et les paramètres /balance - voir votre solde /purchase - acheter des jetons /support - contacter le support`,
SUPPORT: `hé, veuillez contacter @miki_b0 sur Telegram pour tout problème ou suggestion que vous pourriez avoir. Merci😊`,
ACCOUNT_INFO: `salut <b>%%firstName%%!</b>\ntype de compte: %%accountType%% \nlien de recommandation: <code>%%refLink%%</code>\nsolde: \n\t %%purchased%% parrainage: %%referral%%\n\t  %%free%%\n<i>%%referralMsg%%</i>`,
PAID: 'payé',
FREE: 'gratuit',
PURCHASE_TOKENS: 'acheter des jetons',
DONATE: 'donner',
REGENERATE: 'régénérer',
BACK_TO_ACCOUNT: '« Retour au Compte',
CHECKOUT: `Vous achetez le plan <b>%%thePlanName.</b> \nJetons: %%tokens%%\nPrix : $%%price%%\nMéthodes de paiement acceptées :\n\t- 🅿️ PayPal\n\t- 💳 Carte de débit ou de crédit\n\n🛈 Cliquez sur le bouton <b>« Acheter »</b> pour procéder.\n`,
PURCHASE: 'achat',
BACK_TO_PURCHASE: '« Retour aux Plans d\'achat',
TRANSLATION: 'traduction',
},
  ar: {
    START_MSG:
      '.مرحباً، <b>%%first_name%%</b>!\nأنا تشابي، مساعدك الذكي المدعوم بتقنية تشات جي بي تي. تحدث معي وسأعطيك رداً شبيهاً بالإنسان ويمكنني أيضاً إنشاء صور! —اكتب /help للمزيد من المعلومات. جرب الآن!\n\nانضم إلى <a href="t.me/chappieupdates">هذه القناة</a> للحصول على تحديثات حول تشابي',
    NO_ENOUGH_IMAGE_TOKENS:
      '(/purchase)ليس لديك ما يكفي من الرموز لإنشاء صورة. \nيمكنك الحصول على رموز مجانية عن طريق الإحالة على شخص باستخدام رابط الإحالة الخاص بك <code>%%reflink%%</code> \nأو يمكنك شراء الرموز',
    RESPONSE_GEN_ERROR_MESSAGE:
      '.حدث خطأ...يرجى إعادة إرسال رسالتك. إذا استمرت المشكلة، يرجى الاتصال بـ @miki_b0 على تليجرام',
    IMAGE_GEN_HELP:
      '📷 إنشاء صورة \n\n اكتب: /image تتبعها وصف مفصل للصورة \n مثال: /image قطة سيامية بيضاء',
    PURCHASED: 'تم الشراء',
    FREE: 'مجاني',
    REFERRAL: 'الإحالة',
    REFERRAL_MSG:
      '.احصل على رموز مجانية عن طريق الإحالة على شخص باستخدام رابط الإحالة الخاص بك',
    PURCHASED_SUCCESSFUL: '!تهانينا🙌 تم شراء %%tokens%% الرموز بنجاح',
    PAID_USER_BENEFITS:
      'فوائدك كمستخدم مدفوع:\n- الرموز المشتراة لا تنتهي أبدًا 🕒\n- استجابة أسرع 🚀\n- توافر مستمر 🌐\n- أولوية دعم أعلى 🚨',
    BROKE_MSG:
      '(/purchase).<b>ليس لديك رموز.</b>\nسيتم تمويل رموزك المجانية اليومية بحلول الساعة %%tomorrowMidNight%%.\nيمكنك الحصول على رموز مجانية عن طريق الإحالة على شخص باستخدام رابط الإحالة الخاص بك <code>%%reflink%%</code> \nأو يمكنك شراء الرموز ',
    NO_FREE_TOKENS:
      '.عذرًا، لا تتوفر رموز مجانية حاليًا لخدمة طلبك. يرجى التحقق مرة أخرى في وقت لاحق، أو يمكنك شراء الرموز',
    HELP: 'مرحبًا! أنا تشابي، مساعدك الذكي المدعوم بتقنية تشات جي بي تي.  يمكنني إعطاء استجابات شبيهة بالإنسان لأسئلتك وأيضًا إنشاء صور. جرب الآن! \n معلومات الأوامر: /image [نص وصف الصورة] - إنشاء صورة /reflink - الحصول على رابط الإحالة الخاص بك —ستحصل على مكافأة بالرموز عندما يبدأ مستخدم جديد تشابي باستخدام الرابط /account - عرض معلومات حسابك وإعداداته /balance - عرض الرصيد /purchase - شراء الرموز /support - الاتصال بالدعم الفني',
    SUPPORT:
      '😊مرحبًا، يرجى الاتصال بـ @miki_b0 على تليجرام لأي مشكلة أو اقتراح قد يكون لديك. شكراً ',
    ACCOUNT_INFO:
      'مرحبًا <b>%%firstName%%!</b>\nنوع الحساب: %%accountType%% \nرابط الإحالة: <code>%%refLink%%</code>\nالرصيد: \n\t المشتراة: %%purchased%% الإحالة: %%referral%%\n\t  %%free%%\n<i>%%referralMsg%%</i>',
    PAID: 'مدفوع',
    FREE: 'مجاني',
    PURCHASE_TOKENS: 'شراء الرموز',
    DONATE: 'التبرع',
    REGENERATE: 'إعادة توليد',
    BACK_TO_ACCOUNT: '« العودة إلى الحساب',
    CHECKOUT:
      'أنت تشتري <b>%%thePlanName%% خطة.</b> \n الرموز: %%tokens%%\n السعر: $%%price%%\nطرق الدفع المقبولة:\n\t- 🅿️ باي بال\n\t- 💳 بطاقة الخصم أو الائتمان\n\n🛈 انقر على الزر <b>«شراء»</b> للمتابعة.\n',
    PURCHASE: 'شراء',
    BACK_TO_PURCHASE: '« العودة إلى خطط الشراء',
    TRANSLATION: 'ترجمة',
  },
  fa: {
    START_MSG:
      'سلام، <b>%%first_name%%</b>!\nمن چپی هستم، همکار ارشد هوش مصنوعی با قدرت چت جی‌پی‌تی. با من صحبت کنید و من به شما پاسخی شبیه به انسان می‌دهم و همچنین می‌توانم تصاویری تولید کنم! —برای اطلاعات بیشتر /help را تایپ کنید. الان امتحان کنید!\n\nبرای به‌روزرسانی‌های چپی به <a href="t.me/chappieupdates">این کانال</a> بپیوندید.',
    NO_ENOUGH_IMAGE_TOKENS:
      'شما برای تولید تصویر از توکن کافی برخوردار نیستید.\nشما می‌توانید با معرفی کسی از طریق لینک معرفی خود <code>%%reflink%%</code> توکن‌های رایگان دریافت کنید\nیا می‌توانید توکن‌ها را خریداری کنید (/purchase).',
    RESPONSE_GEN_ERROR_MESSAGE:
      'خطایی رخ داده است...لطفا پیام خود را مجددا ارسال کنید. اگر مشکل ادامه دارد، با ایمیل mikibo.hamilton@aleeas.com یا با ارسال پیام به @miki_b0 در تلگرام تماس بگیرید.',
    IMAGE_GEN_HELP:
      '📷 تولید تصویر\n\n برای تولید تصویر، /image را تایپ کنید و پس از آن توضیحات دقیق تصویر را وارد کنید\n مثال: /image یک گربه سیامی سفید رنگ',
    PURCHASED: 'خریداری شده',
    FREE: 'رایگان',
    REFERRAL: 'معرفی',
    REFERRAL_MSG:
      'با معرفی کردن شخصی از طریق لینک معرفی خود، توکن‌های رایگان دریافت کنید.',
    PURCHASED_SUCCESSFUL:
      'تبریک🙌 خرید شما برای %%tokens%% توکن با موفقیت انجام شد!',
    PAID_USER_BENEFITS:
      'مزایای شما به عنوان یک کاربر پرداختی:\n- توکن‌های خریداری شده هرگز منقضی نمی‌شوند 🕒\n- پاسخ دهی سریعتر 🚀\n- در دسترس بودن ثابت 🌐\n- اولویت بالاتر در پشتیبانی 🚨',
    BROKE_MSG:
      '<b>شما توکن ندارید.</b>\nتوکن‌های رایگان روزانه شما تا ساعت %%tomorrowMidNight%% تأمین خواهد شد.\nشما می‌توانید با معرفی کسی از طریق لینک معرفی خود <code>%%reflink%%</code> توکن‌های رایگان دریافت کنید\nیا می‌توانید توکن‌ها را خریداری کنید (/purchase).',
    NO_FREE_TOKENS:
      'متأسفانه در حال حاضر توکن رایگانی برای برطرف کردن درخواست شما موجود نیست. لطفا بعداً بررسی کنید یا می‌توانید توکن‌ها را خریداری کنید.',
    HELP: 'سلام! من چپی هستم، همکار ارشد هوش مصنوعی با قدرت چت جی‌پی‌تی. من می‌توانم به سوال‌های شما پاسخی شبیه به انسان بدهم و همچنین تصاویری تولید کنم. حالا امتحان کنید!\n دستورات: /image [توضیحات تصویر شما] - تولید تصویر /reflink - دریافت لینک معرفی شما — شما پاداش توکن دریافت خواهید کرد هنگامی که یک کاربر جدید از طریق این لینک به چپی ملحق شود /account - مشاهده اطلاعات و تنظیمات حساب کاربری شما /balance - مشاهده موجودی /purchase - خرید توکن /support - تماس با پشتیبانی',
    SUPPORT:
      'سلام، لطفا برای هر مشکل یا پیشنهادی که ممکن است داشته باشید با @miki_b0 در تلگرام تماس بگیرید. با تشکر😊',
    ACCOUNT_INFO:
      'سلام <b>%%firstName%%!</b>\n نوع حساب: %%accountType%%\n لینک معرفی: <code>%%refLink%%</code>\n موجودی: \n\t %%purchased%% معرفی: %%referral%%\n\t  %%free%%\n<i>%%referralMsg%%</i>',
    PAID: 'پرداخت شده',
    FREE: 'رایگان',
    PURCHASE_TOKENS: 'خرید توکن',
    DONATE: 'کمک مالی',
    REGENERATE: 'بازسازی',
    BACK_TO_ACCOUNT: '« بازگشت به حساب کاربری',
    CHECKOUT: `شما در حال خرید <b>%%thePlanName%% برنامه هستید.</b> \n توکن‌ها: %%tokens%%\n قیمت: $%%price%%\n روش‌های پرداخت پذیرفته شده:\n\t- 🅿️ پی پال\n\t- 💳 کارت بدهی یا اعتباری\n\n🛈 برای ادامه، دکمه <b>«خریداری»</b> را فشار`,
    PURCHASE: 'خرید',
    BACK_TO_PURCHASE: '« بازگشت به طرح‌های خرید',
    TRANSLATION: 'ترجمه',
  },
  zh: {
START_MSG: '嗨，<b>%%first_name%%</b>！\n我是 chatGPT 提供支持的 AI 助手 chappie。和我聊天，我会以人类般的方式回答你，并且我还可以生成图片！ ——输入 /help 获取更多信息。现在就试试吧！\n\n加入<a href="t.me/chappieupdates">这个频道</a>以获取 chappie 的更新消息。',
NO_ENOUGH_IMAGE_TOKENS:
"你没有足够的代币来生成图片。\n你可以通过使用你的推荐链接<code>%%reflink%%</code>来推荐别人获得免费代币\n或者你可以购买代币（/purchase）。",
RESPONSE_GEN_ERROR_MESSAGE:
'出现了一个错误...请尝试重新发送你的消息。如果问题仍然存在，请发邮件至mikibo.hamilton@aleeas.com或联系Telegram上的@miki_b0。',
IMAGE_GEN_HELP:
'📷 图片生成 \n\n 输入：/image，后跟详细的图片描述 \n 例如：/image 一只白色暹罗猫',
PURCHASED: '已购买',
FREE: '免费',
REFERRAL: '推荐',
REFERRAL_MSG: '通过使用你的推荐链接来获得免费代币。',
PURCHASED_SUCCESSFUL: '恭喜🙌你购买了%%tokens%%个代币！',
PAID_USER_BENEFITS: '作为付费用户，你的优势:\n- 购买的代币永不过期 🕒\n- 更快的响应速度 🚀\n- 恒定的可用性 🌐\n- 更高的支持优先级 🚨',
BROKE_MSG: '<b>你没有代币。</b>\n你的每日免费代币将在%%tomorrowMidNight%%到账。\n你可以通过使用你的推荐链接<code>%%reflink%%</code>来推荐别人获得免费代币\n或者你可以购买代币（/purchase）',
NO_FREE_TOKENS: '对不起，目前没有免费代币可用于服务你的请求。请稍后再来，或者你可以购买代币。',
HELP: '你好！我是 chatGPT 提供支持的 AI 助手 chappie。我可以以人类般的方式回答你的问题，并且可以生成图片。现在就试试吧！ \n 指令信息: /image [你的提示] - 生成图片 /reflink - 获取你的推荐链接 ——当新用户使用该链接启动 chappie 时，你将获得代币奖励 /account - 查看你的账户信息和设置 /balance - 查看你的余额 /purchase - 购买代币 /support - 联系支持',
SUPPORT: '嘿，请联系Telegram上的@miki_b0，如果你有任何问题或建议。谢谢😊',
ACCOUNT_INFO: '嗨<b>%%firstName%%！</b>\n账户类型: %%accountType%% \n推荐链接: <code>%%refLink%%</code>\n余额: \n\t 购买的: %%purchased%% 推荐: %%referral%%\n\t 免费的: %%free%%\n<i>%%referralMsg%%</i>',
PAID: '已付费',
FREE: '免费',
PURCHASE_TOKENS: '购买代币',
DONATE: '捐赠',
REGENERATE: '重新生成',
BACK_TO_ACCOUNT: '« 返回账户',
CHECKOUT: '你正在购买<b>%%thePlanName%%计划。</b> \n代币数: %%tokens%%\n价格: $%%price%%\n接受的支付方式:\n\t- 🅿️ PayPal\n\t- 💳 借记卡或信用卡\n\n🛈 点击 <b>«购买»</b> 按钮继续。',
PURCHASE: '购买',
BACK_TO_PURCHASE: '« 返回购买计划',
TRANSLATION: '翻译',
},
};

const messagesEnum = {
  START_MSG: 'START_MSG',
  NO_ENOUGH_IMAGE_TOKENS: 'NO_ENOUGH_IMAGE_TOKENS',
  RESPONSE_GEN_ERROR_MESSAGE: 'RESPONSE_GEN_ERROR_MESSAGE',
  IMAGE_GEN_HELP: 'IMAGE_GEN_HELP',
  PURCHASED: 'PURCHASED',
  FREE: 'FREE',
  REFERRAL: 'REFERRAL',
  REFERRAL_MSG: 'REFERRAL_MSG',
  PURCHASED_SUCCESSFUL: 'PURCHASED_SUCCESSFUL',
  PAID_USER_BENEFITS: 'PAID_USER_BENEFITS',
  BROKE_MSG: 'BROKE_MSG',
  NO_FREE_TOKENS: 'NO_FREE_TOKENS',
  HELP: 'HELP',
  SUPPORT: 'SUPPORT',
  ACCOUNT_INFO: 'ACCOUNT_INFO',
  PAID: 'PAID',
  FREE: 'FREE',
  PURCHASE_TOKENS: 'PURCHASE_TOKENS',
  DONATE: 'DONATE',
  REGENERATE: 'REGENERATE',
  BACK_TO_ACCOUNT: 'BACK_TO_ACCOUNT',
  CHECKOUT: 'CHECKOUT',
  PURCHASE: 'PURCHASE',
  BACK_TO_PURCHASE: 'BACK_TO_PURCHASE',
  TRANSLATION: 'TRANSLATION',
};

function message(theMessage, langCode, translate, replacers = {}) {
  // TODO please refactor this code. make it elegant. please!
  langCode = !!langCode && translate ? langCode : 'en';
  theMessage = !messages[langCode] ? messages['en'][theMessage] : messages[langCode][theMessage];
  Object.entries(replacers).forEach(([replacer, value]) => {
    theMessage = theMessage.replaceAll(`%%${replacer}%%`, value);
  });
  return theMessage;
}

module.exports = { messagesEnum, message };
