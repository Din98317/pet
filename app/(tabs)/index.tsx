import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Menu, Plus, CreditCard as Edit, Trash2, Calendar, Weight } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { AnimatedDrawer } from '@/components/AnimatedDrawer';
import { DrawerContent } from '@/components/DrawerContent';
import { PetProfile } from '@/components/PetProfile';

export default function HomeScreen() {
  const { pets, selectedPet, selectPet, theme } = useApp();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();

  const styles = createStyles(theme);

  const handleAddPet = () => {
    setDrawerOpen(false);
    router.push('/add-pet');
  };

  const handleSelectPet = (pet: any) => {
    selectPet(pet);
    setDrawerOpen(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => setDrawerOpen(true)}
        >
          <Menu size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {selectedPet ? selectedPet.name : 'Мои питомцы'}
        </Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content}>
        {selectedPet ? (
          <PetProfile pet={selectedPet} />
        ) : (
          <View style={styles.emptyState}>
            {pets.length === 0 ? (
              <>
                <Text style={styles.emptyTitle}>Добро пожаловать!</Text>
                <Text style={styles.emptyText}>
                  Добавьте своего первого питомца, чтобы начать отслеживать прививки
                </Text>
                <TouchableOpacity style={styles.addFirstPetButton} onPress={handleAddPet}>
                  <Plus size={20} color={theme.colors.background} />
                  <Text style={styles.addFirstPetButtonText}>Добавить питомца</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text style={styles.emptyTitle}>Выберите питомца</Text>
                <Text style={styles.emptyText}>
                  Откройте меню слева, чтобы выбрать питомца и просмотреть его профиль
                </Text>
              </>
            )}
          </View>
        )}
      </ScrollView>

      <AnimatedDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <DrawerContent
          onClose={() => setDrawerOpen(false)}
          onSelectPet={handleSelectPet}
          onAddPet={handleAddPet}
        />
      </AnimatedDrawer>
    </SafeAreaView>
  );
}

const createStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  menuButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.text,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    marginTop: 100,
  },
  emptyTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  addFirstPetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
  },
  addFirstPetButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: theme.colors.background,
    marginLeft: 8,
  },
});