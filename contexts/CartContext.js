import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { endpoints, getAuthHeaders } from '../utils/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setCart(null);
        setLoading(false);
        return;
      }

      const response = await axios.get(endpoints.cart.get, {
        headers: getAuthHeaders()
      });

      setCart(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cart:', error);
      if (error.response?.status === 401) {
        setCart(null);
      }
      setError(error.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (serviceId, quantity = 1) => {
    try {
      const response = await axios.post(
        endpoints.cart.add,
        { serviceId, quantity },
        {
          headers: getAuthHeaders()
        }
      );
      setCart(response.data);
      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      setError(error.response?.data?.message || 'Failed to add item to cart');
      return false;
    }
  };

  const updateQuantity = async (itemId, quantity) => {
    try {
      const response = await axios.patch(`${endpoints.cart.get}/items/${itemId}`, {
        quantity,
      }, {
        headers: getAuthHeaders()
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
      const response = await axios.delete(`${endpoints.cart.get}/items/${itemId}`, {
        headers: getAuthHeaders()
      });
      setCart(response.data);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
      return false;
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete(endpoints.cart.clear, {
        headers: getAuthHeaders()
      });
      setCart(null);
      return true;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
      return false;
    }
  };

  const removeFromCart = async (serviceId) => {
    try {
      const response = await axios.delete(
        endpoints.cart.remove(serviceId),
        {
          headers: getAuthHeaders()
        }
      );
      setCart(response.data);
    } catch (error) {
      console.error('Error removing from cart:', error);
      setError(error.response?.data?.message || 'Failed to remove item from cart');
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
    removeFromCart,
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
