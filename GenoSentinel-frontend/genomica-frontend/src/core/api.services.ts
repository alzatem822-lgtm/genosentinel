import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
providedIn: 'root'
})
export class ApiService {

constructor(private http: HttpClient) { }

// Método genérico para peticiones GET
get<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
}

// Método genérico para peticiones POST
post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
}

// Método genérico para peticiones PUT
put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
}

// Método genérico para peticiones DELETE
delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
}
}