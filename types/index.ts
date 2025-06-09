export interface Pet {
  id: string;
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  weight: number;
  photoUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  serialNumber: string;
  date: string;
  createdAt: string;
}

export interface Theme {
  isDark: boolean;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    border: string;
    success: string;
    warning: string;
    error: string;
  };
}