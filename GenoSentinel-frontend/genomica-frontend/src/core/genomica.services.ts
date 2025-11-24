import { Injectable } from '@angular/core';
import { ApiService } from './api.services';
import { environment } from '../enviroment';
import { Observable } from 'rxjs';

// Definición de interfaces (simplificadas)
export interface Gene {
id: number;
symbol: string;
fullName: string;
functionSummary: string;
}

export interface Variant {
id: number;
uuid: string;
geneId: number;
chromosome: string;
position: string;
referenceBase: string;
alternateBase: string;
impact: string;
}

export interface PatientVariantReport {
id: number;
uuid: string;
patientId: number;
variantId: number;
detectionDate: string;
alleleFrequency: number;
// Propiedades enriquecidas (opcionales)
geneSymbol?: string;
chromosome?: string;
impact?: string;
}

@Injectable({
providedIn: 'root'
})
export class GenomicaService {
private apiUrl = environment.apiUrl;

constructor(private api: ApiService) { }

// --- Genes ---
getGenes(): Observable<Gene[]> {
    return this.api.get<Gene[]>(`${this.apiUrl}/genes`);
}

getGene(id: number): Observable<Gene> {
    return this.api.get<Gene>(`${this.apiUrl}/genes/${id}`);
}

createGene(gene: Omit<Gene, 'id'>): Observable<Gene> {
    return this.api.post<Gene>(`${this.apiUrl}/genes`, gene);
}

updateGene(id: number, gene: Partial<Gene>): Observable<Gene> {
    return this.api.put<Gene>(`${this.apiUrl}/genes/${id}`, gene);
}

deleteGene(id: number): Observable<any> {
    return this.api.delete<any>(`${this.apiUrl}/genes/${id}`);
}

// --- Variantes ---
getVariants(): Observable<Variant[]> {
    return this.api.get<Variant[]>(`${this.apiUrl}/variants`);
}

getVariant(id: number): Observable<Variant> {
    return this.api.get<Variant>(`${this.apiUrl}/variants/${id}`);
}

createVariant(variant: Omit<Variant, 'id' | 'uuid'>): Observable<Variant> {
    return this.api.post<Variant>(`${this.apiUrl}/variants`, variant);
}

// --- Reportes ---
getReports(): Observable<PatientVariantReport[]> {
    return this.api.get<PatientVariantReport[]>(`${this.apiUrl}/patient-variant-reports`);
}

getReportsByPatient(patientId: number): Observable<PatientVariantReport[]> {
    return this.api.get<PatientVariantReport[]>(`${this.apiUrl}/patient-variant-reports/patient/${patientId}`);
}

createReport(report: Omit<PatientVariantReport, 'id' | 'uuid'>): Observable<PatientVariantReport> {
    // Usamos el endpoint de integración para validar el paciente
    return this.api.post<PatientVariantReport>(`${this.apiUrl}/integration/reports`, report);
}
}