import { ShopStage } from '../domain/stages';

export const STAGE_RU: Record<ShopStage, string> = {
  [ShopStage.PURCHASE]: 'Закупка',
  [ShopStage.CUT_CNC]: 'Раскрой/ЧПУ',
  [ShopStage.EDGE]: 'Кромка',
  [ShopStage.DRILL]: 'Присадка',
  [ShopStage.SANDING]: 'Шлифовка',
  [ShopStage.PAINT]: 'Покраска',
  [ShopStage.QA_PACK]: 'Приёмка/Упаковка',
};

export const UI_RU = {
  production: 'Производство',
  projectId: 'ID проекта',
  workName: 'Название партии',
  stage: 'Этап',
  createWorkOrder: 'Создать партию',
  workList: 'Список партий',
  queued: 'В очереди',
  inProgress: 'В работе',
  done: 'Готово',
  start: 'Старт',
  stop: 'Стоп',
  stageDone: 'Готово этап',
  wipTitle: 'WIP / Загрузка цеха',
  active: 'Активно',
  load: 'Загрузка',
};

// Простая минимальная локаль на русском для интерфейса
export const translations = {
  stages: {
    CUT_CNC: 'Резка (CNC)',
    EDGE: 'Кромление',
    DRILL: 'Сверловка',
    SANDING: 'Шлифовка',
    PAINT: 'Покраска',
    QA_PACK: 'Контроль и упаковка',
  },
  buttons: {
    createWorkOrder: 'Создать партию',
  },
  texts: {
    noWorkOrders: 'Партии не найдены',
  },
};

// Простой t() для быстрого доступа: ключ в виде 'stages.CUT_CNC'
export function t(key: string, fallback?: string) {
  const parts = key.split('.');
  // @ts-ignore - простая рекурсивная навигация по объекту
  let cur: any = translations;
  for (const p of parts) {
    if (!cur) return fallback ?? key;
    cur = cur[p];
  }
  return cur ?? fallback ?? key;
}

export default undefined as any; // избегаем двойного default; не используйте default импорт для этого модуля
