import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Settings, Star, Package, Heart, Calendar, MapPin, CreditCard as Edit3, ShoppingBag, Users } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

const userStats = {
  totalItems: 24,
  completedExchanges: 18,
  rating: 4.8,
  memberSince: 'March 2023',
};

const userItems = [
  {
    id: 1,
    title: 'MacBook Pro 16"',
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    status: 'available',
    likes: 12,
  },
  {
    id: 2,
    title: 'Designer Watch',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg',
    status: 'exchanged',
    likes: 8,
  },
  {
    id: 3,
    title: 'Vintage Camera',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    status: 'available',
    likes: 15,
  },
  {
    id: 4,
    title: 'Gaming Headset',
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    status: 'available',
    likes: 6,
  },
  {
    id: 5,
    title: 'Bluetooth Speaker',
    image: 'https://images.pexels.com/photos/63703/pexels-photo-63703.jpeg',
    status: 'available',
    likes: 10,
  },
  {
    id: 6,
    title: 'Mountain Bike',
    image: 'https://images.pexels.com/photos/276528/pexels-photo-276528.jpeg',
    status: 'available',
    likes: 7,
  },
  {
    id: 7,
    title: 'Leather Backpack',
    image: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg',
    status: 'exchanged',
    likes: 11,
  },
  {
    id: 8,
    title: 'Wireless Earbuds',
    image: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg',
    status: 'available',
    likes: 9,
  },
  {
    id: 9,
    title: 'Smartphone',
    image: 'https://images.pexels.com/photos/1092671/pexels-photo-1092671.jpeg',
    status: 'available',
    likes: 13,
  },
  {
    id: 10,
    title: 'Electric Guitar',
    image: 'https://images.pexels.com/photos/164936/pexels-photo-164936.jpeg',
    status: 'exchanged',
    likes: 5,
  },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'items' | 'favorites'>('items');
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const fetchUser = async () => {
      const userData = await AsyncStorage.getItem('userData');
      if (!userData) {
        router.replace('/auth/login');
        return;
      }
      setUser(JSON.parse(userData));
    };
    fetchUser();
  }, []);

  const handleSettings = () => {
    router.push('/settings');
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing would open here');
  };

  const handleItemPress = (itemTitle: string, status: string) => {
    Alert.alert(
      'Item Details',
      `Opening details for "${itemTitle}" (${status})`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Details', onPress: () => {
          Alert.alert('Item', 'Item details would open here');
        }},
      ]
    );
  };

  const displayItems = activeTab === 'items' ? userItems : userItems.filter(item => item.likes > 10);

  // Header動畫參數
  const HEADER_MAX_HEIGHT = 260;
  const HEADER_MIN_HEIGHT = 0;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const avatarSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [80, 0],
    extrapolate: 'clamp',
  });
  const nameFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [24, 0],
    extrapolate: 'clamp',
  });
  const headerPaddingTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });
  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [32, 0],
    extrapolate: 'clamp',
  });
  const statsScale = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  const statsOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });
  // statsContainer marginTop 動畫
  const statsMarginTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [-16, 0],
    extrapolate: 'clamp',
  });
  // header + statsContainer 動畫高度
  const statsHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [88, 0],
    extrapolate: 'clamp',
  });
  const headerBgHeight = Animated.add(headerHeight, statsHeight);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View
        style={{
          height: headerBgHeight,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={['#1E293B', '#3B82F6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { flex: 1, position: 'absolute', top: 0, left: 0, right: 0, zIndex: 1 }]}
        >
          <TouchableOpacity style={styles.settingsButton} onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); handleSettings(); }}>
            <Settings color="#FFFFFF" size={24} strokeWidth={2} />
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Animated.View style={{ alignItems: 'center', opacity: statsOpacity, transform: [{ scale: statsScale }] }}>
              <Animated.Image
                source={{ uri: user?.profile_image || 'https://i.pravatar.cc/150?img=3' }}
                style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize.interpolate({inputRange: [0, 80], outputRange: [0, 40], extrapolate: 'clamp'}) }]}
              />
              <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
                <Edit3 color="#3B82F6" size={16} strokeWidth={2} />
              </TouchableOpacity>
              <Animated.Text style={[styles.userName, { fontSize: nameFontSize }]}>{user?.username || 'User'}</Animated.Text>
              <Text style={styles.email}>{user?.email || ''}</Text>
              <View style={styles.locationContainer}>
                <MapPin color="#BFDBFE" size={16} strokeWidth={2} />
                <Text style={styles.userLocation}>Taipei, Taiwan</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Star color="#FFD700" size={16} fill="#FFD700" strokeWidth={2} />
                <Text style={styles.rating}>{userStats.rating}</Text>
                <Text style={styles.ratingText}>({userStats.completedExchanges} exchanges)</Text>
              </View>
            </Animated.View>
          </View>
        </LinearGradient>
        <Animated.View style={[
          styles.statsContainer,
          {
            opacity: statsOpacity,
            transform: [{ scale: statsScale }],
            marginTop: 0,
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: statsHeight,
            zIndex: 2,
          },
        ]}>
          <View style={styles.statCard}>
            <Package color="#3B82F6" size={24} strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.totalItems}</Text>
            <Text style={styles.statLabel}>Items Listed</Text>
          </View>
          <View style={styles.statCard}>
            <ShoppingBag color="#10B981" size={24} strokeWidth={2} />
            <Text style={styles.statNumber}>{userStats.completedExchanges}</Text>
            <Text style={styles.statLabel}>Exchanged</Text>
          </View>
          <View style={styles.statCard}>
            <Users color="#8B5CF6" size={24} strokeWidth={2} />
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
        </Animated.View>
      </Animated.View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'items' && styles.activeTab]}
          onPress={() => setActiveTab('items')}>
          <Text style={[styles.tabText, activeTab === 'items' && styles.activeTabText]}>
            My Items
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
          onPress={() => setActiveTab('favorites')}>
          <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
            Favorites
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        scrollEventThrottle={16}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
      >
        <View style={styles.itemsGrid}>
          {displayItems.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              style={styles.itemCard}
              onPress={() => handleItemPress(item.title, item.status)}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemOverlay}>
                <View style={styles.itemStatus}>
                  <View style={[
                    styles.statusDot, 
                    { backgroundColor: item.status === 'available' ? '#22C55E' : '#64748B' }
                  ]} />
                  <Text style={styles.statusText}>
                    {item.status === 'available' ? 'Available' : 'Exchanged'}
                  </Text>
                </View>
                <View style={styles.itemLikes}>
                  <Heart color="#FFFFFF" size={12} strokeWidth={2} />
                  <Text style={styles.likesText}>{item.likes}</Text>
                </View>
              </View>
              <Text style={styles.itemTitle} numberOfLines={1}>
                {item.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {displayItems.length === 0 && (
          <View style={styles.emptyState}>
            <Heart color="#475569" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No {activeTab} yet</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'items' 
                ? 'Start adding items to build your collection'
                : 'Items you favorite will appear here'
              }
            </Text>
          </View>
        )}

        <View style={styles.memberSince}>
          <Calendar color="#64748B" size={16} strokeWidth={2} />
          <Text style={styles.memberSinceText}>
            Member since {userStats.memberSince}
          </Text>
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 32,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    alignItems: 'center',
  },
  settingsButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 8,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  editButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginTop: 12,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#BFDBFE',
    marginTop: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  userLocation: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#BFDBFE',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 4,
  },
  rating: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  ratingText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#BFDBFE',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingVertical: 0,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 20,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: '#334155',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  activeTabText: {
    color: '#FFFFFF',
    fontFamily: 'Inter-SemiBold',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingHorizontal: 20,
    paddingBottom: 120,
    minHeight: '100%',
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  itemCard: {
    width: '48%',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  itemImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  itemOverlay: {
    position: 'absolute',
    top: 8,
    left: 8,
    right: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#FFFFFF',
  },
  itemLikes: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.9)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 4,
    gap: 2,
  },
  likesText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    padding: 12,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
  },
  memberSince: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 32,
    gap: 8,
  },
  memberSinceText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
});

