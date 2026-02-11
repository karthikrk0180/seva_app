import { apiService } from './api.service';
import { Event, EventCreateRequest, EventUpdateRequest, EventListResponse } from 'src/models/event.model';

class EventService {
    private endpoint = '/v1/events';

    public async getEvents(): Promise<Event[]> {
        const response = await apiService.get<EventListResponse | Event[]>(this.endpoint);
        if (Array.isArray(response)) {
            return response;
        }
        return response.events || [];
    }

    public async getEventById(id: string): Promise<Event> {
        return apiService.get<Event>(`${this.endpoint}/${id}`);
    }

    public async addEvent(event: EventCreateRequest): Promise<Event> {
        return apiService.post<Event>(this.endpoint, event);
    }

    public async updateEvent(id: string, event: EventUpdateRequest): Promise<Event> {
        return apiService.put<Event>(`${this.endpoint}/${id}`, event);
    }

    public async deleteEvent(id: string): Promise<void> {
        return apiService.delete<void>(`${this.endpoint}/${id}`);
    }
}

export const eventService = new EventService();
