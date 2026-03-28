import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  StatusBar,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { getAllUsers, updateUserRole, deleteUser, updateUserStatus } from '../service/admin.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function UserManagementScreen({ navigation }: any) {
  const [users, setUsers] = React.useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(true);
  const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const userInfo = await AsyncStorage.getItem('user_info');
      if (userInfo) {
        setCurrentUserId(JSON.parse(userInfo)._id);
      }
      const res = await getAllUsers();
      if (res.success) {
        setUsers(res.data);
        setFilteredUsers(res.data);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (text: string) => {
    setSearch(text);
    if (text) {
      const filtered = users.filter(user =>
        user.name.toLowerCase().includes(text.toLowerCase()) ||
        user.studentId.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  };

  const handleToggleRole = (user: any) => {
    if (user._id === currentUserId) {
      Alert.alert('Thông báo', 'Bạn không thể tự hạ quyền của chính mình');
      return;
    }
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    Alert.alert(
      'Xác nhận',
      `Bạn có muốn thay đổi quyền của ${user.name} thành ${newRole}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Đồng ý',
          onPress: async () => {
            try {
              const res = await updateUserRole(user._id, newRole);
              if (res.success) {
                fetchUsers();
                Alert.alert('Thành công', 'Đã cập nhật quyền người dùng');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể cập nhật quyền');
            }
          }
        }
      ]
    );
  };

  const handleToggleBan = (user: any) => {
    if (user._id === currentUserId) {
      Alert.alert('Thông báo', 'Bạn không thể tự khóa tài khoản của chính mình');
      return;
    }
    const newStatus = !user.isBanned;
    Alert.alert(
      'Xác nhận',
      `Bạn có chắc chắn muốn ${newStatus ? 'KHÓA' : 'MỞ KHÓA'} tài khoản của ${user.name}?`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xác nhận',
          onPress: async () => {
            try {
              const res = await updateUserStatus(user._id, newStatus);
              if (res.success) {
                fetchUsers();
                Alert.alert('Thành công', res.message);
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể thực hiện thao tác');
            }
          }
        }
      ]
    );
  };

  const handleDeleteUser = (user: any) => {
    if (user._id === currentUserId) {
      Alert.alert('Thông báo', 'Bạn không thể tự xóa tài khoản của chính mình');
      return;
    }
    Alert.alert(
      'Cảnh báo',
      `Bạn có chắc chắn muốn xóa người dùng ${user.name}? Hành động này không thể hoàn tác và sẽ xóa toàn bộ sách của người dùng này.`,
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa',
          style: 'destructive',
          onPress: async () => {
            try {
              const res = await deleteUser(user._id);
              if (res.success) {
                fetchUsers();
                Alert.alert('Thành công', 'Đã xóa người dùng');
              }
            } catch (error) {
              Alert.alert('Lỗi', 'Không thể xóa người dùng');
            }
          }
        }
      ]
    );
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <View style={[styles.userCard, item.isBanned && styles.bannedCard]}>
      <View style={styles.userInfo}>
        {item.avatar ? (
          <Image source={{ uri: item.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>{item.name.charAt(0)}</Text>
          </View>
        )}
        <View style={styles.textContainer}>
          <View style={styles.nameRow}>
            <Text style={styles.userName}>{item.name}</Text>
            {item.isBanned && (
              <View style={styles.bannedBadge}>
                <Text style={styles.bannedText}>BỊ KHÓA</Text>
              </View>
            )}
          </View>
          <Text style={styles.studentId}>{item.studentId}</Text>
          <View style={[styles.roleBadge, { backgroundColor: item.role === 'admin' ? '#FEE2E2' : '#E0F2FE' }]}>
            <Text style={[styles.roleText, { color: item.role === 'admin' ? '#EF4444' : '#0EA5E9' }]}>
              {item.role.toUpperCase()}
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleRole(item)}
        >
          <Icon name="shield-outline" size={20} color={Colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleToggleBan(item)}
        >
          <Icon name={item.isBanned ? "lock-open-outline" : "lock-closed-outline"} size={20} color={item.isBanned ? Colors.success : Colors.warning} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDeleteUser(item)}
        >
          <Icon name="trash-outline" size={20} color={Colors.error} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Quản lý người dùng</Text>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
          <Icon name="refresh-outline" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Tổng số</Text>
          <Text style={styles.statValue}>{users.length}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Quản trị</Text>
          <Text style={styles.statValue}>{users.filter(u => u.role === 'admin').length}</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Sinh viên</Text>
          <Text style={styles.statValue}>{users.filter(u => u.role === 'user').length}</Text>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Icon name="search-outline" size={20} color={Colors.textMuted} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm theo tên hoặc MSSV..."
          value={search}
          onChangeText={handleSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')}>
            <Icon name="close-circle" size={20} color={Colors.textMuted} />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Không tìm thấy người dùng phù hợp</Text>
          }
        />
      )}
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
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  statsBar: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingVertical: 12,
    margin: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.borderLight,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 12,
    borderRadius: 10,
    height: 45,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 1,
  },
  bannedCard: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECDD3',
    borderWidth: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 2,
  },
  bannedBadge: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
  },
  bannedText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '900',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  avatarPlaceholder: {
    backgroundColor: Colors.primaryLight + '30',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInitial: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  textContainer: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 2,
  },
  studentId: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  roleText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 40,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
});
