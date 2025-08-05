import React, { createContext, useContext, useState, ReactNode, use, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Product = {
    id: number;
    title: string;
    price: number;
    image: string;
    quantity?: number;
    category: string;
};

type BasketContextType = {
    basket: Product[];
    addToBasket: (product: Product) => void;
    deleteFromBasket: (id: number) => void;
    incrementQuantity: (id: number) => void;
    decrementQuantity: (id: number) => void;
};

const BasketContext = createContext<BasketContextType | undefined>(undefined);

export const BasketProvider = ({ children }: { children: ReactNode }) => {
    const [basket, setBasket] = useState<Product[]>([]);

    useEffect(() => {
        const loadBasket = async () => {
            try {
                const savedBasket = await AsyncStorage.getItem('basket');
                if (savedBasket) {
                    setBasket(JSON.parse(savedBasket));
                }
            } catch (error) {
                console.error('Failed to load basket', error);
            }
        };
        loadBasket();
    }, []);

    useEffect(() => {
        const saveBasket = async () => {
            try {
                await AsyncStorage.setItem('basket', JSON.stringify(basket));
            } catch (error) {
                console.error('Failed to save basket', error);
            }
        };
        saveBasket();
    }, [basket]);

    const addToBasket = (product: Product) => {
        setBasket(prev => {
            const found = prev.find(p => p.id === product.id);
            if (found) {
                return prev.map(p =>
                    p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
                );
            } else {
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const deleteFromBasket = (id: number) => {
        setBasket(prev => prev.filter(p => p.id !== id));
    };

    const incrementQuantity = (id: number) => {
        setBasket(prev =>
            prev.map(p => (p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p))
        );
    }

    const decrementQuantity = (id: number) => {
        setBasket(prev =>
            prev.map(p => (p.id === id ? { ...p, quantity: (p.quantity || 1) - 1 } : p))
        );
    }

    return (
        <BasketContext.Provider value={{ basket, addToBasket, deleteFromBasket, incrementQuantity, decrementQuantity }}>
            {children}
        </BasketContext.Provider>
    );
};

export const useBasket = () => {
    const context = useContext(BasketContext);
    if (!context) {
        throw new Error('useBasket must be used within a BasketProvider');
    }
    return context;
};
