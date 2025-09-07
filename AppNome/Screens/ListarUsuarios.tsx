import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList } from '../AppNavigator';

type Usuario = {
  id: string;
  nome: string;
  email: string;
  avatar: string; // Alterado de number para string
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const STORAGE_KEY = '@usuarios_app';

export default function Users() {
  const navigation = useNavigation<NavigationProp>();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);

  useEffect(() => {
    carregarUsuarios();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      carregarUsuarios();
    });

    return unsubscribe;
  }, [navigation]);

  const carregarUsuarios = async () => {
    try {
      const usuariosSalvos = await AsyncStorage.getItem(STORAGE_KEY);
      if (usuariosSalvos) {
        setUsuarios(JSON.parse(usuariosSalvos));
      }
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    }
  };

  const salvarUsuarios = async (novosUsuarios: Usuario[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(novosUsuarios));
      setUsuarios(novosUsuarios);
    } catch (error) {
      console.error('Erro ao salvar usuários:', error);
    }
  };

  const handleExcluir = (id: string) => {
    Alert.alert(
      'Excluir Usuário',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            const novosUsuarios = usuarios.filter(usuario => usuario.id !== id);
            salvarUsuarios(novosUsuarios);
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Usuários</Text>
      
      <ScrollView style={styles.listaUsuarios}>
        {usuarios.map((usuario) => (
          <View key={usuario.id} style={styles.card}>
            <Image
              source={{ uri: usuario.avatar }} // Alterado para usar URI da URL
              style={styles.avatarCard}
              onError={() => console.log('Erro ao carregar avatar')}
            />
            <View style={styles.infoUsuario}>
              <Text style={styles.nome}>{usuario.nome}</Text>
              <Text style={styles.email}>{usuario.email}</Text>
            </View>
            <TouchableOpacity
              onPress={() => handleExcluir(usuario.id)}
              style={styles.botaoExcluir}
            >
              <Text style={styles.iconeLixo}>🗑️</Text>
            </TouchableOpacity>
          </View>
        ))}
        
        {usuarios.length === 0 && (
          <View style={styles.vazio}>
            <Text style={styles.textoVazio}>Nenhum usuário cadastrado</Text>
            <Text style={styles.textoVazioSub}>Clique no + para adicionar um usuário</Text>
          </View>
        )}
      </ScrollView>
      
      <TouchableOpacity
        style={styles.botaoAdicionar}
        onPress={() => navigation.navigate('Cadastrar')}
      >
        <Text style={styles.iconeAdicionar}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
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
    marginBottom: 20,
    marginTop: 10,
  },
  listaUsuarios: {
    flex: 1,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarCard: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  infoUsuario: {
    flex: 1,
  },
  nome: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: '#666',
  },
  botaoExcluir: {
    padding: 10,
  },
  iconeLixo: {
    fontSize: 20,
  },
  botaoAdicionar: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: 'white',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  iconeAdicionar: {
    fontSize: 30,
    color: '#ed145b',
    fontWeight: 'bold',
  },
  vazio: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  textoVazio: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  textoVazioSub: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});