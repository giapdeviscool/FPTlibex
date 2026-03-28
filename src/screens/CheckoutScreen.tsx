import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { createOrder } from '../service/order.service';
import { getWalletBalance } from '../service/wallet.service';
import { useFocusEffect } from '@react-navigation/native';

const formatPrice = (price: number) => {
  return price.toLocaleString('vi-VN') + ' F-Coin';
};

export default function CheckoutScreen({ route, navigation }: any) {
  const { bookId, bookTitle, bookPrice, bookImage, sellerId, sellerName } = route.params || {};

  const [balance, setBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const isEnoughBalance = balance >= (Number(bookPrice) || 0);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchBalance = async () => {
        try {
          const res = await getWalletBalance();
          if (isActive) {
            setBalance(res.balance);
          }
        } catch (error) {
          console.error("Lỗi lấy số dư:", error);
        }
      };
      fetchBalance();
      return () => { isActive = false; };
    }, [])
  );

  const handleCheckout = () => {
    if (!isEnoughBalance) {
      Alert.alert('Số dư không đủ', 'Vui lòng nạp thêm F-Coin để tiếp tục mua sách.');
      return;
    }

    Alert.alert(
      'Xác nhận thanh toán',
      `Bạn có chắc chắn muốn dùng ${formatPrice(Number(bookPrice))} để mua "${bookTitle}"?`,
      [
        { text: 'Hủy bỏ', style: 'cancel' },
        {
          text: 'Thanh toán',
          onPress: async () => {
            try {
              setIsProcessing(true);
              const userInfo = await AsyncStorage.getItem('user_info');
              if (!userInfo) {
                Alert.alert('Lỗi', 'Vui lòng đăng nhập lại để tiếp tục');
                return;
              }

              const user = JSON.parse(userInfo);

              const response = await createOrder({
                bookId: bookId,
                buyer: user.studentId,
                seller: sellerId
              });
              console.log("order : ", response)
              Alert.alert(
                'Thành công! 🎉',
                'Đơn hàng của bạn đang được xử lý.',
                [
                  {
                    text: 'Xem đơn hàng',
                    onPress: () => navigation.navigate('MainTabs', { screen: 'Orders' })
                  }
                ]
              );
            } catch (error: any) {
              console.error('Create Order Error:', error);
              Alert.alert(
                'Lỗi',
                error.response?.data?.message || error.message || 'Không thể tạo đơn hàng'
              );
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Delivery Address (Mock) */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="location" size={20} color={Colors.primary} />
            <Text style={styles.sectionTitle}>Địa chỉ nhận sách</Text>
          </View>
          <View style={styles.addressBox}>
            <Text style={styles.userName}>Nguyễn Văn A • 0987654321</Text>
            <Text style={styles.userAddress}>Phòng 201, Tòa nhà Alpha, Đại học FPT Hà Nội</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Icon name="storefront-outline" size={18} color={Colors.textSecondary} />
            <Text style={styles.sellerName}>{sellerName || 'Người bán'}</Text>
          </View>

          <View style={styles.itemCard}>
            <Image source={{ uri: bookImage }} style={styles.itemImage} resizeMode="cover" />
            <View style={styles.itemInfo}>
              <Text style={styles.itemTitle} numberOfLines={2}>{bookTitle}</Text>
              <Text style={styles.itemPrice}>{formatPrice(Number(bookPrice))}</Text>
            </View>
          </View>

          <View style={styles.noteBox}>
            <Text style={styles.noteLabel}>Lưu ý cho người bán:</Text>
            <Text style={styles.noteText} numberOfLines={1}>Để lại lời nhắn (Không bắt buộc)</Text>
          </View>
        </View>

        {/* Payment Summary */}
        <View style={styles.section}>
          <Text style={styles.summaryTitle}>Chi tiết thanh toán</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Tiền sách</Text>
            <Text style={styles.summaryValue}>{formatPrice(Number(bookPrice))}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Phí giao dịch (0%)</Text>
            <Text style={styles.summaryValue}>0 F-Coin</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán</Text>
            <Text style={styles.totalValue}>{formatPrice(Number(bookPrice))}</Text>
          </View>
        </View>

        {/* Current Balance */}
        <View style={styles.balanceBox}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceLeft}>
              <Icon name="wallet" size={22} color={Colors.primary} />
              <Text style={styles.balanceLabel}>Số dư ví F-Coin </Text>
            </View>
            <Text style={styles.balanceAmount}>{formatPrice(balance)}</Text>
          </View>
          {!isEnoughBalance && (
            <Text style={styles.errorText}>Số dư không đủ. Vui lòng nạp thêm.</Text>
          )}
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomTotal}>
          <Text style={styles.bottomTotalLabel}>Tổng thanh toán</Text>
          <Text style={styles.bottomTotalValue}>{formatPrice(Number(bookPrice))}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutBtn, (!isEnoughBalance || isProcessing) && styles.checkoutBtnDisabled]}
          onPress={handleCheckout}
          activeOpacity={0.8}
          disabled={!isEnoughBalance || isProcessing}>
          <Text style={styles.checkoutBtnText}>{isProcessing ? 'ĐANG XỬ LÝ...' : 'ĐẶT HÀNG'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6', // Lighter gray for background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingTop: 46,
    paddingBottom: 14,
    paddingHorizontal: 16,
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  content: {
    padding: 16,
    gap: 16,
    paddingBottom: 40,
  },
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    shadowColor: 'rgba(0,0,0,0.03)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 6,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  addressBox: {
    marginTop: 4,
  },
  userName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  userAddress: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  sellerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  itemImage: {
    width: 60,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    marginRight: 12,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 6,
  },
  itemPrice: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primary,
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  noteLabel: {
    fontSize: 13,
    color: Colors.text,
    marginRight: 8,
  },
  noteText: {
    fontSize: 13,
    color: Colors.textMuted,
    flex: 1,
    textAlign: 'right',
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  balanceBox: {
    backgroundColor: '#FFF3E6',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  balanceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  errorText: {
    fontSize: 13,
    color: Colors.error,
    marginTop: 8,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 30, // For iOS home indicator
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  bottomTotal: {
    flex: 1,
  },
  bottomTotalLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  bottomTotalValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 140,
  },
  checkoutBtnDisabled: {
    backgroundColor: Colors.textMuted,
  },
  checkoutBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
