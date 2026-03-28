import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors } from '../theme/colors';
import Icon from 'react-native-vector-icons/Ionicons';
import { withdrawCoin, getWalletBalance } from '../service/wallet.service';
import { useFocusEffect } from '@react-navigation/native';

// 1 F-Coin = 1 VND
const MIN_WITHDRAW = 50000;

export default function WithdrawScreen({ navigation }: any) {
  const [amountStr, setAmountStr] = useState('');
  const [bankName, setBankName] = useState('TPBank');
  const [accountNumber, setAccountNumber] = useState('0987654321');
  const [accountName, setAccountName] = useState('NGUYEN VAN A');
  const [isProcessing, setIsProcessing] = useState(false);

  const [currentBalance, setCurrentBalance] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const fetchBalance = async () => {
        try {
          const res = await getWalletBalance();
          if (isActive) {
            setCurrentBalance(res.balance);
          }
        } catch (error) {
          console.error("Lỗi lấy số dư:", error);
        }
      };
      fetchBalance();
      return () => { isActive = false; };
    }, [])
  );

  const amount = parseInt(amountStr.replace(/\D/g, ''), 10) || 0;
  const handleWithdraw = () => {
    if (amount < MIN_WITHDRAW) {
      Alert.alert('Lỗi', `Số tiền rút tối thiểu là ${MIN_WITHDRAW.toLocaleString('vi-VN')} F-Coin`);
      return;
    }
    if (amount > currentBalance) {
      Alert.alert('Lỗi', 'Số dư không đủ để thực hiện giao dịch này.');
      return;
    }

    Alert.alert(
      'Xác nhận rút tiền',
      `Bạn yêu cầu rút ${amount.toLocaleString('vi-VN')} F-Coin về tài khoản:\n\nNgân hàng: ${bankName}\nSTK: ${accountNumber}\nTên: ${accountName}\n\n(Tính năng gọi API thật)`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              setIsProcessing(true);
              const res = await withdrawCoin(amount, `${bankName} - ${accountNumber} - ${accountName}`);

              if (res) {
                Alert.alert(
                  'Thành công',
                  'Yêu cầu rút tiền của bạn đang được xử lý. Tiền sẽ được chuyển vào tài khoản trong thời gian sớm nhất.'
                );
                setCurrentBalance(res.balance);
                setAmountStr('');
              }
            } catch (error: any) {
              Alert.alert('Lỗi', error.response?.data?.message || 'Có lỗi xảy ra khi rút tiền');
            } finally {
              setIsProcessing(false);
            }
          }
        }
      ]
    );
  };
  const setMaxAmount = () => {
    setAmountStr(currentBalance.toString());
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Rút tiền</Text>
        <TouchableOpacity style={styles.historyBtn}>
          <Icon name="time-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Balance Info */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Số dư khả dụng</Text>
          <View style={styles.balanceRow}>
            <View style={styles.coinIconWrap}>
              <Icon name="logo-bitcoin" size={18} color="#F59E0B" />
            </View>
            <Text style={styles.balanceAmount}>{currentBalance.toLocaleString('vi-VN')}</Text>
          </View>
        </View>

        {/* Withdrawal Amount */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Số F-Coin cần rút</Text>
          <View style={styles.inputWrapper}>
            <Text style={styles.currencyPrefix}>F</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.border}
              keyboardType="number-pad"
              value={amountStr}
              onChangeText={setAmountStr}
            />
            <TouchableOpacity style={styles.maxBtn} onPress={setMaxAmount}>
              <Text style={styles.maxBtnText}>Tối đa</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.hintText}>
            Tối thiểu: {MIN_WITHDRAW.toLocaleString('vi-VN')} F-Coin
          </Text>
        </View>

        {/* Bank Details */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardTitle}>Tài khoản nhận tiền</Text>
            <TouchableOpacity>
              <Text style={styles.editBtnText}>Thay đổi</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bankCard}>
            <View style={styles.bankIconWrap}>
              <Icon name="business-outline" size={24} color="#8B5CF6" />
            </View>
            <View style={styles.bankInfo}>
              <Text style={styles.bankName}>{bankName}</Text>
              <Text style={styles.accountNumber}>STK: {accountNumber}</Text>
              <Text style={styles.accountName}>{accountName}</Text>
            </View>
          </View>
        </View>

      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>Thực nhận (F-Coin):</Text>
          <Text style={styles.summaryEarn}>
            {amount.toLocaleString('vi-VN')} F-Coin
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!amount || amount < MIN_WITHDRAW || amount > currentBalance) && styles.submitBtnDisabled
          ]}
          onPress={handleWithdraw}
          disabled={!amount || amount < MIN_WITHDRAW || amount > currentBalance || isProcessing}
          activeOpacity={0.8}
        >
          <Text style={styles.submitBtnText}>{isProcessing ? 'Đang xử lý...' : 'Rút tiền'}</Text>
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
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
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
    gap: 16,
  },
  balanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(239, 137, 34, 0.2)', // Light primary color
  },
  balanceLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  coinIconWrap: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  balanceAmount: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  card: {
    backgroundColor: Colors.surface,
    padding: 20,
    borderRadius: 20,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  editBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary,
    paddingBottom: 8,
    marginBottom: 12,
  },
  currencyPrefix: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    fontWeight: '800',
    color: Colors.text,
    padding: 0,
    height: 48,
  },
  maxBtn: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  maxBtnText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  hintText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  bankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  bankIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EDE9FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  bankInfo: {
    flex: 1,
    gap: 2,
  },
  bankName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.text,
  },
  accountNumber: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  accountName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  summaryLabel: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  summaryEarn: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.success,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitBtnDisabled: {
    backgroundColor: Colors.border,
  },
  submitBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
