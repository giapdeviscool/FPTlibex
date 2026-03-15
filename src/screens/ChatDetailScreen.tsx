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
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Colors } from '../theme/colors';
import { Message } from '../data/mockMessages';
import SocketService from '../service/socket.service';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { getMessages } from '../service/chat.service';
import { uploadImage } from '../service/upload.service';
import { ActivityIndicator } from 'react-native';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' F-Coin';
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
          message.image ? styles.imageBubble : {},
        ]}>
        {message.image && (
          <Image source={{ uri: message.image }} style={styles.bubbleImage} />
        )}
        {message.text ? (
          <Text
            style={[
              styles.bubbleText,
              message.isMe ? styles.bubbleTextMe : styles.bubbleTextOther,
            ]}>
            {message.text}
          </Text>
        ) : null}
        <Text
          style={[
            styles.bubbleTime,
            message.isMe ? styles.bubbleTimeMe : styles.bubbleTimeOther,
            message.image ? styles.imageBubbleTime : {},
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

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);
  useFocusEffect(
    React.useCallback(() => {
      const setupSocket = async () => {
        const token = await AsyncStorage.getItem('user_token');
        const userInfoStr = await AsyncStorage.getItem('user_info');

        if (token && userInfoStr) {
          const userInfo = JSON.parse(userInfoStr);
          setCurrentUser(userInfo);
          // Connect and join room
          SocketService.connect(token);
          SocketService.joinRoom(conversationId);

          // Fetch message history
          try {
            const response: any = await getMessages(conversationId);
            console.log('Messages history response:', response);

            // Handle both wrapped { success: true, data: [...] } and direct array
            const history = response?.data || response;
            if (history && Array.isArray(history)) {
              const formattedMessages = history.map((m: any) => ({
                id: m._id,
                text: m.content, // Map content to text
                isMe: m.sender?._id === userInfo._id, // Identify if I am the sender
                time: new Date(m.createdAt).toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                }),
                image: m.image,
              }));
              setMessages(formattedMessages);
            }
          } catch (error) {
            console.error('Error fetching messages:', error);
          }

          // Listen for incoming messages
          SocketService.socket?.on('receive_message', (data: any) => {
            const incomingMessage: Message = {
              id: data._id || String(Date.now()),
              text: data.content, // Map content to text
              isMe: (data.sender?._id || data.senderId) === userInfo._id,
              time: new Date(data.createdAt || Date.now()).toLocaleTimeString('vi-VN', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              image: data.image,
            };

            setMessages(prev => {
              // Check if message already exists (from optimistic update or previous fetch)
              if (prev.some(m => m.id === incomingMessage.id || (m.text === incomingMessage.text && m.isMe === incomingMessage.isMe && m.id.startsWith('temp-')))) {
                // If it was an optimistic temp message, replace it or just ignore the incoming if we prefer
                return prev.map(m => (m.text === incomingMessage.text && m.id.startsWith('temp-')) ? incomingMessage : m);
              }
              return [...prev, incomingMessage];
            });

            setTimeout(() => {
              flatListRef.current?.scrollToEnd({ animated: true });
            }, 100);
          });

          // Listen for successful send feedback
          SocketService.socket?.on('message_sent', (data: any) => {
            console.log('Message sent confirmed:', data);
          });

          // Listen for errors
          SocketService.socket?.on('message_error', (data: any) => {
            Alert.alert('Lỗi gửi tin nhắn', data.message || 'Đã có lỗi xảy ra');
          });
        }
      };

      setupSocket();

      return () => {
        SocketService.leaveRoom(conversationId);
        SocketService.socket?.off('receive_message');
        SocketService.socket?.off('message_sent');
        SocketService.socket?.off('message_error');
      };
    }, [conversationId])
  );

  const handleAttachImage = () => {
    Alert.alert('Gửi ảnh', 'Chọn nguồn ảnh', [
      {
        text: 'Chụp ảnh',
        onPress: async () => {
          try {
            const response = await launchCamera({
              mediaType: 'photo',
              quality: 0.8,
            });
            if (response.assets && response.assets[0]?.uri) {
              setSelectedImage(response.assets[0].uri);
            }
          } catch (e) {
            console.log('Camera error:', e);
          }
        },
      },
      {
        text: 'Thư viện ảnh',
        onPress: async () => {
          try {
            const response = await launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
              selectionLimit: 1,
            });
            if (response.assets && response.assets[0]?.uri) {
              setSelectedImage(response.assets[0].uri);
            }
          } catch (e) {
            console.log('Library error:', e);
          }
        },
      },
      { text: 'Huỷ', style: 'cancel' },
    ]);
  };

  const handleSend = async () => {
    if ((!inputText.trim() && !selectedImage) || !currentUser) return;

    const currentText = inputText.trim();
    const currentImage = selectedImage;

    // Clear state early to prevent double send
    setInputText('');
    setSelectedImage(null);
    setIsUploading(true);

    try {
      // 1. Handle Image Message if exists
      if (currentImage) {
        // Upload image to backend first
        const fileName = `chat_${Date.now()}.jpg`;
        const uploadResult = await uploadImage(currentImage, fileName);

        const remoteImageUrl = uploadResult.imageUrl;

        const imageMessageData = {
          conversationId: conversationId,
          senderId: currentUser._id,
          image: remoteImageUrl, // Send the URL returned from backend
          text: '', // Empty text for image message
        };

        const optimisticImageMessage: Message = {
          id: 'temp-img-' + Date.now(),
          text: '',
          image: remoteImageUrl,
          isMe: true,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages(prev => [...prev, optimisticImageMessage]);
        SocketService.sendMessage(imageMessageData);
      }

      // 2. Handle Text Message if exists
      if (currentText) {
        // Slight delay if there was an image to preserve order (optional but better)
        if (currentImage) {
          await new Promise<void>(resolve => setTimeout(resolve, 100));
        }

        const textMessageData = {
          conversationId: conversationId,
          senderId: currentUser._id,
          text: currentText,
        };

        const optimisticTextMessage: Message = {
          id: 'temp-txt-' + Date.now(),
          text: currentText,
          isMe: true,
          time: new Date().toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
          }),
        };
        setMessages(prev => [...prev, optimisticTextMessage]);
        SocketService.sendMessage(textMessageData);
      }

      // Scroll to end
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error in handleSend:', error);
      Alert.alert('Lỗi', 'Không thể gửi tin nhắn. Vui lòng thử lại.');
    } finally {
      setIsUploading(false);
    }
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

      {/* Image Preview */}
      {selectedImage && (
        <View style={styles.imagePreviewContainer}>
          <View style={styles.imagePreviewWrapper}>
            <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
            <TouchableOpacity
              style={styles.removeImageButton}
              onPress={() => setSelectedImage(null)}>
              <Icon name="close-circle" size={24} color={Colors.surface} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Input */}
      <View style={styles.inputContainer}>
        <TouchableOpacity style={styles.attachButton} onPress={handleAttachImage}>
          <Icon name="add" size={26} color={Colors.primary} />
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
            (inputText.trim() || selectedImage) ? styles.sendButtonActive : {},
          ]}
          onPress={handleSend}
          disabled={!inputText.trim() && !selectedImage}>
          {(inputText.trim() || selectedImage) && !isUploading ? (
            <Icon
              name="send"
              size={18}
              color="#FFFFFF"
            />
          ) : isUploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Icon
              name="send"
              size={18}
              color={Colors.textMuted}
            />
          )}
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
  imageBubble: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
    backgroundColor: 'transparent',
  },
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
  },
  imageBubbleTime: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    color: '#FFFFFF',
    marginTop: 0,
  },
  imagePreviewContainer: {
    padding: 10,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  imagePreviewWrapper: {
    width: 80,
    height: 80,
    borderRadius: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 12,
  },
});
