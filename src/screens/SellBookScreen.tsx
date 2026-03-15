import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import { Colors } from '../theme/colors';
import { createSellingBook } from '../service/book.service';
import AsyncStorage from '@react-native-async-storage/async-storage';

const conditions = ['Như mới', 'Tốt', 'Khá', 'Cũ'];
const faculties = ['CNTT', 'Kinh tế', 'Ngoại ngữ', 'Thiết kế', 'Marketing', 'Khác'];

export default function SellBookScreen({ navigation }: any) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    originalPrice: '',
    description: '',
    seller: '',
    condition: null as 'Như mới' | 'Tốt' | 'Khá' | 'Cũ' | null,
    faculty: null as 'CNTT' | 'Kinh tế' | 'Ngoại ngữ' | 'Thiết kế' | 'Marketing' | 'Khác' | null,
  });
  const [image, setImage] = useState<string | null>(null);

  const getSeller = async () => {
    const userInfo = await AsyncStorage.getItem('user_info');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      setFormData(prev => ({
        ...prev,
        seller: user.studentId,
      }));
    }
  };

  useEffect(() => {
    getSeller();
  }, []);


  const handleChange = (name: string, value: string | null) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const isFormValid =
    formData.title.trim() &&
    formData.author.trim() &&
    String(formData.price).trim() &&
    formData.condition &&
    formData.faculty;

  const handlePost = async () => {
    if (!isFormValid) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }

    // Chuẩn bị dữ liệu gửi đi (sử dụng object thay vì FormData)
    const uploadData = {
      title: formData.title.trim(),
      author: formData.author.trim(),
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      description: formData.description.trim(),
      condition: formData.condition,
      faculty: formData.faculty,
      seller: formData.seller,
      image: image, // uri ảnh
    };

    // Logging giúp debug
    console.log("Dữ liệu chuẩn bị gửi đi:", JSON.stringify(uploadData, null, 2));
    const response = await createSellingBook(uploadData);
    console.log("Response:", response);

    Alert.alert(
      'Đăng bán thành công! 🎉',
      `"${formData.title}" đã được đăng với giá ${Number(formData.price).toLocaleString('vi-VN')}đ`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  const handleAddImage = () => {
    Alert.alert('Thêm ảnh', 'Chọn nguồn ảnh', [
      {
        text: 'Chụp ảnh',
        onPress: async () => {
          try {
            const response = await launchCamera({
              mediaType: 'photo',
              quality: 0.8,
            });
            if (response.assets && response.assets[0]?.uri) {
              setImage(response.assets[0].uri!);
            }
          } catch (e) {
            console.log('Camera error:', e);
          }
        },
      },
      {
        text: 'Chọn từ thư viện',
        onPress: async () => {
          try {
            const response = await launchImageLibrary({
              mediaType: 'photo',
              quality: 0.8,
              selectionLimit: 1,
            });
            if (response.assets && response.assets[0]?.uri) {
              setImage(response.assets[0].uri!);
            }
          } catch (e) {
            console.log('Library error:', e);
          }
        },
      },
      { text: 'Huỷ', style: 'cancel' },
    ]);
  };

  return (
    <View style={styles.container} >
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />
      {/* Header */}
      <View style={styles.header} >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="close" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng bán sách</Text>
        <TouchableOpacity
          style={[styles.postButton, isFormValid && styles.postButtonActive]}
          onPress={handlePost}
          disabled={!isFormValid}>
          <Text
            style={[
              styles.postButtonText,
              isFormValid && styles.postButtonTextActive,
            ]}>
            Đăng
          </Text>
        </TouchableOpacity>
      </View >

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled">

        {/* Image Upload */}
        <Text style={styles.sectionLabel}>Hình ảnh sách</Text>
        <View style={styles.imageRow}>
          {image ? (
            <View style={styles.imageThumb}>
              <Image source={{ uri: image }} style={styles.thumbImage} />
              <TouchableOpacity
                style={styles.removeImage}
                onPress={() => setImage(null)}>
                <Icon name="close-circle" size={24} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity style={styles.addImageButton} onPress={handleAddImage}>
              <Icon name="camera-outline" size={28} color={Colors.primary} />
              <Text style={styles.addImageText}>Thêm ảnh</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Book Info */}
        <Text style={styles.sectionLabel}>Thông tin sách *</Text>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Icon name="book-outline" size={18} color={Colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Tên sách"
            placeholderTextColor={Colors.textMuted}
            value={formData.title}
            onChangeText={(text) => handleChange('title', text)}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.inputIcon}>
            <Icon name="person-outline" size={18} color={Colors.primary} />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Tác giả"
            placeholderTextColor={Colors.textMuted}
            value={formData.author}
            onChangeText={(text) => handleChange('author', text)}
          />
        </View>

        {/* Price */}
        <Text style={styles.sectionLabel}>Giá bán *</Text>

        <View style={styles.priceRow}>
          <View style={[styles.inputGroup, { flex: 1 }]}>
            <View style={styles.inputIcon}>
              <Icon name="logo-bitcoin" size={18} color={Colors.primary} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Giá bán"
              placeholderTextColor={Colors.textMuted}
              value={formData.price}
              onChangeText={(text) => handleChange('price', text)}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <View style={styles.inputIcon}>
              <Icon name="logo-bitcoin" size={18} color={Colors.textMuted} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Giá gốc (tuỳ chọn)"
              placeholderTextColor={Colors.textMuted}
              value={formData.originalPrice}
              onChangeText={(text) => handleChange('originalPrice', text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Price Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.priceOptions}>
          {[1000, 5000, 10000, 20000, 50000, 100000, 150000, 200000, 300000, 500000].map(
            value => {
              const isSelected = formData.price === String(value);
              const label = value >= 1000
                ? `${(value / 1000).toLocaleString('vi-VN')}K`
                : `${value}`;
              return (
                <TouchableOpacity
                  key={value}
                  style={[styles.priceChip, isSelected && styles.priceChipActive]}
                  onPress={() => handleChange('price', String(value))}>
                  <Text
                    style={[
                      styles.priceChipText,
                      isSelected && styles.priceChipTextActive,
                    ]}>
                    {label}
                  </Text>
                </TouchableOpacity>
              );
            },
          )}
        </ScrollView>

        {formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price) && (
          <View style={styles.discountInfo}>
            <Icon name="pricetag" size={14} color={Colors.success} />
            <Text style={styles.discountText}>
              Giảm {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}% so với giá gốc
            </Text>
          </View>
        )}

        {/* Condition */}
        <Text style={styles.sectionLabel}>Tình trạng sách *</Text>
        <View style={styles.chipRow}>
          {conditions.map(condition => {
            const isActive = formData.condition === condition;
            return (
              <TouchableOpacity
                key={condition}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleChange('condition', condition)}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {condition}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Faculty */}
        <Text style={styles.sectionLabel}>Danh mục *</Text>
        <View style={styles.chipRow}>
          {faculties.map(faculty => {
            const isActive = formData.faculty === faculty;
            return (
              <TouchableOpacity
                key={faculty}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => handleChange('faculty', faculty)}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {faculty}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Mô tả thêm</Text>
        <View style={styles.textAreaGroup}>
          <TextInput
            style={styles.textArea}
            placeholder="Mô tả tình trạng sách, lý do bán, ghi chú..."
            placeholderTextColor={Colors.textMuted}
            value={formData.description}
            onChangeText={(text) => handleChange('description', text)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{formData.description.length}/500</Text>
        </View>

        {/* Tips */}
        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Icon name="bulb-outline" size={18} color={Colors.warning} />
            <Text style={styles.tipsTitle}>Mẹo đăng bán nhanh</Text>
          </View>
          <Text style={styles.tipItem}>📸 Chụp ảnh rõ nét bìa trước, sau và mục lục</Text>
          <Text style={styles.tipItem}>💰 Đặt giá 30-50% giá gốc sẽ dễ bán hơn</Text>
          <Text style={styles.tipItem}>📝 Mô tả chi tiết tình trạng sách</Text>
        </View>

        {/* Submit button (full width, below form) */}
        <TouchableOpacity
          style={[styles.submitButton, isFormValid && styles.submitButtonActive]}
          onPress={handlePost}
          activeOpacity={0.8}>
          <Icon
            name="cloud-upload-outline"
            size={20}
            color={isFormValid ? '#FFFFFF' : Colors.textMuted}
          />
          <Text
            style={[
              styles.submitButtonText,
              isFormValid && styles.submitButtonTextActive,
            ]}>
            Đăng bán ngay
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View >
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
    paddingTop: 46,
    paddingBottom: 12,
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
  postButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.borderLight,
  },
  postButtonActive: {
    backgroundColor: Colors.primary,
  },
  postButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  postButtonTextActive: {
    color: '#FFFFFF',
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 10,
    marginTop: 20,
  },
  imageRow: {
    gap: 10,
  },
  addImageButton: {
    width: 100,
    height: 100,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: Colors.primary,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF3E6',
    gap: 2,
  },
  addImageText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.primary,
    marginTop: 4,
  },
  addImageCount: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  imageThumb: {
    width: 100,
    height: 100,
    borderRadius: 14,
    backgroundColor: Colors.surface,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
  },
  thumbImage: {
    width: '100%',
    height: '100%',
    borderRadius: 13,
  },
  removeImage: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 12,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: 14,
    paddingHorizontal: 4,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  inputIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  currencyIcon: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primary,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.text,
    paddingVertical: 14,
    paddingRight: 14,
  },
  priceRow: {
    flexDirection: 'row',
    gap: 10,
  },
  priceOptions: {
    gap: 8,
    marginTop: 10,
    marginBottom: 4,
  },
  priceChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  priceChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  priceChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  priceChipTextActive: {
    color: '#FFFFFF',
  },
  discountInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
    marginTop: -4,
  },
  discountText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
  },
  textAreaGroup: {
    backgroundColor: Colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: 14,
  },
  textArea: {
    fontSize: 14,
    color: Colors.text,
    minHeight: 80,
    padding: 0,
  },
  charCount: {
    fontSize: 11,
    color: Colors.textMuted,
    textAlign: 'right',
    marginTop: 8,
  },
  tipsCard: {
    backgroundColor: '#FFFBF0',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    borderWidth: 1,
    borderColor: '#FFE8B2',
    gap: 6,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.text,
  },
  tipItem: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.borderLight,
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 24,
  },
  submitButtonActive: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  submitButtonTextActive: {
    color: '#FFFFFF',
  },
});
