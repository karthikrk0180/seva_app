export interface Event {
    id: string;
    titleEn: string;
    titleKn?: string;
    eventDate: string; // ISO string from backend (LocalDate)
    tithiEn?: string;
    tithiKn?: string;
    location?: string;
    isMajor?: boolean;
}

export type EventCreateRequest = Omit<Event, 'id'>;
export type EventUpdateRequest = Partial<Event>;

export interface EventListResponse {
    events: Event[];
    total: number;
}
