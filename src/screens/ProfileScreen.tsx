import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import SocketService from '../service/socket.service';
import { getWalletBalance } from '../service/wallet.service';
import { useFocusEffect } from '@react-navigation/native';

const menuItems = [
  {
    id: 'deposit',
    icon: 'logo-bitcoin',
    title: 'Nạp F-Coin',
    color: '#F59E0B', // Yellow/Gold
    route: 'Deposit',
  },
  {
    id: 'withdraw',
    icon: 'cash-outline',
    title: 'Rút tiền',
    color: '#10B981', // Green
    route: 'Withdraw',
  },
  {
    id: 'edit_profile',
    icon: 'person-outline',
    title: 'Chỉnh sửa hồ sơ',
    color: '#3B82F6', // Blue
    route: 'EditProfile',
  },
  {
    id: '2',
    icon: 'bookmark-outline',
    title: 'Sách đã lưu',
    color: '#8B5CF6', // Purple
  },
];

export default function ProfileScreen({ navigation }: any) {
  const [user, setUser] = React.useState<any>('');
  const [balance, setBalance] = React.useState(0);

  const loadData = async () => {
    const userInfo = await AsyncStorage.getItem('user_info');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    try {
      const res = await getWalletBalance();
      if (res.success) {
        console.log("hic", res.balance)
        setBalance(res.balance);
      }
    } catch (error) {
      console.log('Error fetching balance:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: 'Hủy', style: 'cancel' },
      {
        text: 'Đăng xuất',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('user_token');
          await AsyncStorage.removeItem('user_info');
          SocketService.disconnect();
          navigation.replace('Auth', { screen: 'Login' });
        },
      },
    ]);
  };
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hồ sơ</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* User Info Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarContainer}>
            {user?.avatar ? (
              <Image
                source={{ uri: user.avatar }}
                style={styles.avatar}
              />
            ) : (
              <View style={[styles.avatar, styles.avatarFallback]}>
                <Text style={styles.avatarFallbackText}>
                  {(user?.name || '?').charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
            <View style={styles.verifiedBadge}>
              <Icon name="checkmark" size={10} color="#FFF" />
            </View>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Nguyễn Văn A'}</Text>
            <Text style={styles.userEmail}>{user?.studentId || 'SE172344'}</Text>
            <View style={styles.tag}>
              <Text style={styles.tagText}>Sinh viên FPTU HN</Text>
            </View>
          </View>
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>12</Text>
            <Text style={styles.statLabel}>Đã bán</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>3</Text>
            <Text style={styles.statLabel}>Đang bán</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={styles.ratingWrap}>
              <Text style={styles.statValue}>4.8</Text>
              <Icon name="star" size={16} color="#F59E0B" />
            </View>
            <Text style={styles.statLabel}>Đánh giá</Text>
          </View>
        </View>

        {/* Wallet Balance */}
        <View style={styles.walletContainer}>
          <View style={styles.walletLeft}>
            <Icon name="wallet" size={24} color={Colors.primary} />
            <Text style={styles.walletLabel}>Số dư ví F-Coin</Text>
          </View>
          <Text style={styles.walletBalance}>{balance.toLocaleString('vi-VN')}</Text>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <React.Fragment key={item.id}>
              <TouchableOpacity
                style={styles.menuItem}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.route) {
                    navigation.navigate(item.route);
                  }
                }}
              >
                <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                  <Icon name={item.icon} size={20} color={item.color} />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Icon name="chevron-forward" size={20} color={Colors.border} />
              </TouchableOpacity>
              {index < menuItems.length - 1 && <View style={styles.menuDivider} />}
            </React.Fragment>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.8}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Phiên bản 1.0.0</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.borderLight,
  },
  avatarFallback: {
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarFallbackText: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.primary,
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 2,
  },
  ratingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  menuContainer: {
    backgroundColor: Colors.surface,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 24,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  walletContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF3E6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(239, 137, 34, 0.3)',
  },
  walletLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
  },
  walletBalance: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  menuIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  menuTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  menuDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 50,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 14,
    paddingVertical: 16,
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.error,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 13,
    color: Colors.textMuted,
  },
});
