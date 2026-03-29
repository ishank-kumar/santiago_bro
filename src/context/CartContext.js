'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useUser } from '@clerk/nextjs';

const CartContext = createContext(undefined);

export function CartProvider({ children }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [cart, setCart] = useState([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Dynamically calculate the local storage key based on authentication state
  const getStorageKey = () => {
    if (!isLoaded) return null;
    return isSignedIn && user ? `santiago-cart-${user.id}` : null;
  };

  // Load cart on mount or auth state change
  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      setCart([]); // "no cart while log out"
      setIsInitialized(true);
      return;
    }

    const key = getStorageKey();
    if (key) {
      const savedCart = localStorage.getItem(key);
      if (savedCart) {
        try {
          setCart(JSON.parse(savedCart));
        } catch (e) {
          console.error('Failed to parse cart', e);
          setCart([]);
        }
      } else {
        setCart([]); // clear cart out if user has no saved cart yet
      }
    }
    
    setIsInitialized(true);
  }, [isLoaded, isSignedIn, user?.id]);

  // Save cart to user-specific localStorage on change
  useEffect(() => {
    if (isInitialized && isSignedIn) {
      const key = getStorageKey();
      if (key) {
        localStorage.setItem(key, JSON.stringify(cart));
      }
    }
  }, [cart, isInitialized, isSignedIn, user?.id]);

  const addToCart = (product) => {
    if (!isSignedIn) {
      toast.error('Please log in to add items to your custom cart.', { 
        description: 'Your cart is specifically tied to your account.' 
      });
      return;
    }
    
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        toast.info(`${product.name} quantity updated in cart`);
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      toast.success(`${product.name} added to cart`);
      return [...prevCart, { ...product, quantity: 1, status: 'in-cart' }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    toast.error('Item removed from cart');
  };

  const updateStatus = (productId, newStatus) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === productId ? { ...item, status: newStatus } : item
      )
    );
    toast.success(`Item status updated to ${newStatus}`);
  };

  const clearCart = () => {
    setCart([]);
    const key = getStorageKey();
    if (key) {
      localStorage.removeItem(key);
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateStatus,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
