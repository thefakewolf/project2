import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Animated,
  Image,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, MapPin, Clock, ArrowRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 32;

const mockItems = [
  {
    id: 1,
    title: 'Vintage Leather Jacket',
    location: 'Taipei, Taiwan',
    timeAgo: '2 hours ago',
    image: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
    wantedItems: ['Designer Bag', 'Sneakers'],
    isFavorited: false,
  },
  {
    id: 2,
    title: 'iPhone 14 Pro',
    location: 'Taichung, Taiwan',
    timeAgo: '4 hours ago',
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    wantedItems: ['MacBook', 'Camera'],
    isFavorited: true,
  },
  {
    id: 3,
    title: 'Designer Handbag',
    location: 'Kaohsiung, Taiwan',
    timeAgo: '1 day ago',
    image: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg',
    wantedItems: ['Watch', 'Jewelry'],
    isFavorited: false,
  },
  {
    id: 4,
    title: 'Gaming Console',
    location: 'Tainan, Taiwan',
    timeAgo: '2 days ago',
    image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    wantedItems: ['Laptop', 'Monitor'],
    isFavorited: false,
  },
];

const API_URL = 'http://192.168.8.160:8000';

export default function FeedScreen() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const checkAuthAndFetch = async () => {
      const token = await AsyncStorage.getItem('authToken');
      if (!token) {
        router.replace('/auth/login');
        return;
      }
      try {
        const res = await axios.get('http://192.168.8.160:8000/items/', {
          headers: { Authorization: `Token ${token}` }
        });
        setItems(res.data);
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch items');
      } finally {
        setLoading(false);
      }
    };
    checkAuthAndFetch();
  }, []);

  const toggleFavorite = (id: number) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, isFavorited: !item.isFavorited } : item
      )
    );
    
    // Show feedback to user
    const item = items.find(item => item.id === id);
    const action = item?.isFavorited ? 'removed from' : 'added to';
    Alert.alert('Success', `Item ${action} favorites!`);
  };

  const handleExchangeProposal = (itemTitle: string) => {
    Alert.alert(
      'Exchange Proposal',
      `Would you like to propose an exchange for "${itemTitle}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Propose Exchange', onPress: () => {
          Alert.alert('Success', 'Exchange proposal sent! The owner will be notified.');
        }},
      ]
    );
  };

  // Header動畫參數
  const HEADER_MAX_HEIGHT = 120;
  const HEADER_MIN_HEIGHT = 0;
  const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });
  const titleFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [28, 0],
    extrapolate: 'clamp',
  });
  const subtitleOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
    outputRange: [1, 0.5, 0],
    extrapolate: 'clamp',
  });
  const headerPaddingTop = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [20, 0],
    extrapolate: 'clamp',
  });
  const headerPaddingBottom = scrollY.interpolate({
    inputRange: [0, HEADER_SCROLL_DISTANCE],
    outputRange: [24, 0],
    extrapolate: 'clamp',
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Animated.View
        style={{
          height: headerHeight,
          overflow: 'hidden',
          justifyContent: 'center',
          paddingTop: headerPaddingTop,
          paddingBottom: headerPaddingBottom,
        }}
      >
        <LinearGradient
          colors={['#1E293B', '#334155']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <Animated.Text style={[styles.headerTitle, { fontSize: titleFontSize }]}>Segunda</Animated.Text>
          <Animated.Text style={[styles.headerSubtitle, { opacity: subtitleOpacity }]}>Discover & Exchange</Animated.Text>
        </LinearGradient>
      </Animated.View>

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
        {loading ? (
          <Text style={{ color: '#fff', textAlign: 'center', marginTop: 40 }}>Loading...</Text>
        ) : items.length === 0 ? (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>No items found.</Text>
          </View>
        ) : (
          items.map((item, index) => (
            <View key={item.id} style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.cardImage} />
              <View style={styles.cardContent}>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <TouchableOpacity
                    onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); toggleFavorite(item.id); }}
                    style={styles.favoriteButton}>
                    <Heart
                      color={item.isFavorited ? '#EF4444' : '#64748B'}
                      size={22}
                      fill={item.isFavorited ? '#EF4444' : 'transparent'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardInfo}>
                  <View style={styles.infoRow}>
                    <MapPin color="#94A3B8" size={14} strokeWidth={2} />
                    <Text style={styles.infoText}>{item.location}</Text>
                  </View>
                  <View style={styles.infoRow}>
                    <Clock color="#94A3B8" size={14} strokeWidth={2} />
                    <Text style={styles.infoText}>{item.created_at ? new Date(item.created_at).toLocaleString() : ''}</Text>
                  </View>
                </View>
                <View style={styles.wantedSection}>
                  <Text style={styles.wantedLabel}>Looking for:</Text>
                  <View style={styles.wantedTags}>
                    {item.wanted_items && item.wanted_items.map((wanted: string, idx: number) => (
                      <View key={idx} style={styles.tag}>
                        <Text style={styles.tagText}>{wanted}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <TouchableOpacity 
                  style={styles.exchangeButton}
                  onPress={() => handleExchangeProposal(item.title)}>
                  <Text style={styles.exchangeButtonText}>Propose Exchange</Text>
                  <ArrowRight color="#FFFFFF" size={18} strokeWidth={2} />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#BFDBFE',
    textAlign: 'center',
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 20,
    paddingBottom: 120,
  },
  card: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardImage: {
    width: '100%',
    height: 240,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  cardContent: {
    padding: 20,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    flex: 1,
  },
  favoriteButton: {
    padding: 8,
  },
  cardInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
    marginLeft: 8,
  },
  wantedSection: {
    marginBottom: 20,
  },
  wantedLabel: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#CBD5E1',
    marginBottom: 8,
  },
  wantedTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#1E40AF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#BFDBFE',
  },
  exchangeButton: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  exchangeButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});