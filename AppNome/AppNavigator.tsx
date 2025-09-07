import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Cadastrar from './Screens/CadastrarUsuario';
import Listar from './Screens/ListarUsuarios';

export type RootStackParamList = {
  Listar: undefined;
  Cadastrar: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Cadastrar">
      <Stack.Screen name="Cadastrar" component={Cadastrar} options={{ title: 'Cadastrar Usuário' }} />
      <Stack.Screen name="Listar" component={Listar} options={{ title: 'Usuários' }} />
    </Stack.Navigator>
  );
}