import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Seva, SevaBooking } from 'src/models/seva.model';
import { logger } from 'src/services/logger.service';
import { SEVA_DATA } from 'src/screens/seva/seva.data';

interface AdminContextType {
    sevas: Seva[];
    bookings: SevaBooking[];
    isLoading: boolean;
    addSeva: (seva: Omit<Seva, 'id'>) => Promise<void>;
    updateSeva: (id: string, updates: Partial<Seva>) => Promise<void>;
    deleteSeva: (id: string) => Promise<void>;
    toggleSevaStatus: (id: string) => Promise<void>;
    refreshData: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider = ({ children }: { children: ReactNode }) => {
    const [sevas, setSevas] = useState<Seva[]>(SEVA_DATA);
    const [bookings] = useState<SevaBooking[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            // Mocking API fetch
            logger.info('Refreshing Admin Data');
            // In a real app, these would be API calls
            // const sevasData = await apiService.get('/sevas');
            // setSevas(sevasData);
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
