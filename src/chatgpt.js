import OpenAI from 'openai'
import config from 'config'



const CHATGPT_MODEL = 'gpt-3.5-turbo'

const ROLES = {
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    USER: 'user',
}

const openai = new OpenAI({
    apiKey: config.get('OPENAI_KEY'), // defaults to process.env["OPENAI_API_KEY"]
})


const getMessage = (m) => `
Задача: На основе этих тезисов  создай ТЗ для съемки вовлекающего и эмоционального сторитейлинга :$ {m}

Твоя цель составить ТЗ  :  которое должно прогревать человека по стадиям осознанности клиента - Начни с нативной подводки к этой теме и раскрой ее в течении всего дня сторитейлинга. Используй/сгенерь триггеры человека, симптомы, примеры из жизни (блогера, клиентов, сюжеты фильмов, книг). В конце дня сторитейлинг должен мотивировать аудиторию пройти бесплатный разбор Дарьи "Причины неудач".

Контекст: Дарья - психолог-онлайн, прошедшая путь от дизайнера-архитектора до успешного психолога. Её жизненный опыт, переезды, неудачные отношения стали основой для её методов саморазвития. Она верит в потенциал каждого человека.

Структура вовлечения аудитории:

Вовлекающая первая сторис.
Экспертная крошка.
Подводка к теме дня и введение в контекст жизни.
Рассказ о частном случае, связанном с продуктом.
Разбор проблемы и помощь клиенту.
Лайф-разбивка.
Внутрянка продукта/услуги и маршрутизация на запись бесплатного разбора.
Маркетинговые задачи:

Увеличение вовлечения аудитории.
Удержание внимания существующей аудитории.
Представление продукта-методики.
Мотивация к действию: запись на консультацию или курс.
Сбор обратной связи для оптимизации контента.

`

export async function chatGPT(message = '') {
    const messages = [
        {
         role: ROLES.SYSTEM, 
         content: 'Ты опытный копирайтер, специализирующийся на создании прогревор в сторитейлинге для психолога и наставника по саморазвитию в социальных сетях.'
        },

        { role: ROLES.USER, content: getMessage (message) },
    ]
    try { 
        const completion = await openai.chat.completions.create({
            messages,
            model: CHATGPT_MODEL,
        })
    
        return completion.choices[0].message
    } catch (e) {
        console. error( 'Error while chat completion', e.message)
    }
}
  
  