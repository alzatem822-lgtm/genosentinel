// clinical-service/src/models/tumor-type.model.ts
export interface TumorType {
  id: number;
  name: string;
  systemAffected: string;
}

export interface CreateTumorTypeData {
  name: string;
  systemAffected: string;
}