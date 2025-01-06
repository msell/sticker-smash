if (__DEV__) {
  require('../ReactotronConfig')
}
import { Stack } from 'expo-router'
export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="+not-found" />
    </Stack>
  )
}
