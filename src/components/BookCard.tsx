import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Colors } from '../theme/colors';
import type { Book } from '../data/mockBooks';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface BookCardProps {
  book: Book;
  onPress?: () => void;
}

const conditionColor = (condition: Book['condition']) => {
  switch (condition) {
    case 'Như mới':
      return Colors.conditionNew;
    case 'Tốt':
      return Colors.conditionGood;
    case 'Khá':
      return Colors.conditionFair;
    case 'Cũ':
      return Colors.conditionOld;
  }
};

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' F-Coin';
};

const getDiscount = (price: number, originalPrice: number) => {
  return Math.round(((originalPrice - price) / originalPrice) * 100);
};

export default function BookCard({ book, onPress }: BookCardProps) {
  const discount = getDiscount(book.price, book.originalPrice);

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}>
      {/* Book Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.image }}
          style={styles.image}
          resizeMode="cover"
        />
        {/* Discount badge */}
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>-{discount}%</Text>
        </View>
        {/* Condition badge */}
        <View
          style={[
            styles.conditionBadge,
            { backgroundColor: conditionColor(book.condition) },
          ]}>
          <Text style={styles.conditionText}>{book.condition}</Text>
        </View>
      </View>

      {/* Book Info */}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>
          {book.title}
        </Text>
        <Text style={styles.author} numberOfLines={1}>
          {book.author}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>{formatPrice(book.price)}</Text>
          <Text style={styles.originalPrice}>
            {formatPrice(book.originalPrice)}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.sellerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {book.seller.charAt(0)}
              </Text>
            </View>
            <Text style={styles.sellerName} numberOfLines={1}>
              {book.seller}
            </Text>
          </View>
          <Text style={styles.time}>{book.postedAt}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 1.1,
    backgroundColor: '#F5F5F5',
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  discountText: {
    color: Colors.textOnPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  conditionBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  info: {
    padding: 12,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.text,
    lineHeight: 18,
    marginBottom: 2,
  },
  author: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 11,
    color: Colors.textMuted,
    textDecorationLine: 'line-through',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sellerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 4,
  },
  avatar: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: Colors.textOnPrimary,
    fontSize: 10,
    fontWeight: '700',
  },
  sellerName: {
    fontSize: 10,
    color: Colors.textSecondary,
    flex: 1,
  },
  time: {
    fontSize: 10,
    color: Colors.textMuted,
  },
});
