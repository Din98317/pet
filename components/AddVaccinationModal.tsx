import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { X, Calendar } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';

interface AddVaccinationModalProps {
  visible: boolean;
  onClose: () => void;
  petId: string;
}

export function AddVaccinationModal({ visible, onClose, petId }: AddVaccinationModalProps) {
  const { theme, addVaccination } = useApp();
  const [vaccineName, setVaccineName] = useState('');
  const [serialNumber, setSerialNumber] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const styles = createStyles(theme);

  const resetForm = () => {
    setVaccineName('');
    setSerialNumber('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSave = async () => {
    if (!vaccineName.trim() || !serialNumber.trim() || !date) {
      Alert.alert('Ошибка', 'Пожалуйста, заполните все поля');
      return;
    }

    try {
      await addVaccination({
        petId,
        vaccineName: vaccineName.trim(),
        serialNumber: serialNumber.trim(),
        date,
      });
      
      resetForm();
      onClose();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить прививку');
    }
  };

  const canSave = vaccineName.trim() && serialNumber.trim() && date;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Добавить прививку</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <X size={24} color={theme.colors.text} />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          <View style={styles.form}>
            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Название препарата</Text>
              <TextInput
                style={styles.input}
                value={vaccineName}
                onChangeText={setVaccineName}
                placeholder="Например, Нобивак DHPPi"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Серийный номер</Text>
              <TextInput
                style={styles.input}
                value={serialNumber}
                onChangeText={setSerialNumber}
                placeholder="Введите серийный номер"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Дата проведения</Text>
              <View style={styles.dateInputContainer}>
                <Calendar size={20} color={theme.colors.textSecondary} />
                <TextInput
                  style={styles.dateInput}
                  value={date}
                  onChangeText={setDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={theme.colors.textSecondary}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.saveButton, !canSave && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={!canSave}
          >
            <Text style={[styles.saveButtonText, !canSave && styles.saveButtonTextDisabled]}>
              Сохранить
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
  },
  dateInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.text,
    marginLeft: 12,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.background,
  },
  saveButtonTextDisabled: {
    color: theme.colors.textSecondary,
  },
});