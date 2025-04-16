// import "intl";
// import "intl/locale-data/jsonp/vi";

import React, { useCallback, useContext, useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import StackNavigator from "./components/navigation";
import { CartProvider } from "./screens/general/cart/cartContext";
import { QueryClientProvider } from "@tanstack/react-query";
import queryClient from "./config/queryClient";
// import { AuthContext } from "./api/authContext";
// import * as Keychain from "react-native-keychain";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <NavigationContainer>
          <StatusBar
            barStyle={"dark-content"}
            translucent
            backgroundColor="transparent"
          />
          <StackNavigator />
        </NavigationContainer>
      </CartProvider>
    </QueryClientProvider>
  );
}
