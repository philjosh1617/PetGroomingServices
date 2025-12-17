import { Stack } from "expo-router";
import { PetProvider } from "./contexts/PetContext";
import { AppointmentProvider } from "./contexts/AppointmentContext";

export default function RootLayout() {
  return (
    <PetProvider>
      <AppointmentProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </AppointmentProvider>
    </PetProvider>
  );
}