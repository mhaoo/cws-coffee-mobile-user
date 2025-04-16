import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const CartContext = createContext();

const STORAGE_KEY = "@my_cart";

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  //TODO Tải giỏ hàng từ AsyncStorage khi khởi tạo
  useEffect(() => {
    const loadCart = async () => {
      try {
        const storedCart = await AsyncStorage.getItem(STORAGE_KEY);
        if (storedCart !== null) {
          setCart(JSON.parse(storedCart));
        }
      } catch (error) {
        console.error("Lỗi khi tải giỏ hàng đã lưu trữ:", error);
      }
    };
    loadCart();
  }, []);

  //TODO Mỗi khi giỏ hàng thay đổi, lưu lại vào AsyncStorage
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error("Lỗi khi lưu giỏ hàng:", error);
      }
    };
    // Gọi lưu lại chỉ khi cart thay đổi
    saveCart();
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProductIndex = prevCart.findIndex(
        (item) => item.id === product.id
      );

      if (existingProductIndex >= 0) {
        const updatedCart = [...prevCart];
        updatedCart[existingProductIndex] = {
          ...updatedCart[existingProductIndex],
          quantity:
            updatedCart[existingProductIndex].quantity +
            (product.quantity || 1),
          totalPrice:
            updatedCart[existingProductIndex].totalPrice +
            product.price * (product.quantity || 1),
        };
        return updatedCart;
      } else {
        return [
          ...prevCart,
          {
            ...product,
            quantity: product.quantity || 1,
            totalPrice: product.price,
          },
        ];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
