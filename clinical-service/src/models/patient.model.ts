// clinical-service/src/models/patient.model.ts
export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  status: string; 
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientData {
  firstName: string;
  lastName: string;
  birthDate: Date;
  gender: string;
  status?: string;
}

export interface UpdatePatientData {
  firstName?: string;
  lastName?: string;
  birthDate?: Date;
  gender?: string;
  status?: string;

}