import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../theme/colors';

export default function ForgotPasswordScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetPassword = () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập Mã số sinh viên (MSSV) của bạn.');
      return;
    }
    // Simulate API call
    setIsSubmitted(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}>

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Icon name="lock-open-outline" size={48} color={Colors.primary} />
        </View>

        {!isSubmitted ? (
          <>
            <View style={styles.titleSection}>
              <Text style={styles.title}>Quên mật khẩu?</Text>
              <Text style={styles.subtitle}>
                Đừng lo lắng! Vui lòng nhập MSSV của bạn để nhận liên kết đặt lại mật khẩu qua email trường.
              </Text>
            </View>

            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Mã số sinh viên FPT</Text>
                <View style={styles.inputContainer}>
                  <Icon name="mail-outline" size={20} color={Colors.textMuted} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="Nhập MSSV (VD: SE123456)"
                    placeholderTextColor={Colors.border}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.resetBtn, !email && styles.resetBtnDisabled]}
                onPress={handleResetPassword}
                disabled={!email}
                activeOpacity={0.8}>
                <Text style={styles.resetBtnText}>Gửi yêu cầu</Text>
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.successSection}>
            <Text style={styles.successTitle}>Đã gửi liên kết!</Text>
            <Text style={styles.successText}>
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email{'\n'}
              <Text style={{ fontWeight: '700', color: Colors.text }}>{email.toUpperCase()}@fpt.edu.vn</Text>
              {'\n\n'}Vui lòng kiểm tra hộp thư đến của bạn.
            </Text>

            <TouchableOpacity
              style={styles.backToLoginBtn}
              onPress={() => navigation.navigate('Login')}>
              <Text style={styles.backToLoginText}>Quay lại Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        )}
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
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#FFF3E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  titleSection: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  form: {
    gap: 24,
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
  resetBtn: {
    backgroundColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  resetBtnDisabled: {
    backgroundColor: Colors.border,
    shadowOpacity: 0,
    elevation: 0,
  },
  resetBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  successSection: {
    flex: 1,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: 12,
  },
  successText: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 24,
    marginBottom: 40,
  },
  backToLoginBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.primary,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backToLoginText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
});
