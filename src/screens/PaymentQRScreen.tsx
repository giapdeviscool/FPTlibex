import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';

export default function PaymentQRScreen({ route, navigation }: any) {
  // Get params passed from DepositScreen, with fallback defaults
  const { 
    amountStr = '20.000', 
    coins = 20000, 
    bonus = 2000, 
    methodName = 'Ví MoMo' 
  } = route.params || {};

  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds

  useEffect(() => {
    // Timer countdown
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          Alert.alert('Hết hạn', 'Mã QR đã hết hạn thanh toán.', [
            { text: 'Đóng', onPress: () => navigation.goBack() }
          ]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigation]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    // Mock success payment
    Alert.alert(
      'Thanh toán thành công',
      `Bạn đã thanh toán ${amountStr} F-Coin.\n${coins + bonus} F-Coin đã được cộng vào ví của bạn!`,
      [{ text: 'Về trang chủ', onPress: () => navigation.navigate('MainTabs') }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="close" size={28} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thanh toán {methodName}</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.content}>
        <Text style={styles.instructions}>
          Quét mã QR dưới đây bằng ứng dụng <Text style={styles.bold}>{methodName}</Text> hoặc ứng dụng Ngân hàng để hoàn tất thanh toán.
        </Text>

        <View style={styles.qrCard}>
          <Text style={styles.merchantName}>FPTlibex - Mua bán giáo trình</Text>
          <Text style={styles.amount}>{amountStr} F-Coin</Text>
          
          <View style={styles.qrContainer}>
            {/* Using a placeholder mock QR code image URL */}
            <Image 
              source={{ uri: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=MockPaymentForFPTLibex' }}
              style={styles.qrImage}
            />
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Nội dung chuyển khoản</Text>
            <View style={styles.codeContainer}>
              <Text style={styles.codeText}>NAP SE123456</Text>
              <TouchableOpacity style={styles.copyBtn}>
                <Icon name="copy-outline" size={16} color={Colors.primary} />
                <Text style={styles.copyText}>Copy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.timerContainer}>
          <Text style={styles.timerLabel}>Mã QR sẽ hết hạn sau:</Text>
          <Text style={[styles.timerValue, timeLeft < 60 && styles.timerDanger]}>
            {formatTime(timeLeft)}
          </Text>
        </View>
      </View>

      {/* Mock Button to simulate completed payment */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.simulateBtn}
          onPress={handleSimulatePayment}
          activeOpacity={0.8}>
          <Text style={styles.simulateBtnText}>Giả lập thanh toán thành công</Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
  },
  instructions: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  bold: {
    fontWeight: '700',
    color: Colors.text,
  },
  qrCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 32,
  },
  merchantName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  amount: {
    fontSize: 32,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: 24,
  },
  qrContainer: {
    width: 220,
    height: 220,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: 32,
  },
  qrImage: {
    width: '100%',
    height: '100%',
  },
  infoRow: {
    width: '100%',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 13,
    color: Colors.textMuted,
    marginBottom: 8,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 12,
  },
  codeText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: 1,
  },
  copyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  copyText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  timerContainer: {
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  timerValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  timerDanger: {
    color: Colors.error,
  },
  bottomBar: {
    padding: 24,
    paddingBottom: 40,
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  simulateBtn: {
    backgroundColor: '#10B981', // Green for success simulate
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  simulateBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
