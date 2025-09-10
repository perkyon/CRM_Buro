
# CRM_Buro

Локальная разработка и быстрая проверка проекта.

Запуск:

```bash
npm install
npm run dev
```
Environment and Contact form
----------------------------

To persist contact form submissions into Supabase you must provide the service role key
as an environment variable. Locally the server uses a KV fallback when the key is not set.

Set the following env var for the server runtime (Deno/Hono):

SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

When the key is present the contact endpoint will insert a `threads` row and a `messages`
row into your Supabase Postgres database. Without the key the server stores contacts in the
local KV store used by the demo server.

Testing the contact form locally:

1. Start the dev server: `npm run dev`
2. Open the app in the browser and go to the Contact section.
3. Submit the form. If SUPABASE_SERVICE_ROLE_KEY is present the data will be written to
	your Supabase DB, otherwise it will be stored in the demo KV store used by the server.


Сборка для продакшна:

```bash
npm run build
# CRM_Buro

Локальная разработка и проверка проекта CRM_Buro (адаптированная версия дизайна Review Furniture Workshop Site).

Запуск в разработке:

```bash
npm install
npm run dev
```

Сборка для продакшна и просмотр:

```bash
npm run build
npm run preview
```

Как запушить в GitHub (пример):

```bash
git remote add origin https://github.com/<ваш-логин>/CRM_Buro.git
git push -u origin main
```

Исходный проект (кредит): Review Furniture Workshop Site. Оригинальная работа доступна в Figma: https://www.figma.com/design/ap5AylCDu5zx5RQoSnJi2s/Review-Furniture-Workshop-Site
