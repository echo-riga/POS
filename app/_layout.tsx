// app/_layout.tsx
import { Stack, router } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { setupDatabase } from "@/services/db";
import { useEffect } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#16a34a",
    secondary: "#4ade80",
  },
};

export default function RootLayout() {
  useEffect(() => {
    setupDatabase();
  }, []);
  return (
    <PaperProvider theme={theme}>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "white", // back button + title color
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
            headerBackTitle: "",
          }}
        />
        <Stack.Screen
          name="checkout"
          options={{
            animation: "slide_from_right",
            title: "Checkout",
            headerBackTitle: "Order", // ← this controls the back button text
          }}
        />
        <Stack.Screen
          name="product-form"
          options={{
            animation: "slide_from_right",
            title: "Product",
            headerBackTitle: "Products", // ← back button says "Products"
          }}
        />
        <Stack.Screen
          name="about"
          options={{
            title: "About",
            animation: "slide_from_right",
            headerStyle: { backgroundColor: "#16a34a" },
            headerTintColor: "white",
            headerBackVisible: false,
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => router.back()}
                style={{ marginLeft: 4 }}
              >
                <Ionicons name="chevron-back" size={26} color="white" />
              </TouchableOpacity>
            ),
          }}
        />
        <Stack.Screen
          name="transaction-detail"
          options={{
            animation: "slide_from_right",
            title: "Transaction Detail",
            headerBackTitle: "Transactions", // ← back button says "Transactions"
          }}
        />
      </Stack>
    </PaperProvider>
  );
}
