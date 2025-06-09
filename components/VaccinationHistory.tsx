import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Syringe, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Vaccination } from '@/types';

interface VaccinationHistoryProps {
  vaccinations: Vaccination[];
}

export function VaccinationHistory({ vaccinations }: VaccinationHistoryProps) {
  const { theme, deleteVaccination } = useApp();
  const styles = createStyles(theme);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU');
  };

  const handleDelete = (vaccination: Vaccination) => {
    Alert.alert(
      'Удалить запись',
      `Удалить запись о прививке "${vaccination.vaccineName}"?`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: () => deleteVaccination(vaccination.id),
        },
      ]
    );
  };

  if (vaccinations.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Syringe size={48} color={theme.colors.textSecondary} />
        <Text style={styles.emptyTitle}>Нет записей о прививках</Text>
        <Text style={styles.emptyText}>
          Нажмите "Добавить", чтобы добавить первую прививку
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {vaccinations
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .map((vaccination) => (
          <View key={vaccination.id} style={styles.vaccinationCard}>
            <View style={styles.cardHeader}>
              <View style={styles.vaccinationIcon}>
                <Syringe size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.vaccinationInfo}>
                <Text style={styles.vaccineName}>{vaccination.vaccineName}</Text>
                <Text style={styles.vaccinationDate}>
                  {formatDate(vaccination.date)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(vaccination)}
              >
                <Trash2 size={16} color={theme.colors.error} />
              </TouchableOpacity>
            </View>
            <Text style={styles.serialNumber}>
              Серийный номер: {vaccination.serialNumber}
            </Text>
          </View>
        ))}
    </View>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    gap: 12,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  vaccinationCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  vaccinationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  vaccinationInfo: {
    flex: 1,
  },
  vaccineName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    marginBottom: 4,
  },
  vaccinationDate: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    padding: 8,
  },
  serialNumber: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
});