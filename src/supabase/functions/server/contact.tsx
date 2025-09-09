import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Метод не разрешён' });
  }

  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }

  // Здесь можно добавить сохранение в базу данных или отправку на email
  // Например, через nodemailer или Supabase

  // Пример: просто логируем сообщение
  console.log('Новое обращение:', { name, email, phone, message });

  // Возвращаем успешный ответ
  return res.status(200).json({ success: true });
}
