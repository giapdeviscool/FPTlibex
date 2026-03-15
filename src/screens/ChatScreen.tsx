import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { mockConversations, Conversation } from '../data/mockChats';
import { getMyChatRooms } from '../service/chat.service';
import { useFocusEffect } from '@react-navigation/native';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + 'đ';
};

function ConversationItem({
  conversation,
  onPress,
}: {
  conversation: Conversation;
  onPress: () => void;
}) {
  const hasUnread = conversation.unreadCount > 0;

  return (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <View
          style={[
            styles.avatar,
            hasUnread && styles.avatarUnread,
          ]}>
          <Text style={styles.avatarText}>{conversation.avatarInitial}</Text>
        </View>
        {conversation.isOnline && <View style={styles.onlineDot} />}
      </View>

      {/* Content */}
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text
            style={[styles.userName, hasUnread && styles.userNameUnread]}
            numberOfLines={1}>
            {conversation.userName}
          </Text>
          <Text
            style={[styles.time, hasUnread && styles.timeUnread]}>
            {conversation.time}
          </Text>
        </View>

        <View style={styles.bookTag}>
          <Icon name="book-outline" size={11} color={Colors.primary} />
          <Text style={styles.bookTagText} numberOfLines={1}>
            {conversation.bookTitle} • {formatPrice(conversation.bookPrice)}
          </Text>
        </View>

        <View style={styles.messageRow}>
          <Text
            style={[
              styles.lastMessage,
              hasUnread && styles.lastMessageUnread,
            ]}
            numberOfLines={1}>
            {conversation.lastMessage}
          </Text>
          {hasUnread && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function ChatScreen({ navigation }: any) {
  const [searchText, setSearchText] = useState<string>('');
  const [allConversations, setAllConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const displayedConversations = React.useMemo(() => {
    if (!searchText.trim()) return allConversations;
    const lowerSearch = searchText.toLowerCase();
    return allConversations.filter(
      item =>
        item.userName.toLowerCase().includes(lowerSearch) ||
        item.bookTitle.toLowerCase().includes(lowerSearch)
    );
  }, [searchText, allConversations]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchRooms = async () => {
        try {
          setIsLoading(true);
          const response: any = await getMyChatRooms();
          console.log('Chat rooms response:', response);
          if (response && response.success && response.data && Array.isArray(response.data.conversations)) {
            const formattedRooms: Conversation[] = response.data.conversations.map((r: any) => ({
              id: r.id || r._id,
              userName: r.userName,
              avatarInitial: r.avatarInitial || (r.userName || 'U').charAt(0),
              bookTitle: r.bookTitle,
              bookPrice: r.bookPrice,
              lastMessage: r.lastMessage,
              time: r.time,
              unreadCount: r.unreadCount || 0,
              isOnline: r.isOnline || false,
            }));
            setAllConversations(formattedRooms);
          } else {
            console.warn('Chat rooms list is empty or invalid structure:', response);
          }
        } catch (error) {
          console.error('Error fetching chat rooms:', error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchRooms();
    }, [])
  );

  const unreadTotal = allConversations.reduce(
    (sum, c) => sum + c.unreadCount,
    0,
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Tin nhắn</Text>
            {unreadTotal > 0 && (
              <Text style={styles.headerSubtitle}>
                {unreadTotal} tin chưa đọc
              </Text>
            )}
          </View>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={18} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm cuộc trò chuyện..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Conversation List */}
      <FlatList
        data={displayedConversations}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() =>
              navigation.navigate('ChatDetail', {
                conversationId: item.id,
                userName: item.userName,
                bookTitle: item.bookTitle,
                bookPrice: item.bookPrice,
                isOnline: item.isOnline,
              })
            }
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="chatbubbles-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa có tin nhắn</Text>
            <Text style={styles.emptySubtitle}>
              Bắt đầu mua bán để trò chuyện{'\n'}với người bán/mua
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.surface,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 42,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  listContent: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  conversationItem: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 16,
    backgroundColor: '#FFE0C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarUnread: {
    backgroundColor: Colors.primary,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: Colors.success,
    borderWidth: 2.5,
    borderColor: Colors.background,
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
    marginRight: 8,
  },
  userNameUnread: {
    fontWeight: '800',
  },
  time: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  timeUnread: {
    color: Colors.primary,
    fontWeight: '600',
  },
  bookTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
    backgroundColor: '#FFF3E6',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookTagText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '600',
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 13,
    color: Colors.textSecondary,
    flex: 1,
    marginRight: 8,
  },
  lastMessageUnread: {
    color: Colors.text,
    fontWeight: '600',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  unreadText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 86,
    marginRight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 8,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
