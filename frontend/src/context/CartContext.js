import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Create Cart Context
const CartContext = createContext();

// Cart reducer function
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'LOAD_CART':
      return action.payload || [];

    case 'ADD_TO_CART':
      const existingItem = state.find(item => item._id === action.payload._id);
      
      if (existingItem) {
        return state.map(item =>
          item._id === action.payload._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...state, { ...action.payload, quantity: 1 }];

    case 'REMOVE_FROM_CART':
      return state.filter(item => item._id !== action.payload);

    case 'UPDATE_QUANTITY':
      return state.map(item =>
        item._id === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      );

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

// Cart Provider Component
export const CartProvider = ({ children }) => {
  const [cartItems, dispatch] = useReducer(cartReducer, []);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('hijabWorldCart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hijabWorldCart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  // Remove item from cart
  const removeFromCart = (productId) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productId });
  };

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: productId, quantity } });
  };

  // Clear entire cart
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  // Calculate total items in cart
  const getCartTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate total price
  const getCartTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotalItems,
    getCartTotalPrice
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};