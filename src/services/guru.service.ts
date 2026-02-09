import { apiService } from './api.service';
import { Guru, GuruCreateRequest, GuruUpdateRequest, GuruListResponse } from 'src/models/guru.model';

class GuruService {
  private endpoint = '/v1/gurus';

  public async getGurus(): Promise<Guru[]> {
    const response = await apiService.get<GuruListResponse | Guru[]>(this.endpoint);
    if (Array.isArray(response)) {
        return response;
    }
    return response.gurus || [];
  }

  public async getGuruById(id: string): Promise<Guru> {
    return apiService.get<Guru>(`${this.endpoint}/${id}`);
  }

  public async addGuru(guru: GuruCreateRequest): Promise<Guru> {
    return apiService.post<Guru>(this.endpoint, guru);
  }

  public async updateGuru(id: string, guru: GuruUpdateRequest): Promise<Guru> {
    return apiService.put<Guru>(`${this.endpoint}/${id}`, guru);
  }
}

export const guruService = new GuruService();
