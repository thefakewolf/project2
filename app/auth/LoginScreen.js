import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import axios from 'axios';

const API_URL = 'http://localhost:8000'; // 請依實際後端位置調整

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('請輸入 Email 和密碼');
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login/`, { email, password });
      // 這裡你可以把 token 存到 context、redux 或 asyncStorage
      Alert.alert('登入成功', `Token: ${res.data.key}`);
      // navigation.replace('Home'); // 登入後跳轉
    } catch (err) {
      Alert.alert('登入失敗', err?.response?.data?.non_field_errors?.[0] || '請檢查帳號密碼');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={['#2d2346', '#3a295c', '#1a1833']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Welcome{"\n"}Back</Text>
        <View style={styles.inputGroup}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#b6b6c9"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#b6b6c9"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>
        <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} disabled={loading}>
          <LinearGradient
            colors={['#7f53ac', '#647dee']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={StyleSheet.absoluteFill}
          />
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.loginText}>Log in</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.forgotBtn} onPress={() => Alert.alert('請聯絡客服重設密碼')}> 
          <Text style={styles.forgotText}>Forgot Password ?</Text>
        </TouchableOpacity>
        <View style={styles.bottomRow}>
          <Text style={styles.bottomText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => Alert.alert('請用註冊 API 建立帳號')}> 
            <Text style={styles.signUpText}>Sign up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    width: '90%',
    maxWidth: 400,
    alignSelf: 'center',
    backgroundColor: 'rgba(30, 22, 54, 0.7)',
    borderRadius: 32,
    padding: 32,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
  },
  title: {
    color: '#fff',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 32,
    textAlign: 'left',
    letterSpacing: 1,
  },
  inputGroup: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#19162e',
    color: '#fff',
    borderRadius: 16,
    paddingHorizontal: 20,
    paddingVertical: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#2d2346',
  },
  loginBtn: {
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#7f53ac',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    overflow: 'hidden',
  },
  loginText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotText: {
    color: '#b6b6c9',
    fontSize: 14,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  bottomText: {
    color: '#b6b6c9',
    fontSize: 14,
  },
  signUpText: {
    color: '#7f53ac',
    fontSize: 14,
    fontWeight: 'bold',
  },
}); 