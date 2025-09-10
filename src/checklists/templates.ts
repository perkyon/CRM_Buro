import { ShopStage } from '../domain/stages';

export const CHECKLIST_BY_STAGE: Record<ShopStage, string[]> = {
  [ShopStage.PURCHASE]: ['Счет оплачен', 'Материал в наличии/резерв', 'ETA занесена'],
  [ShopStage.CUT_CNC]: ['Проверен раскрой', 'Пилы/фрезы ок', 'Контроль размеров'],
  [ShopStage.EDGE]: ['Толщина/цвет кромки', 'Снятие фаски', 'Шов без дефектов'],
  [ShopStage.DRILL]: ['Сверловка по карте', 'Крепеж соответствует', 'Контроль чистоты'],
  [ShopStage.SANDING]: ['Зерно по карте', 'Притупление кромок', 'Обезпыление'],
  [ShopStage.PAINT]: ['Грунт/слои по ТП', 'Режим камеры соблюден', 'Цвет совпадает с выкрасом'],
  [ShopStage.QA_PACK]: ['Комплектность по packing list', 'Защита углов/кромок', 'Фото комплектации'],
};

export default CHECKLIST_BY_STAGE;
