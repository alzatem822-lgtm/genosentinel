import { Injectable } from '@angular/core';
import { ApiService } from './api.services';
import { environment } from '../enviroment';
import { Observable, of } from 'rxjs';

// Definición de interfaces (simplificadas)
export interface Patient {
id: number;
firstName: string;
lastName: string;
birthDate: string;
gender: 'M' | 'F' | 'O';
// Propiedades de integración
hasGenomicData?: boolean;
genomicReportsCount?: number;
}

@Injectable({
providedIn: 'root'
})
export class ClinicaService {
private clinicalUrl = environment.clinicalUrl;

constructor(private api: ApiService) { }

// --- Pacientes ---
// Este endpoint se implementará en el Microservicio de Clínica
getPatients(): Observable<Patient[]> {
    // Simulación de datos hasta que el microservicio de Clínica esté listo
    console.warn('ClinicaService: Usando datos simulados para getPatients().');
    return of([
    { id: 1, firstName: 'Juan', lastName: 'Pérez', birthDate: '1980-01-01', gender: 'M', hasGenomicData: true, genomicReportsCount: 2 },
    { id: 2, firstName: 'Ana', lastName: 'García', birthDate: '1995-05-15', gender: 'F', hasGenomicData: false, genomicReportsCount: 0 },
    ]);
    // return this.api.get<Patient[]>(`${this.clinicalUrl}/patients/with-genomic-indicator`);
}

// Este endpoint se implementará en el Microservicio de Clínica
getPatientDetails(id: number): Observable<Patient> {
    // Simulación de datos hasta que el microservicio de Clínica esté listo
    console.warn('ClinicaService: Usando datos simulados para getPatientDetails().');
    return of({ id: 1, firstName: 'Juan', lastName: 'Pérez', birthDate: '1980-01-01', gender: 'M', hasGenomicData: true, genomicReportsCount: 2 });
    // return this.api.get<Patient>(`${this.clinicalUrl}/patients/${id}/genomic-reports`);
}

// --- Integración ---
checkGenomicaHealth(): Observable<any> {
    // Este endpoint se implementará en el Microservicio de Clínica
    // return this.api.get<any>(`${this.clinicalUrl}/integration/health/genomica`);
    return of({ success: true, status: 'up', service: 'genomica' });
}
}