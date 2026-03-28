import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { getAdminStats, getPendingBooks } from '../service/admin.service';
import SocketService from '../service/socket.service';

const { width } = Dimensions.get('window');

export default function AdminScreen({ navigation }: any) {
  const [stats, setStats] = React.useState([
    { id: '1', label: 'Người dùng', value: '...', icon: 'people', color: '#3B82F6' },
    { id: '2', label: 'Sách đang bán', value: '...', icon: 'book', color: '#10B981' },
    { id: '3', label: 'Sách đã bán', value: '...', icon: 'checkmark-circle', color: '#8B5CF6' },
    { id: '4', label: 'Doanh thu', value: '...', icon: 'stats-chart', color: '#F59E0B' },
  ]);
  const [pendingBooks, setPendingBooks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const statsRes = await getAdminStats();
      if (statsRes.success) {
        setStats([
          { id: '1', label: 'Người dùng', value: statsRes.data.totalUsers.toString(), icon: 'people', color: '#3B82F6' },
          { id: '2', label: 'Sách đang bán', value: statsRes.data.totalBooksSelling.toString(), icon: 'book', color: '#10B981' },
          { id: '3', label: 'Sách đã bán', value: statsRes.data.totalBooksSold.toString(), icon: 'checkmark-circle', color: '#8B5CF6' },
          { id: '4', label: 'Doanh thu', value: (statsRes.data.totalRevenue / 1000).toFixed(1) + 'k', icon: 'stats-chart', color: '#F59E0B' },
        ]);
      }

      const booksRes = await getPendingBooks();
      if (booksRes.success) {
        setPendingBooks(booksRes.data);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Đăng xuất', 'Xác nhận đăng xuất quyền quản trị?', [
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

  React.useEffect(() => {
    fetchData();
  }, []);
  const managementOptions = [
    {
      id: 'users',
      title: 'Quản lý người dùng',
      description: 'Xem, khóa hoặc mở khóa tài khoản',
      icon: 'people-circle-outline',
      color: '#3B82F6',
    },
    {
      id: 'orders',
      title: 'Quản lý đơn hàng',
      description: 'Theo dõi tình trạng các giao dịch',
      icon: 'receipt-outline',
      color: '#F59E0B',
    },
    {
      id: 'reports',
      title: 'Báo cáo & Khiếu nại',
      description: 'Xem các báo cáo vi phạm từ người dùng',
      icon: 'warning-outline',
      color: '#EF4444',
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleLogout}
        >
          <Icon name="log-out-outline" size={24} color={Colors.error} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản trị hệ thống</Text>
        <TouchableOpacity style={styles.headerRight} onPress={fetchData}>
          <Icon name="refresh" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>Chào buổi chiều, Admin!</Text>
          <Text style={styles.welcomeSub}>Dưới đây là tóm tắt hoạt động hệ thống hôm nay.</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {stats.map((item) => (
            <View key={item.id} style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: item.color + '15' }]}>
                <Icon name={item.icon} size={22} color={item.color} />
              </View>
              <Text style={styles.statValue}>{item.value}</Text>
              <Text style={styles.statLabel}>{item.label}</Text>
            </View>
          ))}
        </View>

        {/* Management Links */}
        <Text style={styles.sectionTitle}>Chức năng quản lý</Text>
        <View style={styles.menuContainer}>
          {managementOptions.map((item: any) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              activeOpacity={0.7}
              onPress={() => {
                if (item.id === 'users') {
                  navigation.navigate('UserManagement');
                }
              }}
            >
              <View style={[styles.menuIconWrap, { backgroundColor: item.color + '15' }]}>
                <Icon name={item.icon} size={24} color={item.color} />
              </View>
              <View style={styles.menuText}>
                <Text style={styles.menuTitle}>{item.title}</Text>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color={Colors.border} />
            </TouchableOpacity>
          ))}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  headerRight: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  welcomeSub: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    width: (width - 44) / 2,
    backgroundColor: Colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 3,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  seeAll: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '600',
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
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  menuIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  recentActivity: {
    marginTop: 8,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingLeft: 4,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: Colors.text,
    lineHeight: 20,
  },
  activityTime: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 4,
  },
  bold: {
    fontWeight: '700',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textMuted,
    marginTop: 20,
    fontSize: 14,
    fontStyle: 'italic',
  },
});
