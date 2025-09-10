import { ShopStage } from '../domain/stages';
import { APP_CONFIG } from '../config/app';

export interface EconInput {
  materialsCost: number;
  laborByStage: Partial<Record<ShopStage, number>>; // hours
  hourRateByStage: Partial<Record<ShopStage, number>>;
  installCost?: number;
  variableOther?: number;
  fixedMonthly: number;
  plannedMonthlyHours: number;
  targetProfitPct: number;
  commissionPct?: number;
  acquiringPct?: number;
  vatPct?: number;
  minFixedShare?: number;
  profitMinPct?: number;
}

export function calcVC(input: EconInput) {
  const laborCost = Object.entries(input.laborByStage || {}).reduce((sum, [stage, hours]) => {
    const rate = input.hourRateByStage?.[stage as ShopStage] ?? APP_CONFIG.hourRateByStage[stage as ShopStage] ?? 0;
    return sum + (hours || 0) * rate;
  }, 0);
  const install = input.installCost || 0;
  const variable = input.variableOther || 0;
  return input.materialsCost + laborCost + install + variable;
}

export function calcOverheadRate(input: EconInput) {
  if (!input.plannedMonthlyHours || input.plannedMonthlyHours <= 0) return 0;
  return input.fixedMonthly / input.plannedMonthlyHours;
}

export function calcFullCost(input: EconInput) {
  const vc = calcVC(input);
  const overheadRate = calcOverheadRate(input);
  const totalHours = Object.values(input.laborByStage || {}).reduce((s, v) => s + (v || 0), 0);
  return vc + overheadRate * totalHours;
}

export function grossUpCommissions(price: number, commissionPct = 0, acquiringPct = 0) {
  const denom = 1 - (commissionPct || 0) - (acquiringPct || 0);
  return denom > 0 ? price / denom : price;
}

export function addVAT(price: number, vatPct = 0) {
  return price * (1 + (vatPct || 0));
}

export function calcPlannedPrice(input: EconInput) {
  const full = calcFullCost(input);
  return full * (1 + (input.targetProfitPct || 0));
}

export function calcFloorPrice(input: EconInput) {
  const vc = calcVC(input);
  const minFixedShare = input.minFixedShare || 0;
  const profitMin = input.profitMinPct || 0;
  const commission = input.commissionPct || 0;
  const acquiring = input.acquiringPct || 0;
  const denom = 1 - profitMin - commission - acquiring;
  if (denom <= 0) return Number.POSITIVE_INFINITY;
  return (vc + minFixedShare) / denom;
}

export default {
  calcVC,
  calcOverheadRate,
  calcFullCost,
  calcPlannedPrice,
  calcFloorPrice,
  grossUpCommissions,
  addVAT,
};
