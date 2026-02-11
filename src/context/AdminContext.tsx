import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Seva, SevaBooking } from 'src/models/seva.model';
import { logger } from 'src/services/logger.service';

import { Guru, GuruCreateRequest, GuruUpdateRequest } from 'src/models/guru.model';
import { guruService } from 'src/services/guru.service';
import { sevaService } from 'src/services/seva.service';

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
    const [sevas, setSevas] = useState<Seva[]>([]);
    const [bookings] = useState<SevaBooking[]>([]);
    const [gurus, setGurus] = useState<Guru[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            logger.info('Refreshing Admin Data');
            const [gurusData, sevasData] = await Promise.all([
                guruService.getGurus(),
                sevaService.getAllSevas(),
            ]);
            setGurus(gurusData);
            setSevas(sevasData);
            logger.info('Refreshed Data', { gurus: gurusData.length, sevas: sevasData.length });
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
