import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { myPurchases, mySales, Order } from '../data/mockOrders';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + 'đ';
};

const statusColor = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return Colors.warning;
    case 'confirmed':
      return '#3B82F6';
    case 'shipping':
      return Colors.primary;
    case 'completed':
      return Colors.success;
    case 'cancelled':
      return Colors.textMuted;
  }
};

const statusIcon = (status: Order['status']) => {
  switch (status) {
    case 'pending':
      return 'time-outline';
    case 'confirmed':
      return 'checkmark-circle-outline';
    case 'shipping':
      return 'bicycle-outline';
    case 'completed':
      return 'checkmark-done-circle-outline';
    case 'cancelled':
      return 'close-circle-outline';
  }
};

function OrderItem({ order, isSeller }: { order: Order; isSeller: boolean }) {
  return (
    <TouchableOpacity style={styles.orderCard} activeOpacity={0.8}>
      <Image source={{ uri: order.bookImage }} style={styles.orderImage} />
      <View style={styles.orderInfo}>
        <Text style={styles.orderTitle} numberOfLines={1}>
          {order.bookTitle}
        </Text>
        <Text style={styles.orderUser} numberOfLines={1}>
          <Icon name={isSeller ? 'person-outline' : 'storefront-outline'} size={12} color={Colors.textSecondary} />
          {'  '}{isSeller ? `Người mua: ${order.otherUser}` : `Người bán: ${order.otherUser}`}
        </Text>
        <Text style={styles.orderPrice}>{formatPrice(order.price)}</Text>
        <View style={styles.orderBottom}>
          <View style={[styles.statusBadge, { backgroundColor: statusColor(order.status) + '18' }]}>
            <Icon name={statusIcon(order.status)} size={13} color={statusColor(order.status)} />
            <Text style={[styles.statusText, { color: statusColor(order.status) }]}>
              {order.statusLabel}
            </Text>
          </View>
          <Text style={styles.orderDate}>{order.date}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');

  const orders = activeTab === 'purchases' ? myPurchases : mySales;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Đơn hàng</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'purchases' && styles.tabActive]}
          onPress={() => setActiveTab('purchases')}>
          <Icon
            name={activeTab === 'purchases' ? 'bag-handle' : 'bag-handle-outline'}
            size={18}
            color={activeTab === 'purchases' ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'purchases' && styles.tabTextActive]}>
            Đơn mua
          </Text>
          {myPurchases.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {myPurchases.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'sales' && styles.tabActive]}
          onPress={() => setActiveTab('sales')}>
          <Icon
            name={activeTab === 'sales' ? 'pricetag' : 'pricetag-outline'}
            size={18}
            color={activeTab === 'sales' ? Colors.primary : Colors.textMuted}
          />
          <Text style={[styles.tabText, activeTab === 'sales' && styles.tabTextActive]}>
            Đơn bán
          </Text>
          {mySales.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {mySales.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Order List */}
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <OrderItem order={item} isSeller={activeTab === 'sales'} />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Icon name="receipt-outline" size={56} color={Colors.textMuted} />
            <Text style={styles.emptyTitle}>Chưa có đơn hàng</Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === 'purchases'
                ? 'Hãy mua sách để xem đơn hàng tại đây'
                : 'Đăng bán sách để nhận đơn hàng'}
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
    paddingBottom: 14,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -0.5,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
    shadowColor: 'rgba(0,0,0,0.05)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.background,
  },
  tabActive: {
    backgroundColor: '#FFF3E6',
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  tabTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  tabBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 5,
  },
  tabBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  orderCard: {
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
  orderImage: {
    width: 90,
    height: '100%',
    backgroundColor: '#F5F5F5',
  },
  orderInfo: {
    flex: 1,
    padding: 12,
    gap: 4,
  },
  orderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  orderUser: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  orderPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
    marginTop: 2,
  },
  orderBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  orderDate: {
    fontSize: 11,
    color: Colors.textMuted,
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
