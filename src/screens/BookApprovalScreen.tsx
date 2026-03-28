import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { getPendingBooks, approveBook, rejectBook } from '../service/admin.service';

export default function BookApprovalScreen({ navigation }: any) {
  const [books, setBooks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchPendingBooks = async () => {
    try {
      setLoading(true);
      const res = await getPendingBooks();
      if (res.success) {
        setBooks(res.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách sách chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchPendingBooks();
  }, []);

  const handleApprove = (book: any) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có đồng ý phê duyệt sách "${book.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Phê duyệt', 
          onPress: async () => {
            try {
              const res = await approveBook(book._id);
              if (res.success) {
                fetchPendingBooks();
                Alert.alert('Thành công', 'Đã phê duyệt sách');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể phê duyệt');
            }
          }
        }
      ]
    );
  };

  const handleReject = (book: any) => {
    Alert.alert(
      'Xác nhận',
      `Bạn có muốn từ chối phê duyệt sách "${book.title}"?`,
      [
        { text: 'Hủy', style: 'cancel' },
        { 
          text: 'Từ chối', 
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await rejectBook(book._id);
              if (res.success) {
                fetchPendingBooks();
                Alert.alert('Thành công', 'Đã từ chối duyệt sách');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể từ chối');
            }
          }
        }
      ]
    );
  };

  const renderBookItem = ({ item }: { item: any }) => (
    <View style={styles.bookCard}>
      <Image source={{ uri: item.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor}>{item.author}</Text>
        <Text style={styles.bookPrice}>{item.price.toLocaleString('vi-VN')} F-Coin</Text>
        <View style={styles.sellerInfo}>
          <Icon name="person-outline" size={14} color={Colors.textSecondary} />
          <Text style={styles.sellerName}>{item.seller?.name || 'Vô danh'}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.approveBtn]} 
            onPress={() => handleApprove(item)}
          >
            <Text style={styles.actionText}>Duyệt</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.actionButton, styles.rejectBtn]} 
            onPress={() => handleReject(item)}
          >
            <Text style={styles.actionText}>Từ chối</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Phê duyệt sách</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchPendingBooks}>
          <Icon name="refresh-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item._id}
          renderItem={renderBookItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Icon name="checkmark-done-circle-outline" size={64} color={Colors.border} />
              <Text style={styles.emptyText}>Tuyệt vời! Không có sách nào đang chờ duyệt.</Text>
            </View>
          }
        />
      )}
    </View>
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
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  listContent: {
    padding: 16,
    paddingBottom: 30,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    marginBottom: 16,
    padding: 12,
    elevation: 3,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
  },
  bookImage: {
    width: 100,
    height: 140,
    borderRadius: 8,
    marginRight: 16,
  },
  bookInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 8,
  },
  sellerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 4,
  },
  sellerName: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  approveBtn: {
    backgroundColor: Colors.success,
  },
  rejectBtn: {
    backgroundColor: Colors.error,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: Colors.textMuted,
    fontSize: 14,
    maxWidth: '80%',
  },
});
