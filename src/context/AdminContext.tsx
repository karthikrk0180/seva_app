import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Seva, SevaBooking } from 'src/models/seva.model';
import { logger } from 'src/services/logger.service';
import { SEVA_DATA } from 'src/screens/seva/seva.data';
import { Guru, GuruCreateRequest, GuruUpdateRequest } from 'src/models/guru.model';
import { guruService } from 'src/services/guru.service';

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
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [sevas, setSevas] = useState<Seva[]>(SEVA_DATA);
    const [bookings] = useState<SevaBooking[]>([]);
    const [gurus, setGurus] = useState<Guru[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            logger.info('Refreshing Admin Data');
            const gurusData = await guruService.getGurus();
            setGurus(gurusData);
            logger.info('Refreshed Gurus', { count: gurusData.length });
        } catch (error) {
            logger.error('Failed to refresh admin data', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addSeva = async (newSeva: Omit<Seva, 'id'>) => {
        logger.info('Adding new Seva', { newSeva });
        const sevaWithId: Seva = {
            ...newSeva,
            id: `custom_${Date.now()}`,
        };
        setSevas(prev => [...prev, sevaWithId]);
    };

    const updateSeva = async (id: string, updates: Partial<Seva>) => {
        logger.info('Updating Seva', { id, updates });
        setSevas(prev => prev.map(s => s.id === id ? { ...s, ...updates } as Seva : s));
    };

    const deleteSeva = async (id: string) => {
        logger.info('Deleting Seva', { id });
        setSevas(prev => prev.filter(s => s.id !== id));
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
            setIsLoading(false);
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
            refreshData
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
