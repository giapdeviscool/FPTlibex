import React, { useCallback, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { categories, Book } from '../data/mockBooks';
import BookCard from '../components/BookCard';
import { useFocusEffect } from '@react-navigation/native';
import { getAllSellingBooks } from '../service/book.service';

const { width } = Dimensions.get('window');

export default function HomeScreen({ navigation }: any) {
  const [selectedCategory, setSelectedCategory] = useState('1');
  const [searchText, setSearchText] = useState('');
  const [books, setBooks] = useState<Book[]>([]);

  useFocusEffect(
    useCallback(() => {
      fetchBooks();
      return () => {
        setBooks([]);
      }
    }, [])
  );

  const fetchBooks = async () => {
    const response = await getAllSellingBooks();
    // Handle both { success: true, data: [...] } and direct array
    setBooks(response?.data || response || []);
  };

  const filteredBooks = useMemo(() => {
    if (!books || !Array.isArray(books)) return [];
    return books.filter(book => {
      const matchesCategory =
        selectedCategory === '1' ||
        categories.find(c => c.id === selectedCategory)?.name === book.faculty;
      const matchesSearch =
        !searchText ||
        book.title.toLowerCase().includes(searchText.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [books, selectedCategory, searchText]);
  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      apps: 'apps',
      laptop: 'laptop-outline',
      'trending-up': 'trending-up-outline',
      language: 'globe-outline',
      brush: 'brush-outline',
      megaphone: 'megaphone-outline',
    };
    return iconMap[iconName] || 'book-outline';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Xin chào 👋</Text>
            <Text style={styles.headerTitle}>FPTlibex</Text>
          </View>
          <View style={styles.headerIcons}>
            <TouchableOpacity
              style={styles.iconButton}
              onPress={() => navigation.navigate('Notification')}>
              <Icon name="notifications-outline" size={22} color="#FFF" />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Icon name="search-outline" size={20} color={Colors.textMuted} />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm sách bạn cần..."
            placeholderTextColor={Colors.textMuted}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyContent}>

        {/* Banner */}
        <TouchableOpacity style={styles.banner} activeOpacity={0.9}>
          <View style={styles.bannerContent}>
            <View style={styles.bannerTextContainer}>
              <Text style={styles.bannerTag}>🔥 Hot</Text>
              <Text style={styles.bannerTitle}>Mùa tựu trường</Text>
              <Text style={styles.bannerSubtitle}>
                Giảm đến 70% sách giáo trình
              </Text>
              <View style={styles.bannerButton}>
                <Text style={styles.bannerButtonText}>Xem ngay</Text>
                <Icon name="arrow-forward" size={14} color={Colors.primary} />
              </View>
            </View>
            <View style={styles.bannerIcon}>
              <Icon name="book" size={60} color="rgba(255,255,255,0.3)" />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3E6' }]}>
              <Icon name="book-outline" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.statNumber}>1,234</Text>
              <Text style={styles.statLabel}>Sách đang bán</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
              <Icon name="people-outline" size={20} color={Colors.success} />
            </View>
            <View>
              <Text style={styles.statNumber}>567</Text>
              <Text style={styles.statLabel}>Người bán</Text>
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#E3F2FD' }]}>
              <Icon name="swap-horizontal-outline" size={20} color="#3B82F6" />
            </View>
            <View>
              <Text style={styles.statNumber}>892</Text>
              <Text style={styles.statLabel}>Đã bán</Text>
            </View>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}>
          {categories.map(category => {
            const isActive = selectedCategory === category.id;
            return (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  isActive && styles.categoryChipActive,
                ]}
                onPress={() => setSelectedCategory(category.id)}
                activeOpacity={0.7}>
                <Icon
                  name={getCategoryIcon(category.icon)}
                  size={16}
                  color={isActive ? Colors.textOnPrimary : Colors.primary}
                />
                <Text
                  style={[
                    styles.categoryText,
                    isActive && styles.categoryTextActive,
                  ]}>
                  {category.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Book List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mới đăng</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>Xem tất cả</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.booksGrid}>
          {filteredBooks.map(book => (
            <BookCard
              key={book._id}
              book={book}
              onPress={() => {
                const specificBook = books.find(b => b._id === book._id);
                navigation.navigate('BookDetail', specificBook)
              }}
            />
          ))}
          {filteredBooks.length === 0 && (
            <View style={styles.emptyState}>
              <Icon name="book-outline" size={48} color={Colors.textMuted} />
              <Text style={styles.emptyText}>Chưa có sách trong danh mục này</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontWeight: '500',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    padding: 0,
  },
  filterButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  banner: {
    marginHorizontal: 16,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.primary,
    marginBottom: 16,
  },
  bannerContent: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTag: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 4,
  },
  bannerTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 13,
    marginBottom: 12,
  },
  bannerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
    alignSelf: 'flex-start',
    gap: 4,
  },
  bannerButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  bannerIcon: {
    marginLeft: 12,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.text,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.borderLight,
    marginHorizontal: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
  },
  seeAll: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 20,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#FFF3E6',
    borderWidth: 1.5,
    borderColor: 'transparent',
  },
  categoryChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  categoryTextActive: {
    color: Colors.textOnPrimary,
  },
  booksGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  emptyState: {
    width: width - 32,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
