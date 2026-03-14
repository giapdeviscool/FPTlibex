import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';
import { mockNotifications, AppNotification } from '../data/mockNotifications';

export default function NotificationScreen({ navigation }: any) {
  const getIconConfig = (type: string) => {
    switch (type) {
      case 'order':
        return { name: 'receipt-outline', color: '#3B82F6', bg: '#EFF6FF' };
      case 'chat':
        return { name: 'chatbubbles-outline', color: '#10B981', bg: '#ECFDF5' };
      case 'promotion':
        return { name: 'ticket-outline', color: '#F59E0B', bg: '#FFFBEB' };
      case 'system':
      default:
        return { name: 'notifications-outline', color: Colors.primary, bg: Colors.primaryLight };
    }
  };

  const renderNotification = ({ item }: { item: AppNotification }) => {
    const iconConfig = getIconConfig(item.type);

    return (
      <TouchableOpacity
        style={[styles.notificationCard, !item.isRead && styles.unreadCard]}
        activeOpacity={0.7}>
        
        <View style={[styles.iconContainer, { backgroundColor: iconConfig.bg }]}>
          <Icon name={iconConfig.name} size={22} color={iconConfig.color} />
        </View>

        <View style={styles.contentContainer}>
          <Text style={[styles.title, !item.isRead && styles.unreadText]}>
            {item.title}
          </Text>
          <Text style={styles.message} numberOfLines={2}>
            {item.message}
          </Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>

        {!item.isRead && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity style={styles.readAllBtn}>
          <Icon name="checkmark-done" size={24} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={mockNotifications}
        keyExtractor={(item) => item.id}
        renderItem={renderNotification}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    backgroundColor: Colors.surface,
    zIndex: 10,
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
  readAllBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
  listContainer: {
    paddingBottom: 40,
  },
  notificationCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: Colors.surface,
  },
  unreadCard: {
    backgroundColor: '#FFF9F5', // Very light orange tint for unread
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  unreadText: {
    fontWeight: '800',
    color: Colors.text,
  },
  message: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 6,
  },
  time: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
    marginTop: 8,
    marginLeft: 8,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginLeft: 80, // Align with text content
  },
});
