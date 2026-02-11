import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Seva } from 'src/models/seva.model';
import { storage } from 'src/utils/storage';

interface CartState {
    items: Seva[];
    addToCart: (seva: Seva) => void;
    removeFromCart: (sevaId: string) => void;
    clearCart: () => void;
    isInCart: (sevaId: string) => boolean;
    totalAmount: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],

            addToCart: (seva) => {
                const currentItems = get().items;
                if (!currentItems.find(item => item.id === seva.id)) {
                    set({ items: [...currentItems, seva] });
                }
            },

            removeFromCart: (sevaId) => {
                set({
                    items: get().items.filter(item => item.id !== sevaId),
                });
            },

            clearCart: () => set({ items: [] }),

            isInCart: (sevaId) => {
                return !!get().items.find(item => item.id === sevaId);
            },

            totalAmount: () => {
                return get().items.reduce((sum, item) => sum + item.amount, 0);
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => storage),
        }
    )
);
