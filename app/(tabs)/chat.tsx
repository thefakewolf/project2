import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MessageCircle, Clock, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

interface ChatItem {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  timeAgo: string;
  unreadCount: number;
  item: string;
  itemImage: string;
  isActive: boolean;
}

const mockChats: ChatItem[] = [
  {
    id: 1,
    name: 'Sarah Chen',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastMessage: 'Would you be interested in my MacBook?',
    timeAgo: '2m',
    unreadCount: 2,
    item: 'Vintage Leather Jacket',
    itemImage: 'https://images.pexels.com/photos/1124468/pexels-photo-1124468.jpeg',
    isActive: true,
  },
  {
    id: 2,
    name: 'Alex Wong',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg',
    lastMessage: 'Sure! When would be a good time to meet?',
    timeAgo: '1h',
    unreadCount: 0,
    item: 'iPhone 14 Pro',
    itemImage: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    isActive: false,
  },
  {
    id: 3,
    name: 'Emily Liu',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    lastMessage: 'The bag looks great! Is it still available?',
    timeAgo: '3h',
    unreadCount: 1,
    item: 'Designer Handbag',
    itemImage: 'https://images.pexels.com/photos/934063/pexels-photo-934063.jpeg',
    isActive: true,
  },
  {
    id: 4,
    name: 'David Kim',
    avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg',
    lastMessage: 'Thanks for the exchange! 😊',
    timeAgo: '1d',
    unreadCount: 0,
    item: 'Gaming Console',
    itemImage: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg',
    isActive: false,
  },
];

export default function ChatScreen() {
  const [chats] = useState<ChatItem[]>(mockChats);

  const activeChatCount = chats.filter(chat => chat.isActive).length;
  const totalUnreadCount = chats.reduce((sum, chat) => sum + chat.unreadCount, 0);

  const handleChatPress = (chatName: string, itemName: string) => {
    Alert.alert(
      'Open Chat',
      `Opening conversation with ${chatName} about "${itemName}"`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open Chat', onPress: () => {
          Alert.alert('Chat', 'Chat functionality would open here');
        }},
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <View style={styles.headerStats}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{activeChatCount}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{totalUnreadCount}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        style={styles.chatList} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatListContent}>
        {chats.map((chat) => (
          <TouchableOpacity 
            key={chat.id} 
            style={styles.chatItem}
            onPress={async () => {
              await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              handleChatPress(chat.name, chat.item);
            }}>
            <View style={styles.chatContent}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: chat.avatar }} style={styles.avatar} />
                {chat.isActive && <View style={styles.activeIndicator} />}
              </View>

              <View style={styles.chatDetails}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.name}</Text>
                  <View style={styles.chatMeta}>
                    <Clock color="#64748B" size={12} strokeWidth={2} />
                    <Text style={styles.timeAgo}>{chat.timeAgo}</Text>
                  </View>
                </View>

                <Text style={styles.lastMessage} numberOfLines={1}>
                  {chat.lastMessage}
                </Text>

                <View style={styles.itemInfo}>
                  <Image source={{ uri: chat.itemImage }} style={styles.itemThumbnail} />
                  <Text style={styles.itemName} numberOfLines={1}>
                    {chat.item}
                  </Text>
                </View>
              </View>

              <View style={styles.chatActions}>
                {chat.unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadCount}>{chat.unreadCount}</Text>
                  </View>
                )}
                <ChevronRight color="#475569" size={20} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {chats.length === 0 && (
          <View style={styles.emptyState}>
            <MessageCircle color="#475569" size={64} strokeWidth={1.5} />
            <Text style={styles.emptyTitle}>No conversations yet</Text>
            <Text style={styles.emptySubtitle}>
              Start browsing items and make exchange proposals to begin chatting!
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
    paddingBottom: 20,
    backgroundColor: '#1E293B',
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 16,
  },
  headerStats: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#3B82F6',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#94A3B8',
  },
  statDivider: {
    width: 1,
    height: 32,
    backgroundColor: '#334155',
    marginHorizontal: 20,
  },
  chatList: {
    flex: 1,
  },
  chatListContent: {
    paddingTop: 12,
    paddingBottom: 120,
  },
  chatItem: {
    backgroundColor: '#1E293B',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  chatContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#22C55E',
    borderWidth: 2,
    borderColor: '#1E293B',
  },
  chatDetails: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F8FAFC',
  },
  chatMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeAgo: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#64748B',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#94A3B8',
    marginBottom: 8,
  },
  itemInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemThumbnail: {
    width: 24,
    height: 24,
    borderRadius: 4,
  },
  itemName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#3B82F6',
    flex: 1,
  },
  chatActions: {
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadBadge: {
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
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
});