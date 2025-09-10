import type { Role } from '../domain/roles';

export const hasRole = (roles: Role[] = [], need: Role | Role[]) => {
  const set = Array.isArray(need) ? need : [need];
  return set.some(r => roles.includes(r));
};

// helper: operator sees only their column
export const operatorColumnAllowed = (role: Role, stage: string) => {
  // map operator roles to single ShopStage name
  const map: Record<string, string> = {
    OPERATOR_CUT: 'CUT_CNC',
    OPERATOR_EDGE: 'EDGE',
    OPERATOR_DRILL: 'DRILL',
    OPERATOR_SAND: 'SANDING',
    OPERATOR_PAINT: 'PAINT',
    OPERATOR_PACK: 'QA_PACK',
  };
  return map[role] === stage;
};

export default hasRole;
