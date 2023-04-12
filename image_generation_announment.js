const translations = {
  en: `🎉 <b>[NEW FEATURE]</b> You can now generate images! 📷\n
Type: <i>/image followed by a detailed image description</i>
Example:<code>/image a white siamese cat</code>
`,
  es: `
  🎉<b>[NUEVA CARACTERÍSTICA]</b> ¡Ahora puedes generar imágenes! 📷\n
Escriba: <i>/image seguido de una descripción detallada de la imagen</i>
Ejemplo:<code>/image un gato siamés blanco</code>`,
  ru: `
  🎉 <b>[НОВАЯ ФУНКЦИЯ]</b> Теперь вы можете создавать изображения! 📷\n
Введите: <i>/image с подробным описанием изображения.</i>
Пример:<code>/image белая сиамская кошка</code>`,
  ar: `
  🎉 <b>[ميزة جديدة]</b> يمكنك الآن إنشاء صور! 📷\n
اكتب: <i>/image متبوعًا بوصف تفصيلي للصورة</i>
مثال:<code>/image قطة سيامي بيضاء</code>`,
  fr: `
  🎉<b>[NOUVELLE FONCTIONNALITÉ]</b> Vous pouvez désormais générer des images ! 📷\n
Tapez : <i>/image suivi d'une description détaillée de l'image</i>
Exemple :<code>/image un chat siamois blanc</code>`,
  fa: `
  🎉<b>[ویژگی جدید]</b> اکنون می توانید تصاویر را تولید کنید! 📷\n
تایپ کنید: <i>/image و به دنبال آن توضیحات دقیق تصویر</i>
مثال:<code>/image یک گربه سفید سیامی</code>`,
  zh: `
🎉<b>[新功能] </b> 您现在可以生成图像了！ 📷\n
键入：<i>/image 后跟详细的图像描述</i>
示例：<code>/image 一只白色的暹罗猫</code>`,
};

const options = {
  parse_mode: 'HTML',
  reply_markup: {
    inline_keyboard: [
      [
        {
          text: 'English',
          callback_data: 'translate_image_generation_en',
        },
        {
          text: 'Español',
          callback_data: 'translate_image_generation_es',
        },
        {
          text: 'Русский',
          callback_data: 'translate_image_generation_ru',
        },
        {
          text: 'عربي',
          callback_data: 'translate_image_generation_ar',
        },
      ],
      [
        {
          text: 'Français',
          callback_data: 'translate_image_generation_fr',
        },
        {
          text: 'فارسی',
          callback_data: 'translate_image_generation_fa',
        },
        {
          text: '中国人',
          callback_data: 'translate_image_generation_zh',
        },
      ],
    ],
  },
};

module.exports = {
  translations,
  options
}