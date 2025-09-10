import { ShopStage } from '../domain/stages';

export const APP_CONFIG = {
  hourRateByStage: {
    [ShopStage.CUT_CNC]: 800,
    [ShopStage.EDGE]: 700,
    [ShopStage.DRILL]: 600,
    [ShopStage.SANDING]: 500,
    [ShopStage.PAINT]: 900,
    [ShopStage.QA_PACK]: 400,
  },
  wipLimits: {
    [ShopStage.CUT_CNC]: 5,
    [ShopStage.EDGE]: 6,
    [ShopStage.DRILL]: 4,
    [ShopStage.SANDING]: 5,
    [ShopStage.PAINT]: 3,
    [ShopStage.QA_PACK]: 8,
  },
  capacityPerPeriodHours: 160, // per month per shop
  defaultCommissionPct: 0.05,
  defaultAcquiringPct: 0.03,
  defaultVatPct: 0.2,
};

export default APP_CONFIG;
