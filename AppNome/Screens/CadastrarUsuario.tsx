import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image, ScrollView } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../AppNavigator';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

type Usuario = {
  id: string;
  nome: string;
  email: string;
  avatar: string;
};

const STORAGE_KEY = '@usuarios_app';

export default function AddUsers() {
  const navigation = useNavigation<NavigationProp>();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleCarregarPreview = () => {
    if (avatarUrl.trim()) {
      setAvatarPreview(avatarUrl);
    }
  };

  const handleSalvar = async () => {
    if (!nome.trim() || !email.trim() || !avatarUrl.trim()) {
      Alert.alert('Erro', 'Por favor, preencha todos os campos');
      return;
    }

    try {
      const novoUsuario: Usuario = {
        id: Date.now().toString(),
        nome,
        email,
        avatar: avatarUrl,
      };

      const usuariosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
      let usuarios: Usuario[] = [];
      
      if (usuariosSalvos) {
        usuarios = JSON.parse(usuariosSalvos);
      }

      usuarios.push(novoUsuario);

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(usuarios));

      setNome('');
      setEmail('');
      setAvatarUrl('');
      setAvatarPreview(null);

      Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!', [
        { text: 'OK', onPress: () => navigation.navigate('Listar') }
      ]);

    } catch (error) {
      console.error('Erro ao salvar usuário:', error);
      Alert.alert('Erro', 'Não foi possível salvar o usuário');
    }
  };

  return (
    <ScrollView style={estilos.container}>
      <Text style={estilos.titulo}>Adicionar Usuário</Text>
      
      <TextInput
        style={estilos.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        placeholderTextColor="#999"
      />
      
      <TextInput
        style={estilos.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#999"
        keyboardType="email-address"
      />
      
      <Text style={estilos.subtitulo}>URL do Avatar:</Text>
      
      <TextInput
        style={estilos.input}
        placeholder="Cole a URL da imagem do avatar"
        value={avatarUrl}
        onChangeText={setAvatarUrl}
        placeholderTextColor="#999"
        keyboardType="url"
        autoCapitalize="none"
      />
      
      <TouchableOpacity style={estilos.btnCarregar} onPress={handleCarregarPreview}>
        <Text style={estilos.btnTextoCarregar}>Carregar Preview</Text>
      </TouchableOpacity>
      
      {avatarPreview && (
        <View style={estilos.previewContainer}>
          <Text style={estilos.subtitulo}>Preview do Avatar:</Text>
          <Image
            source={{ uri: avatarPreview }}
            style={estilos.avatarPreview}
            onError={() => {
              Alert.alert('Erro', 'Não foi possível carregar a imagem desta URL');
              setAvatarPreview(null);
            }}
          />
        </View>
      )}
      
      <TouchableOpacity style={estilos.btnSalvar} onPress={handleSalvar}>
        <Text style={estilos.btnTexto}>Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ed145b',
    padding: 20,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginBottom: 15,
    marginTop: 10,
  },
  btnCarregar: {
    backgroundColor: '#ff6b9d',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  btnTextoCarregar: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarPreview: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'white',
  },
  btnSalvar: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  btnTexto: {
    color: '#ed145b',
    fontSize: 18,
    fontWeight: 'bold',
  },
});