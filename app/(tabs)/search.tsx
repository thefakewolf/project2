import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter, MapPin, Clock } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

const categories = [
  'All', 'Electronics', 'Fashion', 'Home', 'Books', 'Sports', 'Toys', 'Others'
];

const mockSearchResults = [
  {
    id: 1,
    title: 'MacBook Pro 16"',
    location: 'Taipei, Taiwan',
    timeAgo: '1 hour ago',
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    category: 'Electronics',
  },
  {
    id: 2,
    title: 'Nike Air Force 1',
    location: 'Taichung, Taiwan',
    timeAgo: '3 hours ago',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    category: 'Fashion',
  },
  {
    id: 3,
    title: 'Coffee Machine',
    location: 'Kaohsiung, Taiwan',
    timeAgo: '5 hours ago',
    image: 'https://images.pexels.com/photos/4224099/pexels-photo-4224099.jpeg',
    category: 'Home',
  },
  {
    id: 4,
    title: 'Vintage Camera',
    location: 'Tainan, Taiwan',
    timeAgo: '1 day ago',
    image: 'https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg',
    category: 'Electronics',
  },
];

type SearchResult = {
  id: number;
  title: string;
  location: string;
  timeAgo: string;
  image: string;
  category: string;
};

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [results, setResults] = useState<SearchResult[]>(mockSearchResults);

  const handleSearch = () => {
    if (searchText.trim()) {
      Alert.alert('Search', `Searching for "${searchText}" in ${selectedCategory} category`);
    } else {
      Alert.alert('Search', 'Please enter a search term');
    }
  };

  const handleFilter = () => {
    Alert.alert('Filter', 'Advanced filter options would open here');
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    Alert.alert('Category', `Filtering by ${category} category`);
  };

  const filteredResults = selectedCategory === 'All' 
    ? results 
    : results.filter(item => item.category === selectedCategory);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Items</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search color="#64748B" size={20} strokeWidth={2} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for items..."
            value={searchText}
            onChangeText={setSearchText}
            placeholderTextColor="#64748B"
            onSubmitEditing={handleSearch}
          />
        </View>
        <TouchableOpacity style={styles.filterButton} onPress={async () => { await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium); handleFilter(); }}>
          <Filter color="#FFFFFF" size={20} strokeWidth={2} />
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, backgroundColor: '#334155', width: '100%', marginBottom: 16 }} />
      <ScrollView
        style={styles.resultsContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.resultsContent}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginBottom: 0, minHeight: 50 }}
          contentContainerStyle={{ flexDirection: 'row' }}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryChip,
                selectedCategory === category && styles.selectedCategoryChip,
              ]}
              onPress={() => handleCategorySelect(category)}>
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === category && styles.selectedCategoryText,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={styles.resultsTitle}>
          {filteredResults.length} items found
        </Text>

        {filteredResults.map((item) => (
          <TouchableOpacity key={item.id} style={styles.resultCard}>
            <Image source={{ uri: item.image }} style={styles.resultImage} />
            <View style={styles.resultContent}>
              <Text style={styles.resultTitle}>{item.title}</Text>
              <Text style={styles.resultCategory}>{item.category}</Text>
              <View style={styles.resultInfo}>
                <View style={styles.infoRow}>
                  <MapPin color="#94A3B8" size={12} strokeWidth={2} />
                  <Text style={styles.infoText}>{item.location}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Clock color="#94A3B8" size={12} strokeWidth={2} />
                  <Text style={styles.infoText}>{item.timeAgo}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {filteredResults.length === 0 && (
          <View style={styles.emptyState}>
            <Search color="#475569" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No items found</Text>
            <Text style={styles.emptySubtitle}>
              Try adjusting your search terms or category filter
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 10,
    gap: 12,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#F8FAFC',
  },
  filterButton: {
    backgroundColor: '#3B82F6',
    padding: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  resultsContainer: {
    // flex: 1,
  },
  resultsContent: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  resultsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    marginBottom: 16,
  },
  resultCard: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    borderRadius: 16,
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  resultImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  resultContent: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
    marginBottom: 4,
  },
  resultCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    marginBottom: 8,
  },
  resultInfo: {
    gap: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
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
  categoryChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
    marginRight: 8,
    alignSelf: 'flex-start',
  },
  selectedCategoryChip: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#CBD5E1',
  },
  selectedCategoryText: {
    color: '#FFFFFF',
  },
});