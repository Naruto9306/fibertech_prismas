// import React from 'react';
// import { SafeAreaView, StatusBar } from 'react-native';
// import LoginScreen from '../components/LoginScreen';

// const App = () => {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <StatusBar barStyle="dark-content" />
//       <LoginScreen />
//     </SafeAreaView>
//   );
// };

// export default App;

import { Redirect } from 'expo-router';

export default function Index() {
  // Redirigir directamente al login
  return <Redirect href="/login" />;
}