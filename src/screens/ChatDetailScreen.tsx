import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { mockMessages, Message } from '../data/mockMessages';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + 'đ';
};

function MessageBubble({ message }: { message: Message }) {
  return (
    <View
      style={[
        styles.bubbleRow,
        message.isMe ? styles.bubbleRowMe : styles.bubbleRowOther,
      ]}>
      <View
        style={[
          styles.bubble,
          message.isMe ? styles.bubbleMe : styles.bubbleOther,
        ]}>
        <Text
          style={[
            styles.bubbleText,
            message.isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
          ]}>
          {message.text}
        </Text>
        <Text
          style={[
            styles.bubbleTime,
            message.isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther,
          ]}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}

export default function ChatDetailScreen({ route, navigation }: any) {
  const { conversationId, userName, bookTitle, bookPrice, isOnline } =
    route.params;

  const [messages, setMessages] = useState<Message[]>(
    mockMessages[conversationId] || [],
  );
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef<FlatList>(null);

  const handleSend = () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: String(messages.length + 1),
      text: inputText.trim(),
      isMe: true,
      time: new Date().toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>

        <View style={styles.headerInfo}>
          <View style={styles.headerNameRow}>
            <Text style={styles.headerName} numberOfLines={1}>
              {userName}
            </Text>
            {isOnline && <View style={styles.onlineDot} />}
          </View>
          <View style={styles.headerBookTag}>
            <Icon name="book-outline" size={10} color={Colors.primary} />
            <Text style={styles.headerBookText} numberOfLines={1}>
              {bookTitle} • {formatPrice(bookPrice)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.headerAction}>
          <Icon name="call-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerAction}>
          <Icon
            name="ellipsis-vertical"
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <MessageBubble message={item} />}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: false })
        }
        ListHeaderComponent={
          <View style={styles.bookBanner}>
            <Icon name="book" size={20} color={Colors.primary} />
            <View style={styles.bookBannerInfo}>
              <Text style={styles.bookBannerTitle} numberOfLines={1}>
                {bookTitle}
              </Text>
              <Text style={styles.bookBannerPrice}>
                {formatPrice(bookPrice)}
              </Text>
            </View>
            <TouchableOpacity style={styles.bookBannerButton}>
              <Text style={styles.bookBannerButtonText}>Xem sách</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton}>
          <Icon name="add-circle-outline" size={26} color={Colors.primary} />
        </TouchableOpacity>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            placeholder="Nhập tin nhắn..."
            placeholderTextColor={Colors.textMuted}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Icon
              name="happy-outline"
              size={22}
              color={Colors.textMuted}
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            inputText.trim() ? styles.sendButtonActive : {},
          ]}
          onPress={handleSend}
          disabled={!inputText.trim()}>
          <Icon
            name="send"
            size={18}
            color={inputText.trim() ? '#FFFFFF' : Colors.textMuted}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingTop: 46,
    paddingBottom: 12,
    paddingHorizontal: 8,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 4,
  },
  headerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerName: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.text,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.success,
  },
  headerBookTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  headerBookText: {
    fontSize: 11,
    color: Colors.primary,
    fontWeight: '500',
  },
  headerAction: {
    width: 38,
    height: 38,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  bookBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E6',
    borderRadius: 12,
    padding: 12,
    marginVertical: 12,
    gap: 10,
  },
  bookBannerInfo: {
    flex: 1,
  },
  bookBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  bookBannerPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 1,
  },
  bookBannerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
  },
  bookBannerButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  bubbleRow: {
    marginBottom: 6,
    flexDirection: 'row',
  },
  bubbleRowMe: {
    justifyContent: 'flex-end',
  },
  bubbleRowOther: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '78%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 6,
  },
  bubbleOther: {
    backgroundColor: Colors.surface,
    borderBottomLeftRadius: 6,
    shadowColor: 'rgba(0,0,0,0.04)',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  bubbleText: {
    fontSize: 14,
    lineHeight: 20,
  },
  bubbleTextMe: {
    color: '#FFFFFF',
  },
  bubbleTextOther: {
    color: Colors.text,
  },
  bubbleTime: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  bubbleTimeOther: {
    color: Colors.textMuted,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 10,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    backgroundColor: Colors.surface,
    gap: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.background,
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 6,
    minHeight: 40,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
    paddingTop: 6,
    paddingBottom: 6,
  },
  emojiButton: {
    paddingLeft: 8,
    paddingBottom: 6,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonActive: {
    backgroundColor: Colors.primary,
  },
});
