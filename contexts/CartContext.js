import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/cart');
      setCart(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post('/api/cart/items', {
        productId,
        quantity,
      });
      setCart(response.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await axios.patch(`/api/cart/items/${itemId}`, {
        quantity,
      });
      setCart(response.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quantity');
      return false;
    }
  };

  const removeItem = async (itemId) => {
    try {
      const response = await axios.delete(`/api/cart/items/${itemId}`);
      setCart(response.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart');
      setCart(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      return false;
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
