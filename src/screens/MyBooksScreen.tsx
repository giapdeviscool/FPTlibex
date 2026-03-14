import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { myPostedBooks } from '../data/myBooks';
import type { Book } from '../data/mockBooks';

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

function MyBookItem({
  book,
  onEdit,
  onDelete,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <View style={styles.bookCard}>
      <Image source={{ uri: book.image }} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={1}>
          {book.title}
        </Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>
          {book.author}
        </Text>
        <Text style={styles.bookPrice}>{formatPrice(book.price)}</Text>
        <View style={styles.bookMeta}>
          <View
            style={[
              styles.conditionBadge,
              { backgroundColor: conditionColor(book.condition) },
            ]}>
            <Text style={styles.conditionText}>{book.condition}</Text>
          </View>
          <Text style={styles.bookTime}>{book.postedAt}</Text>
        </View>
      </View>
      <View style={styles.bookActions}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Icon name="create-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Icon name="trash-outline" size={18} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function MyBooksScreen({ navigation }: any) {
  const [books, setBooks] = useState<Book[]>(myPostedBooks);

  const handleDelete = (bookId: string, bookTitle: string) => {
    Alert.alert('Xoá sách', `Bạn có chắc muốn xoá "${bookTitle}"?`, [
      { text: 'Huỷ', style: 'cancel' },
      {
        text: 'Xoá',
        style: 'destructive',
        onPress: () => setBooks(prev => prev.filter(b => b.id !== bookId)),
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Sách của tôi</Text>
        <Text style={styles.headerSubtitle}>{books.length} sách đang bán</Text>
      </View>

      {/* Book List */}
      <FlatList
        data={books}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <MyBookItem
            book={item}
            onEdit={() =>
              navigation.navigate('EditBook', {
                bookId: item.id,
                title: item.title,
                author: item.author,
                price: String(item.price),
                originalPrice: String(item.originalPrice),
                condition: item.condition,
                faculty: item.faculty,
                image: item.image,
              })
            }
            onDelete={() => handleDelete(item.id, item.title)}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="book-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa đăng sách nào</Text>
            <Text style={styles.emptySubtitle}>
              Bấm nút bên dưới để đăng bán sách
            </Text>
          </View>
        }
      />

      {/* FAB - Post new book */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('SellBook')}>
        <Icon name="add" size={28} color="#FFF" />
      </TouchableOpacity>
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
    paddingBottom: 14,
    paddingHorizontal: 20,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  bookImage: {
    width: 85,
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  bookInfo: {
    flex: 1,
    padding: 12,
    gap: 3,
  },
  bookTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  bookAuthor: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  bookPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  bookMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  conditionBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  conditionText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
  },
  bookTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bookActions: {
    justifyContent: 'center',
    gap: 8,
    paddingRight: 12,
  },
  editBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
});
