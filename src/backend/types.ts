export type AnimalType = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';
export type AgeCategory = 'Young' | 'Adult' | 'Senior';
export type PetGender = 'Male' | 'Female';
export type PetSize = 'Small' | 'Medium' | 'Large';
export type AdoptionStatus = 'AVAILABLE' | 'CURRENTLY UNAVAILABLE' | 'ADOPTED' | 'PENDING';
export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Adopted' | 'Rejected';

export interface User {
  userId: string;
  name: string;
  email: string;
  phone: string;
  role: string; // "adopter" or "Pet Lister"
  address: string;
  housingType: string;
  petExperience: string;
}

export interface MedicalInfo {
  vaccinated: boolean;
  spayedNeutered: boolean;
  microchipped: boolean;
  healthNotes: string;
}

export interface Pet {
  id: string;
  petListerId: string;
  name: string;
  animalType: AnimalType;
  breed: string;
  age: string;
  ageCategory: AgeCategory;
  gender: PetGender;
  weight: string;
  location: string;
  description: string;
  personality: string[];
  goodWith: string[];
  medicalInfo: MedicalInfo;
  activityLevel: string;
  adoptionFee: string;
  shelterName: string;
  status: AdoptionStatus;
  image: string;
  dateAdded: string;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petBreed: string;
  petImage: string;
  petType: AnimalType;
  petLocation: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  applicantAddress: string;
  housingType: string;
  hasOtherPets: boolean;
  petExperience: string;
  fitReason: string;
  dateApplied: string;
  eligibilityResult: string; // "APPLICABLE" or "NOT_APPLICABLE"
  ineligibilityReason: string;
  currentStatus?: ApplicationStatus;
}

export interface Like {
  likeId: string;
  userId: string;
  petId: string;
  timestamp: string;
}
