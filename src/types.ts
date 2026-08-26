export type AnimalType = 'Dog' | 'Cat' | 'Rabbit' | 'Bird' | 'Other';

export type AgeCategory = 'Young' | 'Adult' | 'Senior';

export type PetSize = 'Small' | 'Medium' | 'Large';

export type PetGender = 'Male' | 'Female';

export type AdoptionStatus = 'AVAILABLE' | 'CURRENTLY UNAVAILABLE' | 'ADOPTED' | 'PENDING';

export interface Pet {
  id: string;
  name: string;
  animalType: AnimalType;
  breed: string;
  age: string; // e.g. "2 years", "6 months", "5 years"
  ageCategory: AgeCategory;
  gender: PetGender;
  size: PetSize;
  location: string;
  description: string;
  personality: string[];
  goodWith: string[];
  status: AdoptionStatus;
  image: string;
  secondaryImages?: string[];
  medicalInfo: {
    vaccinated: boolean;
    spayedNeutered: boolean;
    microchipped: boolean;
    healthNotes: string;
  };
  weight?: string;
  activityLevel?: 'Low' | 'Moderate' | 'High';
  adoptionFee?: string;
  shelterName?: string;
  dateAdded?: string;
}

export type ApplicationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Adopted' | 'Rejected';

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
  housingType: 'House with Yard' | 'Apartment' | 'Townhouse' | 'Farm / Acreage';
  hasOtherPets: boolean;
  petExperience: 'First-time owner' | 'Experienced' | 'Lifelong pet parent';
  fitReason: string;
  dateApplied: string;
  currentStatus: ApplicationStatus;
  timelineNotes?: {
    appliedAt: string;
    reviewStartedAt?: string;
    decisionDate?: string;
    shelterNote?: string;
  };
}

export interface FilterState {
  animalType: AnimalType | 'All';
  breed: string;
  ageCategory: AgeCategory | 'All';
  size: PetSize | 'All';
  location: string;
  gender: PetGender | 'All';
  searchTerm: string;
}
