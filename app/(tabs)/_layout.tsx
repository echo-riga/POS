// app/(tabs)/_layout.tsx
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { router } from "expo-router";
import { Button, Dialog, Portal, Text, IconButton } from "react-native-paper";

export default function TabLayout() {
  const [showPinModal, setShowPinModal] = useState(false);

  return (
    <>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#16a34a",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: { backgroundColor: "white" },
          headerStyle: { backgroundColor: "#16a34a" },
          headerTintColor: "white",
          headerRight: () => (
            <IconButton
              icon="information-outline"
              size={22}
              iconColor="white"
              onPress={() => router.push("/about")}
            />
          ),
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Order",
            tabBarIcon: ({ color }) => (
              <Ionicons name="cart" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color }) => (
              <Ionicons name="grid" size={24} color={color} />
            ),
          }}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setShowPinModal(true);
            },
          }}
        />
        <Tabs.Screen
          name="products"
          options={{
            title: "Products",
            tabBarIcon: ({ color }) => (
              <Ionicons name="fast-food" size={24} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="transactions"
          options={{
            title: "Transactions",
            tabBarIcon: ({ color }) => (
              <Ionicons name="receipt" size={24} color={color} />
            ),
          }}
        />
      </Tabs>

      <Portal>
        <Dialog
          visible={showPinModal}
          onDismiss={() => setShowPinModal(false)}
          style={{ width: 400, alignSelf: "center" }}
        >
          <Dialog.Title>Enter PIN</Dialog.Title>
          <Dialog.Content>
            <Text>PIN input here</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowPinModal(false)}>Cancel</Button>
            <Button
              onPress={() => {
                setShowPinModal(false);
                router.push("/(tabs)/dashboard");
              }}
            >
              Confirm
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
