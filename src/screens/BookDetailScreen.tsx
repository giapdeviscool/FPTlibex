import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { getOrCreateChatRoom } from '../service/chat.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' F-Coin';
};

const conditionColor = (condition: string) => {
  switch (condition) {
    case 'Như mới': return Colors.conditionNew;
    case 'Tốt': return Colors.conditionGood;
    case 'Khá': return Colors.conditionFair;
    case 'Cũ': return Colors.conditionOld;
    default: return Colors.textMuted;
  }
};

export default function BookDetailScreen({ route, navigation }: any) {
  const book = route.params;
  const [isMyBook, setIsMyBook] = React.useState(false);

  React.useEffect(() => {
    const checkOwnership = async () => {
      try {
        const userInfoStr = await AsyncStorage.getItem('user_info');
        if (userInfoStr && book) {
          const userInfo = JSON.parse(userInfoStr);
          // Check if the current user's studentId (or _id) matches the book's seller
          // In some places book.seller is a student code, in others it's an object.
          const sellerId = typeof book.seller === 'object' ? book.seller.studentId || book.seller._id : book.seller;
          const myId = userInfo.studentId || userInfo._id;

          if (sellerId === myId) {
            setIsMyBook(true);
          }
        }
      } catch (error) {
        console.error('Error checking book ownership:', error);
      }
    };

    checkOwnership();
  }, [book]);

  const handleChat = async () => {
    try {
      const userInfoStr = await AsyncStorage.getItem('user_info');
      if (!userInfoStr) {
        Alert.alert('Yêu cầu đăng nhập', 'Vui lòng đăng nhập để chat với người bán');
        navigation.navigate('Auth', { screen: 'Login' });
        return;
      }

      // In a real API response, book.seller might be an object { _id, name } or there's a sellerId.
      // Based on the user's backend spec, we need the "ID_NGUOI_BAN".
      const userInfo = JSON.parse(userInfoStr);
      const recipientStudentCode = book.seller;
      const senderId = userInfo._id;
      const response: any = await getOrCreateChatRoom(recipientStudentCode, senderId, book._id);

      // Handle both wrapped { success: true, data: { _id: ... } } and direct { _id: ... }
      const roomData = response?.data || response;
      if (roomData && roomData._id) {
        navigation.navigate('ChatDetail', {
          conversationId: roomData._id,
          userName: typeof book.seller === 'object' ? book.seller.name : (book.sellerName || book.seller),
          studentId: book.seller.studentId,
          bookTitle: book.title,
          bookPrice: book.price,
          bookId: book._id,
          isOnline: true,
        });
      } else {
        console.warn('Room data not found in response:', response);
      }
    } catch (error) {
      console.error('Error in handleChat:', error);
      Alert.alert('Lỗi', 'Không thể bắt đầu chat');
    }
  };

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Icon name="alert-circle-outline" size={56} color={Colors.textMuted} />
        <Text style={styles.errorText}>Không tìm thấy sách</Text>
        <TouchableOpacity style={styles.errorButton} onPress={() => navigation.goBack()}>
          <Text style={styles.errorButtonText}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const discount = Math.round(
    ((book.originalPrice - book.price) / book.originalPrice) * 100,
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />

      {/* Header overlay */}
      <View style={styles.headerOverlay}>
        <TouchableOpacity style={styles.headerBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={22} color="#FFF" />
        </TouchableOpacity>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="heart-outline" size={22} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerBtn}>
            <Icon name="share-outline" size={22} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Book Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: book.image }} style={styles.bookImage} resizeMode="cover" />
          <View style={styles.imageOverlay} />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Price & Discount */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(book.price)}</Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>-{discount}%</Text>
              </View>
            </View>
            <Text style={styles.originalPrice}>
              Giá gốc: {formatPrice(book.originalPrice)}
            </Text>
          </View>

          {/* Title */}
          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>Tác giả: {book.author}</Text>

          {/* Info Cards */}
          <View style={styles.infoRow}>
            <View style={styles.infoCard}>
              <Icon name="book-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>Tình trạng</Text>
              <View style={[styles.conditionBadge, { backgroundColor: conditionColor(book.condition) }]}>
                <Text style={styles.conditionText}>{book.condition}</Text>
              </View>
            </View>
            <View style={styles.infoCard}>
              <Icon name="grid-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>Danh mục</Text>
              <Text style={styles.infoValue}>{book.faculty}</Text>
            </View>
            <View style={styles.infoCard}>
              <Icon name="time-outline" size={18} color={Colors.primary} />
              <Text style={styles.infoLabel}>Đăng</Text>
              <Text style={styles.infoValue}>{new Date(book.createdAt).toLocaleDateString("vi-VN")}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mô tả</Text>
            <Text style={styles.descriptionText}>
              {book.description}
            </Text>
          </View>

          {/* Seller */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Người bán</Text>
            <View style={styles.sellerCard}>
              <View style={styles.sellerAvatar}>
                {book.seller?.avatar ? (
                  <Image
                    source={{ uri: book.seller.avatar }}
                    style={styles.sellerAvatarImage}
                  />
                ) : (
                  <Text style={styles.sellerAvatarText}>
                    {(typeof book.seller === 'object'
                      ? book.seller?.studentId || book.seller?.name || '?'
                      : String(book.seller) || '?'
                    ).charAt(0).toUpperCase()}
                  </Text>
                )}
              </View>
              <View style={styles.sellerInfo}>
                <Text style={styles.sellerName}>
                  {typeof book.seller === 'object'
                    ? book.seller?.name || book.seller?.studentId || 'Người bán'
                    : book.seller}
                </Text>
                <View style={styles.sellerMeta}>
                  <Icon name="location-outline" size={13} color={Colors.textMuted} />
                  <Text style={styles.sellerMetaText}>FPT University, Hà Nội</Text>
                </View>
                <View style={styles.sellerMeta}>
                  <Icon name="star" size={13} color="#F59E0B" />
                  <Text style={styles.sellerMetaText}>4.8 • 12 sách đã bán</Text>
                </View>
              </View>

            </View>
          </View>

          {/* Safety Tips */}
          <View style={styles.safetyCard}>
            <Icon name="shield-checkmark-outline" size={18} color={Colors.success} />
            <Text style={styles.safetyText}>
              Gặp trực tiếp tại trường để kiểm tra sách trước khi mua
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Bar */}
      {!isMyBook && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.chatButton} onPress={handleChat}>
            <Icon name="chatbubble-outline" size={20} color={Colors.primary} />
            <Text style={styles.chatButtonText}>Chat</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Checkout', {
              bookId: book._id,
              bookTitle: book.title,
              bookPrice: book.price,
              bookImage: book.image,
              sellerName: book.seller
            })}>
            <Icon name="cart-outline" size={20} color="#FFF" />
            <Text style={styles.buyButtonText}>Mua ngay • {formatPrice(book.price)}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: Colors.textMuted,
  },
  errorButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.primary,
    borderRadius: 10,
  },
  errorButtonText: {
    color: '#FFF',
    fontWeight: '700',
  },
  headerOverlay: {
    position: 'absolute',
    top: 40,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    zIndex: 10,
  },
  headerBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 8,
  },
  imageContainer: {
    width: width,
    height: width * 0.85,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  bookImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: 'transparent',
  },
  content: {
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: Colors.background,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 20,
  },
  priceSection: {
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  price: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  discountBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '800',
  },
  originalPrice: {
    fontSize: 14,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
    marginTop: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    lineHeight: 28,
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  infoCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: 14,
    padding: 12,
    alignItems: 'center',
    gap: 6,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
  },
  conditionBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
  },
  conditionText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '700',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 10,
  },
  descriptionText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  sellerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 14,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 1,
  },
  sellerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    overflow: 'hidden',
  },
  sellerAvatarImage: {
    width: 48,
    height: 48,
    borderRadius: 14,
  },
  sellerAvatarText: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
  },
  sellerInfo: {
    flex: 1,
    gap: 3,
  },
  sellerName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  sellerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sellerMetaText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  viewProfileBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFF3E6',
  },
  viewProfileText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  safetyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
  },
  safetyText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
    flex: 1,
  },
  bottomBar: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 30,
    backgroundColor: Colors.surface,
    gap: 10,
    shadowColor: 'rgba(0,0,0,0.08)',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 8,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    backgroundColor: '#FFF3E6',
  },
  chatButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  buyButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buyButtonText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
