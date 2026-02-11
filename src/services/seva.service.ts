import { apiService } from './api.service';
import { Seva } from 'src/models/seva.model';

export interface SevaCreateRequest {
    titleEn: string;
    titleKn: string;
    descEn: string;
    descKn: string;
    amount: number;
    currency: string;
    isActive: boolean;
    reqGothra: boolean;
    reqNakshatra: boolean;
    availableDays: number;
    location: string;
}

export interface SevaUpdateRequest {
    titleEn?: string;
    titleKn?: string;
    descEn?: string;
    descKn?: string;
    amount?: number;
    currency?: string;
    isActive?: boolean;
    reqGothra?: boolean;
    reqNakshatra?: boolean;
    availableDays?: number;
    location?: string;
}

export interface SevaListResponse {
    sevas: Seva[];
}

class SevaService {
    private endpoint = '/v1/sevas';

    public async getSevas(): Promise<Seva[]> {
        const response = await apiService.get<SevaListResponse | Seva[]>(this.endpoint);
        if (Array.isArray(response)) {
            return response;
        }
        return response.sevas || [];
    }

    public async getAllSevas(): Promise<Seva[]> {
        const response = await apiService.get<SevaListResponse | Seva[]>(this.endpoint + '/all');
        if (Array.isArray(response)) {
            return response;
        }
        return response.sevas || [];
    }

    public async getSevaById(id: string): Promise<Seva> {
        return apiService.get<Seva>(`${this.endpoint}/${id}`);
    }

    public async addSeva(seva: SevaCreateRequest): Promise<Seva> {
        return apiService.post<Seva>(this.endpoint, seva);
    }

    public async updateSeva(id: string, seva: SevaUpdateRequest): Promise<Seva> {
        return apiService.put<Seva>(`${this.endpoint}/${id}`, seva);
    }

    public async deleteSeva(id: string): Promise<void> {
        return apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}

export const sevaService = new SevaService();
