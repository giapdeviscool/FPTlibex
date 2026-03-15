import React, { useState, useEffect } from 'react';
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
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { uploadImage } from '../service/upload.service';
import { ActivityIndicator, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../theme/colors';
import { updateProfile } from '../service/user.service';

export default function EditProfileScreen({ navigation }: any) {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const loadUserData = async () => {
      const userInfo = await AsyncStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        setName(user.name || '');
        setStudentId(user.studentId || '');
        setAvatar(user.avatar || user.image || null);
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập tên của bạn');
      return;
    }

    setLoading(true);
    try {
      let avatarUrl = avatar;

      // Upload if it's a new local image
      if (avatar && !avatar.startsWith('http')) {
        setIsUploading(true);
        const fileName = `avatar_${Date.now()}.jpg`;
        const uploadResult: any = await uploadImage(avatar, fileName);
        avatarUrl = uploadResult.imageUrl || uploadResult.url || uploadResult.data?.url || (typeof uploadResult === 'string' ? uploadResult : avatar);
        setIsUploading(false);
      }

      await updateProfile({ name, avatar: avatarUrl, studentId });

      // Update local storage
      const userInfo = await AsyncStorage.getItem('user_info');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        const updatedUser = { ...user, name, avatar: avatarUrl, studentId };
        await AsyncStorage.setItem('user_info', JSON.stringify(updatedUser));
      }

      Alert.alert('Thành công', 'Thông tin hồ sơ đã được cập nhật');
      navigation.goBack();
    } catch (error: any) {
      console.error('Update Profile Error:', error);
      Alert.alert(
        'Lỗi',
        error.response?.data?.message || 'Không thể cập nhật hồ sơ'
      );
    } finally {
      setLoading(false);
      setIsUploading(false);
    }
  };

  const handlePickImage = () => {
    Alert.alert('Ảnh đại diện', 'Chọn nguồn ảnh', [
      {
        text: 'Chụp ảnh',
        onPress: async () => {
          const result = await launchCamera({ mediaType: 'photo', quality: 0.7 });
          if (result.assets?.[0]?.uri) setAvatar(result.assets[0].uri);
        }
      },
      {
        text: 'Thư viện ảnh',
        onPress: async () => {
          const result = await launchImageLibrary({ mediaType: 'photo', quality: 0.7 });
          if (result.assets?.[0]?.uri) setAvatar(result.assets[0].uri);
        }
      },
      { text: 'Huỷ', style: 'cancel' }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              {avatar ? (
                <Image source={{ uri: avatar }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.placeholderAvatar]}>
                  <Icon name="person" size={60} color={Colors.textMuted} />
                </View>
              )}
              {isUploading && (
                <View style={styles.uploadOverlay}>
                  <ActivityIndicator color="#FFF" />
                </View>
              )}
              <TouchableOpacity style={styles.editAvatarBtn} onPress={handlePickImage}>
                <Icon name="camera" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarHelpText}>Chạm để đổi ảnh đại diện</Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Họ và tên</Text>
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={name}
                  onChangeText={setName}
                  placeholder="Nhập họ và tên"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mã số sinh viên</Text>
              <View style={[styles.inputContainer]}>
                <Icon name="card-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  value={studentId}
                  onChangeText={setStudentId}
                  placeholder="Nhập mã số sinh viên"
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.saveButton, loading && styles.disabledButton]}
              onPress={handleSave}
              disabled={loading}
            >
              <Text style={styles.saveButtonText}>
                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    padding: 20,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatarWrapper: {
    position: 'relative',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 10,
    elevation: 4,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
  },
  placeholderAvatar: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.borderLight,
  },
  uploadOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editAvatarBtn: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: Colors.primary,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: Colors.surface,
  },
  avatarHelpText: {
    marginTop: 10,
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: 16,
    height: 56,
  },
  inputIcon: {
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.text,
    height: '100%',
  },
  disabledInput: {
    backgroundColor: '#F3F4F6',
    borderColor: '#E5E7EB',
  },
  saveButton: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  disabledButton: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
});
