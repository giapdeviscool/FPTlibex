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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { Colors } from '../theme/colors';
import { Order } from '../data/mockOrders';
import { getOrdersByUserId, updateOrderStatus } from '../service/order.service';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' F-Coin';
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

function OrderItem({
  order,
  isSeller,
  onAction
}: {
  order: Order;
  isSeller: boolean;
  onAction: (orderId: string, newStatus: Order['status'], newLabel: string) => void;
}) {
  return (
    <View style={styles.orderCardWrap}>
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

      {/* Action Buttons based on status & role */}
      {isSeller && order.status === 'pending' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnOutline]}
            onPress={() => onAction(order.id, 'cancelled', 'Đã huỷ')}>
            <Text style={styles.actionBtnTextOutline}>Từ chối</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => onAction(order.id, 'confirmed', 'Đã xác nhận')}>
            <Text style={styles.actionBtnTextPrimary}>Xác nhận đơn</Text>
          </TouchableOpacity>
        </View>
      )}

      {isSeller && order.status === 'confirmed' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPrimary]}
            onPress={() => onAction(order.id, 'shipping', 'Đang giao')}>
            <Text style={styles.actionBtnTextPrimary}>Đã giao sách</Text>
          </TouchableOpacity>
        </View>
      )}

      {!isSeller && order.status === 'shipping' && (
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnSuccess]}
            onPress={() => onAction(order.id, 'completed', 'Hoàn thành')}>
            <Text style={styles.actionBtnTextPrimary}>Đã nhận được sách</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

export default function OrderScreen() {
  const [activeTab, setActiveTab] = useState<'purchases' | 'sales'>('purchases');
  const [purchases, setPurchases] = useState<Order[]>([]);
  const [sales, setSales] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const userInfo = await AsyncStorage.getItem('user_info');
      if (!userInfo) return;

      const user = JSON.parse(userInfo);
      const response = await getOrdersByUserId(user.studentId);

      // The backend response is an array of orders.
      // We need to map them to our Order interface.
      // Note: Assuming the backend returns populated book and user objects or enough info to map.
      // If the backend returns raw IDs, we'd need more logic here.

      const allOrders: Order[] = response.map((item: any) => ({
        id: item._id,
        bookId: item.book?._id || item.book,
        bookTitle: item.book?.title || 'Sách không còn tồn tại',
        bookImage: item.book?.image || '',
        price: item.book?.price || 0,
        status: item.status,
        statusLabel: item.statusLabel,
        // If the current user is the buyer, the "other user" is the seller.
        otherUser: item.buyer?.studentId === user.studentId
          ? (item.seller?.name || item.seller)
          : (item.buyer?.name || item.buyer),
        date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
        isBuyer: item.buyer?.studentId === user.studentId
      }));

      setPurchases(allOrders.filter((o: any) => o.isBuyer));
      setSales(allOrders.filter((o: any) => !o.isBuyer));
    } catch (error) {
      console.error('Fetch Orders Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchOrders();
    }, [])
  );

  const handleAction = async (orderId: string, newStatus: Order['status'], newLabel: string) => {
    try {
      await updateOrderStatus(orderId, newStatus, newLabel);

      // Update local state after successful API call
      if (activeTab === 'purchases') {
        setPurchases(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, statusLabel: newLabel } : o));
      } else {
        setSales(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus, statusLabel: newLabel } : o));
      }

      Alert.alert('Thành công', 'Trạng thái đơn hàng đã được cập nhật');
    } catch (error: any) {
      console.error('Update Order Status Error:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể cập nhật trạng thái đơn hàng'
      );
    }
  };

  const orders = activeTab === 'purchases' ? purchases : sales;

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
          {purchases.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {purchases.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
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
          {sales.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length > 0 && (
            <View style={styles.tabBadge}>
              <Text style={styles.tabBadgeText}>
                {sales.filter(o => o.status !== 'completed' && o.status !== 'cancelled').length}
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
          <OrderItem
            order={item}
            isSeller={activeTab === 'sales'}
            onAction={handleAction}
          />
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
  orderCardWrap: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 0, // using gap from listContent
  },
  orderCard: {
    flexDirection: 'row',
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
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 12,
    paddingBottom: 12,
    paddingTop: 8,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  actionBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionBtnOutline: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
  },
  actionBtnSuccess: {
    backgroundColor: Colors.success,
  },
  actionBtnTextOutline: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  actionBtnTextPrimary: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
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
