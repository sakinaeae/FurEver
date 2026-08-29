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
  animalType: string;
  breed: string;
  age: string;
  ageCategory: string;
  gender: string;
  size: string;
  location: string;
  description: string;
  personality: string[];
  goodWith: string[];
  medicalInfo: MedicalInfo;
  weight: string;
  activityLevel: string;
  adoptionFee: string;
  shelterName: string;
  status: string;
  image: string;
  dateAdded: string;
}

export interface AdoptionApplication {
  id: string;
  petId: string;
  petName: string;
  petBreed: string;
  petImage: string;
  petType: string;
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
}

export interface Like {
  likeId: string;
  userId: string;
  petId: string;
  timestamp: string;
}
