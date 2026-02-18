import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Seva, SevaBooking } from 'src/models/seva.model';
import { logger } from 'src/services/logger.service';

import { Guru, GuruCreateRequest, GuruUpdateRequest } from 'src/models/guru.model';
import { guruService } from 'src/services/guru.service';
import { sevaService } from 'src/services/seva.service';
import { eventService } from 'src/services/event.service';
import { Event, EventCreateRequest, EventUpdateRequest } from 'src/models/event.model';

interface AdminContextType {
    sevas: Seva[];
    bookings: SevaBooking[];
    isLoading: boolean;
    addSeva: (seva: Omit<Seva, 'id'>) => Promise<void>;
    updateSeva: (id: string, updates: Partial<Seva>) => Promise<void>;
    deleteSeva: (id: string) => Promise<void>;
    toggleSevaStatus: (id: string) => Promise<void>;

    gurus: Guru[];
    addGuru: (guru: GuruCreateRequest) => Promise<void>;
    updateGuru: (id: string, updates: GuruUpdateRequest) => Promise<void>;
    refreshData: () => Promise<void>;
    events: Event[];
    addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
    updateEvent: (id: string, updates: Partial<Event>) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    toggleEventStatus: (id: string) => Promise<void>;
}


const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [sevas, setSevas] = useState<Seva[]>([]);
    const [bookings] = useState<SevaBooking[]>([]);
    const [gurus, setGurus] = useState<Guru[]>([]);
    const [events, setEvents] = useState<Event[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            logger.info('Refreshing Admin Data');
            console.log('guruService:', guruService);
            console.log('sevaService:', sevaService);

            if (!guruService) {
                logger.error('guruService is undefined in refreshData');
                return;
            }

            const [gurusData, sevasData, eventsData] = await Promise.all([
                guruService.getGurus(),
                sevaService.getAllSevas(),
                eventService.getEvents(),
            ]);
            setGurus(gurusData);
            setSevas(sevasData);
            setEvents(eventsData);
            logger.info('Refreshed Data', { gurus: gurusData.length, sevas: sevasData.length, events: eventsData.length });
        } catch (error) {
            logger.error('Failed to refresh admin data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addSeva = async (newSeva: any) => {
        setIsLoading(true);
        try {
            const addedSeva = await sevaService.addSeva(newSeva);
            setSevas(prev => [...prev, addedSeva]);
            logger.info('Added new Seva', { id: addedSeva.id });
        } catch (error) {
            logger.error('Failed to add seva', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateSeva = async (id: string, updates: Partial<Seva>) => {
        // Find existing Seva to merge updates
        const existingSeva = sevas.find(s => s.id === id);
        if (!existingSeva) {
            logger.warn('Attempted to update non-existent Seva', { id });
            return;
        }

        const mergedSeva = { ...existingSeva, ...updates };

        // Optimistic update
        const originalSevas = [...sevas];
        setSevas(prev => prev.map(s => s.id === id ? mergedSeva : s));

        try {
            // Send FULL object to backend
            await sevaService.updateSeva(id, mergedSeva as any);
            logger.info('Updated Seva', { id });
        } catch (error) {
            logger.error('Failed to update seva', error);
            setSevas(originalSevas); // Revert on failure
            throw error;
        }
    };

    const deleteSeva = async (id: string) => {
        setIsLoading(true);
        try {
            await sevaService.deleteSeva(id);
            setSevas(prev => prev.filter(s => s.id !== id));
            logger.info('Deleted Seva', { id });
        } catch (error) {
            logger.error('Failed to delete seva', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const toggleSevaStatus = async (id: string) => {
        const seva = sevas.find(s => s.id === id);
        if (seva) {
            await updateSeva(id, { isActive: !seva.isActive });
        }
    };

    const addGuru = async (guru: GuruCreateRequest) => {
        setIsLoading(true);
        try {
            const newGuru = await guruService.addGuru(guru);
            setGurus(prev => [...prev, newGuru]);
            logger.info('Added new Guru', { newGuru });
        } catch (error) {
            logger.error('Failed to add guru', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateGuru = async (id: string, updates: GuruUpdateRequest) => {
        setIsLoading(true);
        try {
            const updatedGuru = await guruService.updateGuru(id, updates);
            setGurus(prev => prev.map(g => g.id === id ? updatedGuru : g));
            logger.info('Updated Guru', { updatedGuru });
        } catch (error) {
            logger.error('Failed to update guru', error);
            throw error;
        } finally {
            // setIsLoading(false);
            console.log("Updated");
        }
    };

    const addEvent = async (event: EventCreateRequest) => {
        setIsLoading(true);
        try {
            const newEvent = await eventService.addEvent(event);
            setEvents(prev => [...prev, newEvent]);
            logger.info('Added new Event', { newEvent });
        } catch (error) {
            logger.error('Failed to add event', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const updateEvent = async (id: string, updates: EventUpdateRequest) => {
        setIsLoading(true);
        try {
            const updatedEvent = await eventService.updateEvent(id, updates);
            setEvents(prev => prev.map(e => e.id === id ? updatedEvent : e));
            logger.info('Updated Event', { updatedEvent });
        } catch (error) {
            logger.error('Failed to update event', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteEvent = async (id: string) => {
        setIsLoading(true);
        try {
            await eventService.deleteEvent(id);
            setEvents(prev => prev.filter(e => e.id !== id));
            logger.info('Deleted Event', { id });
        } catch (error) {
            logger.error('Failed to delete event', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const toggleEventStatus = async (id: string) => {
        const event = events.find(e => e.id === id);
        if (event) {
            await updateEvent(id, { isMajor: !event.isMajor });
        }
    };

    useEffect(() => {
        refreshData();
    }, []);

    return (
        <AdminContext.Provider value={{
            sevas,
            bookings,
            isLoading,
            addSeva,
            updateSeva,
            deleteSeva,
            toggleSevaStatus,
            gurus,
            addGuru,
            updateGuru,
            refreshData,
            events,
            addEvent,
            updateEvent,
            deleteEvent,
            toggleEventStatus
        }}>
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
