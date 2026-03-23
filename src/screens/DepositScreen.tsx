import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { depositCoin, getWalletBalance } from '../service/wallet.service';
import { useFocusEffect } from '@react-navigation/native';

// Conversion rate: 1 VND = 1 F-Coin
const EXCHANGE_RATE = 1;

const packages = [
  { id: '1', vnd: 10000, coins: 10000, bonus: 0 },
  { id: '2', vnd: 20000, coins: 20000, bonus: 2000 }, // 10% bonus
  { id: '3', vnd: 50000, coins: 50000, bonus: 5000 }, // 10% bonus
  { id: '4', vnd: 100000, coins: 100000, bonus: 15000 }, // 15% bonus
  { id: '5', vnd: 200000, coins: 200000, bonus: 40000 }, // 20% bonus
  { id: '6', vnd: 500000, coins: 500000, bonus: 150000 }, // 30% bonus
];

const paymentMethods = [
  { id: 'momo', name: 'Ví MoMo', icon: 'wallet-outline', color: '#A50064' },
  { id: 'vnpay', name: 'VNPay', icon: 'qr-code-outline', color: '#005BAA' },
  { id: 'bank', name: 'Thẻ ATM / Banking', icon: 'card-outline', color: Colors.primary },
];

export default function DepositScreen({ navigation }: any) {
  const [selectedPackage, setSelectedPackage] = useState(packages[1]); // Default 20k
  const [selectedMethod, setSelectedMethod] = useState(paymentMethods[0]);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Fetch real balance when entering the screen
  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchBalance = async () => {
        try {
          const res = await getWalletBalance();
          if (isActive && res.success) {
            setCurrentBalance(res.data.balance);
          }
        } catch (error) {
          console.error("Lỗi lấy số dư:", error);
        }
      };
      fetchBalance();
      return () => { isActive = false; };
    }, [])
  );

  const handleDeposit = async () => {
    const totalCoins = selectedPackage.coins + selectedPackage.bonus;

    try {
      setIsProcessing(true);
      const res = await depositCoin(totalCoins, `Nạp tiền qua ${selectedMethod.name}`);

      if (res.success) {
        Alert.alert('Thành công', `Nạp thành công ${totalCoins.toLocaleString('vi-VN')} F-Coin.`);
        setCurrentBalance(res.data.balance);
      }
    } catch (error: any) {
      Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi nạp tiền');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Nạp F-Coin</Text>
        <TouchableOpacity style={styles.historyBtn}>
          <Icon name="time-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Current Balance Card */}
        <View style={styles.balanceCard}>
          <View style={styles.balanceHeader}>
            <Text style={styles.balanceLabel}>Số dư hiện tại</Text>
            <View style={styles.coinTag}>
              <Icon name="logo-bitcoin" size={14} color="#F59E0B" />
              <Text style={styles.coinTagText}>1 F-Coin = 1đ</Text>
            </View>
          </View>
          <View style={styles.balanceRow}>
            <Text style={styles.balanceAmount}>{currentBalance}</Text>
            <Text style={styles.balanceCurrency}>F-Coin</Text>
          </View>
        </View>

        {/* Package Selection */}
        <Text style={styles.sectionTitle}>Chọn gói nạp</Text>
        <View style={styles.grid}>
          {packages.map((pkg) => {
            const isSelected = selectedPackage.id === pkg.id;
            return (
              <TouchableOpacity
                key={pkg.id}
                style={[styles.packageCard, isSelected && styles.packageCardActive]}
                onPress={() => setSelectedPackage(pkg)}
                activeOpacity={0.7}
              >
                {pkg.bonus > 0 && (
                  <View style={styles.bonusBadge}>
                    <Text style={styles.bonusText}>Thưởng +{pkg.bonus.toLocaleString('vi-VN')}</Text>
                  </View>
                )}
                <View style={styles.packageCoinRow}>
                  <Icon name="logo-bitcoin" size={18} color={isSelected ? '#FFF' : '#F59E0B'} />
                  <Text style={[styles.packageCoinText, isSelected && styles.textWhite]}>
                    {pkg.coins.toLocaleString('vi-VN')}
                  </Text>
                </View>
                <Text style={[styles.packageVndText, isSelected && styles.textWhite]}>
                  {pkg.vnd.toLocaleString('vi-VN')} đ
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Payment Methods */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>
        <View style={styles.methodsContainer}>
          {paymentMethods.map((method) => {
            const isSelected = selectedMethod.id === method.id;
            return (
              <TouchableOpacity
                key={method.id}
                style={[styles.methodCard, isSelected && styles.methodCardActive]}
                onPress={() => setSelectedMethod(method)}
                activeOpacity={0.7}
              >
                <View style={[styles.methodIconWrap, { backgroundColor: method.color + '15' }]}>
                  <Icon name={method.icon} size={24} color={method.color} />
                </View>
                <Text style={styles.methodName}>{method.name}</Text>
                <View style={[styles.radioOuter, isSelected && styles.radioOuterActive]}>
                  {isSelected && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Tổng nhận:</Text>
          <View style={styles.summaryCoin}>
            <Icon name="logo-bitcoin" size={18} color="#F59E0B" />
            <Text style={styles.summaryCoinTotal}>
              {(selectedPackage.coins + selectedPackage.bonus).toLocaleString('vi-VN')} F-Coin
            </Text>
          </View>
          <Text style={styles.summaryPrice}>
            Thanh toán: {selectedPackage.vnd.toLocaleString('vi-VN')}đ
          </Text>
        </View>

        <TouchableOpacity
          style={styles.payBtn}
          onPress={handleDeposit}
          activeOpacity={0.8}
          disabled={isProcessing}
        >
          <Text style={styles.payBtnText}>{isProcessing ? 'Đang xử lý...' : 'Nạp ngay'}</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  historyBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 6,
  },
  balanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '500',
  },
  coinTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  coinTagText: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: '600',
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 6,
  },
  balanceAmount: {
    color: '#FFF',
    fontSize: 36,
    fontWeight: '800',
    lineHeight: 40,
  },
  balanceCurrency: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  packageCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    position: 'relative',
  },
  packageCardActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bonusBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 2,
  },
  bonusText: {
    color: '#FFF',
    fontSize: 10,
    fontWeight: '800',
  },
  packageCoinRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  packageCoinText: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
  },
  packageVndText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  textWhite: {
    color: '#FFF',
  },
  methodsContainer: {
    gap: 12,
  },
  methodCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  methodCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryLight,
  },
  methodIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  methodName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterActive: {
    borderColor: Colors.primary,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  bottomBar: {
    backgroundColor: Colors.surface,
    padding: 16,
    paddingBottom: 30, // Safe area
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 8,
  },
  summaryContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  summaryCoin: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  summaryCoinTotal: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
  },
  summaryPrice: {
    fontSize: 14,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  payBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  payBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
