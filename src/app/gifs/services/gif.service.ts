import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../interfaces/gifs.interface';

@Injectable({
  providedIn: 'root',
}) //Al especificar el providedIn avisa a angular que no lo instancie d enuevo y se genera en el bundle
export class GifService {
  private apiKey: string = 'IWWZ4WHfVpkFPqX53eTbSuV4r5NCNAzp';
  private _historial: string[] = [];
  public resultados: Gif[] = [];
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs';

  get historial() {
    return [...this._historial];
  }

  constructor(private http: HttpClient) {
    // localStorage.getItem('historial')
    this._historial = JSON.parse(localStorage.getItem('historial')!) || [];
    this.resultados = JSON.parse(localStorage.getItem('resultados')!) || [];

    // if (localStorage.getItem('historial')) {
    //   this._historial = JSON.parse(localStorage.getItem('historial')!);
    // }
  }

  buscarGifs(query: string = '') {
    query = query.trim().toLocaleLowerCase();

    if (query.trim().length === 0) return;

    if (!this._historial.includes(query)) {
      this._historial.unshift(query);
      this._historial = this._historial.splice(0, 10);

      localStorage.setItem('historial', JSON.stringify(this._historial));
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', query);

    this.http //retorna observables
      .get<SearchGifsResponse>(`${this.servicioUrl}/search`, { params })
      .subscribe((response) => {
        this.resultados = response.data;
        localStorage.setItem('resultados', JSON.stringify(this.resultados));
      });
  }
}
