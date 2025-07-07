import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, LogOut, Bell, Moon, User } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function SettingsScreen() {
  const router = useRouter();
  const [darkMode, setDarkMode] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Log Out', 
        style: 'destructive', 
        onPress: async () => {
          try {
            // 清除本地儲存的 token
            await AsyncStorage.removeItem('authToken');
            await AsyncStorage.removeItem('userData');
            
            // 清除 axios 預設 headers
            delete axios.defaults.headers.common['Authorization'];
            
            // 導向登入頁面
            router.push('/auth/login' as any);
          } catch (error) {
            console.error('Logout error:', error);
            // 即使清除失敗，也導向登入頁面
            router.push('/auth/login' as any);
          }
        } 
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft color="#F8FAFC" size={24} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.section}>
        <View style={styles.row}>
          <User color="#3B82F6" size={20} strokeWidth={2} />
          <Text style={styles.rowText}>Account</Text>
        </View>
        <View style={styles.row}>
          <Bell color="#3B82F6" size={20} strokeWidth={2} />
          <Text style={styles.rowText}>Notifications</Text>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            thumbColor={notifications ? '#3B82F6' : '#64748B'}
            trackColor={{ true: '#93C5FD', false: '#334155' }}
          />
        </View>
        <View style={styles.row}>
          <Moon color="#3B82F6" size={20} strokeWidth={2} />
          <Text style={styles.rowText}>Dark Mode</Text>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            thumbColor={darkMode ? '#3B82F6' : '#64748B'}
            trackColor={{ true: '#93C5FD', false: '#334155' }}
          />
        </View>
      </View>
      <View style={styles.divider} />
      <TouchableOpacity style={styles.logoutRow} onPress={handleLogout}>
        <LogOut color="#EF4444" size={20} strokeWidth={2} />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
  },
  divider: {
    height: 1,
    backgroundColor: '#334155',
    width: '100%',
    marginBottom: 16,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  rowText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#F8FAFC',
    marginLeft: 16,
    flex: 1,
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginTop: 16,
  },
  logoutText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
    marginLeft: 16,
  },
});
