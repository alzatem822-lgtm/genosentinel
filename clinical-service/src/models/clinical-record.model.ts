// clinical-service/src/models/clinical-record.model.ts
export interface ClinicalRecord {
  id: string;
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: Date;
  stage: string;
  treatmentProtocol?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClinicalRecordData {
  patientId: string;
  tumorTypeId: number;
  diagnosisDate: Date;
  stage: string;
  treatmentProtocol?: string;
}

export interface ClinicalRecordWithRelations extends ClinicalRecord {
  patient?: {
    firstName: string;
    lastName: string;
  };
  tumorType?: {
    name: string;
    systemAffected: string;
  };
}