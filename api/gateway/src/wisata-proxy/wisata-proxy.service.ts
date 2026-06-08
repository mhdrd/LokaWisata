import { Injectable, HttpException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class WisataProxyService {
  private readonly baseUrl = process.env.WISATA_SERVICE_URL;
  private readonly apiKey = process.env.API_KEY;

  constructor(private httpService: HttpService) {}

  private getHeaders() {
    return { 'x-api-key': this.apiKey };
  }

  async get(path: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(`${this.baseUrl}${path}`, {
          headers: this.getHeaders(),
        }),
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service wisata tidak tersedia',
        error.response?.status || 500,
      );
    }
  }

  async post(path: string, body: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(`${this.baseUrl}${path}`, body, {
          headers: this.getHeaders(),
        }),
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service wisata tidak tersedia',
        error.response?.status || 500,
      );
    }
  }

  async patch(path: string, body: any) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.patch(`${this.baseUrl}${path}`, body, {
          headers: this.getHeaders(),
        }),
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service wisata tidak tersedia',
        error.response?.status || 500,
      );
    }
  }

  async delete(path: string) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.delete(`${this.baseUrl}${path}`, {
          headers: this.getHeaders(),
        }),
      );
      return data;
    } catch (error) {
      throw new HttpException(
        error.response?.data || 'Service wisata tidak tersedia',
        error.response?.status || 500,
      );
    }
  }
}
