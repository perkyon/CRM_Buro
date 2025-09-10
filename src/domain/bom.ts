export interface BOMItem {
  id: string;
  projectId: string;
  type: 'MATERIAL' | 'EDGE' | 'COATING' | 'FITTING' | 'PACKING';
  sku?: string;
  name: string;
  spec?: string;
  qtyRequired: number;
  unit: 'm' | 'm2' | 'pcs' | 'kg' | 'l';
  unitCost?: number;
  supplier?: string;
}

export default BOMItem;
