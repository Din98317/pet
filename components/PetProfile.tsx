import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { CreditCard as Edit, Trash2, Calendar, Weight, Plus, Syringe } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { Pet } from '@/types';
import { VaccinationHistory } from './VaccinationHistory';
import { AddVaccinationModal } from './AddVaccinationModal';

interface PetProfileProps {
  pet: Pet;
}

export function PetProfile({ pet }: PetProfileProps) {
  const { theme, deletePet, selectPet, vaccinations } = useApp();
  const [showAddVaccination, setShowAddVaccination] = useState(false);
  const router = useRouter();

  const styles = createStyles(theme);

  const calculateAge = (birthDate: string) => {
    const birth = new Date(birthDate);
    const now = new Date();
    const ageInMs = now.getTime() - birth.getTime();
    const ageInYears = Math.floor(ageInMs / (1000 * 60 * 60 * 24 * 365));
    const ageInMonths = Math.floor((ageInMs % (1000 * 60 * 60 * 24 * 365)) / (1000 * 60 * 60 * 24 * 30));
    
    if (ageInYears > 0) {
      return `${ageInYears} ${ageInYears === 1 ? 'год' : ageInYears < 5 ? 'года' : 'лет'}`;
    } else {
      return `${ageInMonths} ${ageInMonths === 1 ? 'месяц' : ageInMonths < 5 ? 'месяца' : 'месяцев'}`;
    }
  };

  const handleEdit = () => {
    router.push({
      pathname: '/edit-pet',
      params: { petId: pet.id }
    });
  };

  const handleDelete = () => {
    Alert.alert(
      'Удалить питомца',
      `Вы уверены, что хотите удалить ${pet.name}? Это действие нельзя отменить.`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            await deletePet(pet.id);
            selectPet(null);
          },
        },
      ]
    );
  };

  const petVaccinations = vaccinations.filter(v => v.petId === pet.id);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileHeader}>
        <View style={styles.photoContainer}>
          {pet.photoUri ? (
            <Image source={{ uri: pet.photoUri }} style={styles.photo} />
          ) : (
            <View style={styles.placeholderPhoto}>
              <Text style={styles.placeholderText}>Фото</Text>
            </View>
          )}
        </View>
        
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Edit size={20} color={theme.colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleDelete}>
            <Trash2 size={20} color={theme.colors.error} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.petName}>{pet.name}</Text>
        <Text style={styles.petSpecies}>{pet.species} • {pet.breed}</Text>
        
        <View style={styles.detailsRow}>
          <View style={styles.detailItem}>
            <Calendar size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailLabel}>Возраст</Text>
            <Text style={styles.detailValue}>{calculateAge(pet.birthDate)}</Text>
          </View>
          
          <View style={styles.detailItem}>
            <Weight size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailLabel}>Вес</Text>
            <Text style={styles.detailValue}>{pet.weight} кг</Text>
          </View>
        </View>
      </View>

      <View style={styles.vaccinationSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Прививки</Text>
          <TouchableOpacity 
            style={styles.addVaccinationButton}
            onPress={() => setShowAddVaccination(true)}
          >
            <Plus size={16} color={theme.colors.background} />
            <Text style={styles.addVaccinationText}>Добавить</Text>
          </TouchableOpacity>
        </View>

        <VaccinationHistory vaccinations={petVaccinations} />
      </View>

      <AddVaccinationModal
        visible={showAddVaccination}
        onClose={() => setShowAddVaccination(false)}
        petId={pet.id}
      />
    </ScrollView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  profileHeader: {
    alignItems: 'center',
    padding: 20,
    position: 'relative',
  },
  photoContainer: {
    marginBottom: 16,
  },
  photo: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  placeholderPhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
  },
  actions: {
    position: 'absolute',
    right: 20,
    top: 20,
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoSection: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  petName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: 8,
  },
  petSpecies: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  detailItem: {
    alignItems: 'center',
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
  },
  vaccinationSection: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
  },
  addVaccinationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addVaccinationText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.background,
    marginLeft: 4,
  },
});