import React, { useState } from 'react';
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
import { Colors } from '../theme/colors';
import { BookResponse, deleteSellingBook, updateSellingBook } from '../service/book.service';

const conditions = ['Như mới', 'Tốt', 'Khá', 'Cũ'] as const;
const faculties = ['CNTT', 'Kinh tế', 'Ngoại ngữ', 'Thiết kế', 'Marketing', 'Khác'] as const;

export default function EditBookScreen({ route, navigation }: any) {
  const params = route.params || {};

  const [title, setTitle] = useState(params.title || '');
  const [author, setAuthor] = useState(params.author || '');
  const [price, setPrice] = useState(params.price?.toString() || '');
  const [originalPrice, setOriginalPrice] = useState(params.originalPrice?.toString() || '');
  const [selectedCondition, setSelectedCondition] = useState<string | null>(
    params.condition || null,
  );
  const [selectedFaculty, setSelectedFaculty] = useState<string | null>(
    params.faculty || null,
  );
  const [description, setDescription] = useState(params.description || '');

  const isFormValid =
    title.trim() &&
    author.trim() &&
    Number(price) > 0 &&
    Number(originalPrice) > 0 &&
    selectedCondition &&
    selectedFaculty;

  const handleDeleteSellingPost = async () => {
    const response = await deleteSellingBook(params.bookId);
    if (!response) {
      Alert.alert('Lỗi', 'Không thể xoá sách');
      return;
    }
    Alert.alert('Xoá thành công', 'Sách đã được xoá');
    navigation.goBack();
  }

  const handleSave = async () => {
    if (!isFormValid) {
      Alert.alert('Thiếu thông tin', 'Vui lòng điền đầy đủ các trường bắt buộc');
      return;
    }
    const updateData = {
      title,
      author,
      price: Number(price),
      originalPrice: Number(originalPrice),
      condition: selectedCondition,
      faculty: selectedFaculty,
      description
    }
    const response = await updateSellingBook(params.bookId, updateData);
    if (!response) {
      Alert.alert('Lỗi', 'Không thể cập nhật sách');
      return;
    }
    Alert.alert(
      'Cập nhật thành công!',
      `"${title}" đã được cập nhật`,
      [{ text: 'OK', onPress: () => navigation.goBack() }],
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.surface} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="chevron-back" size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa sách</Text>
        <TouchableOpacity
          style={[styles.saveButton, isFormValid && styles.saveButtonActive]}
          onPress={handleSave}
          disabled={!isFormValid}>
          <Text
            style={[
              styles.saveButtonText,
              isFormValid && styles.saveButtonTextActive,
            ]}>
            Lưu
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled">

        {/* Current Image */}
        {params.image && (
          <>
            <Text style={styles.sectionLabel}>Ảnh hiện tại</Text>
            <View style={styles.currentImageWrap}>
              <Image source={{ uri: params.image }} style={styles.currentImage} />
              <TouchableOpacity style={styles.changeImageBtn}>
                <Icon name="camera-outline" size={16} color={Colors.primary} />
                <Text style={styles.changeImageText}>Đổi ảnh</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

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
            value={title}
            onChangeText={setTitle}
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
            value={author}
            onChangeText={setAuthor}
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
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
          </View>

          <View style={[styles.inputGroup, { flex: 1 }]}>
            <View style={styles.inputIcon}>
              <Icon name="logo-bitcoin" size={18} color={Colors.textMuted} />
            </View>
            <TextInput
              style={styles.input}
              placeholder="Giá gốc"
              placeholderTextColor={Colors.textMuted}
              value={originalPrice}
              onChangeText={setOriginalPrice}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Condition */}
        <Text style={styles.sectionLabel}>Tình trạng *</Text>
        <View style={styles.chipRow}>
          {conditions.map(condition => {
            const isActive = selectedCondition === condition;
            return (
              <TouchableOpacity
                key={condition}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSelectedCondition(condition)}>
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
            const isActive = selectedFaculty === faculty;
            return (
              <TouchableOpacity
                key={faculty}
                style={[styles.chip, isActive && styles.chipActive]}
                onPress={() => setSelectedFaculty(faculty)}>
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                  {faculty}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Description */}
        <Text style={styles.sectionLabel}>Mô tả</Text>
        <View style={styles.textAreaGroup}>
          <TextInput
            style={styles.textArea}
            placeholder="Cập nhật mô tả sách..."
            placeholderTextColor={Colors.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.charCount}>{description.length}/500</Text>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.submitButton, isFormValid && styles.submitButtonActive]}
          onPress={handleSave}
          activeOpacity={0.8}>
          <Icon
            name="save-outline"
            size={20}
            color={isFormValid ? '#FFFFFF' : Colors.textMuted}
          />
          <Text
            style={[
              styles.submitButtonText,
              isFormValid && styles.submitButtonTextActive,
            ]}>
            Lưu thay đổi
          </Text>
        </TouchableOpacity>

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert('Xoá sách', `Bạn có chắc muốn xoá "${title}"?`, [
              { text: 'Huỷ', style: 'cancel' },
              {
                text: 'Xoá',
                style: 'destructive',
                onPress: () => handleDeleteSellingPost(),
              },
            ])
          }>
          <Icon name="trash-outline" size={18} color={Colors.error} />
          <Text style={styles.deleteButtonText}>Xoá bài đăng</Text>
        </TouchableOpacity>
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
  saveButton: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: Colors.borderLight,
  },
  saveButtonActive: {
    backgroundColor: Colors.primary,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  saveButtonTextActive: {
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
  currentImageWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  currentImage: {
    width: 100,
    height: 100,
    borderRadius: 14,
    backgroundColor: '#F5F5F5',
  },
  changeImageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFF3E6',
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  changeImageText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
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
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 14,
    marginTop: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.error,
  },
  deleteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.error,
  },
});
