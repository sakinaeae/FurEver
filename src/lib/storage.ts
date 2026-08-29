import { User, Pet, AdoptionApplication, Like } from '../backend/types';

const STORAGE_KEYS = {
  USERS: 'furever_users',
  PETS: 'furever_pets',
  APPLICATIONS: 'furever_applications',
  LIKES: 'furever_likes',
  USER_PROFILE: 'furever_user_profile'
};

// Initialize localStorage from JSON files
export const initializeStorage = async (
  initialPets: Pet[],
  initialUsers: User[],
  initialApplications: AdoptionApplication[],
  initialLikes: Like[]
) => {
  if (!localStorage.getItem(STORAGE_KEYS.PETS)) {
    localStorage.setItem(STORAGE_KEYS.PETS, JSON.stringify(initialPets));
  }
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(initialUsers));
  }
  if (!localStorage.getItem(STORAGE_KEYS.APPLICATIONS)) {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(initialApplications));
  }
  if (!localStorage.getItem(STORAGE_KEYS.LIKES)) {
    localStorage.setItem(STORAGE_KEYS.LIKES, JSON.stringify(initialLikes));
  }
};

export const loadData = <T>(key: string): T[] => {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
};

export const saveData = <T>(key: string, data: T[]): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadPets = () => loadData<Pet>(STORAGE_KEYS.PETS);
export const savePets = (data: Pet[]) => saveData(STORAGE_KEYS.PETS, data);

export const loadUsers = () => loadData<User>(STORAGE_KEYS.USERS);
export const saveUsers = (data: User[]) => saveData(STORAGE_KEYS.USERS, data);

export const loadApplications = () => loadData<AdoptionApplication>(STORAGE_KEYS.APPLICATIONS);
export const saveApplications = (data: AdoptionApplication[]) => saveData(STORAGE_KEYS.APPLICATIONS, data);

export const loadLikes = () => loadData<Like>(STORAGE_KEYS.LIKES);
export const saveLikes = (data: Like[]) => saveData(STORAGE_KEYS.LIKES, data);
