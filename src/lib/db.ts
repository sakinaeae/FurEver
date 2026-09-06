import { db, auth } from './firebase';
export { db, auth };
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, where, getDocs, getDoc } from 'firebase/firestore';
import { Pet, AdoptionApplication, User, Like, ApplicationStatus } from '../backend/types';

// Enums for operation type
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Helpers for data interaction
export const petsCollection = collection(db, 'pets');
export const applicationsCollection = collection(db, 'applications');
export const likesCollection = collection(db, 'likes');
export const usersCollection = collection(db, 'users');

// CRUD Operations for Pets
export const createPet = async (pet: Pet) => {
  try {
    await setDoc(doc(petsCollection, pet.id), pet);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `pets/${pet.id}`);
  }
};

export const updatePetStatus = async (petId: string, status: string) => {
  try {
    await updateDoc(doc(petsCollection, petId), { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `pets/${petId}`);
  }
};

export const deletePet = async (petId: string) => {
  try {
    await deleteDoc(doc(petsCollection, petId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `pets/${petId}`);
  }
};

// CRUD Operations for Applications
export const createApplication = async (app: AdoptionApplication) => {
  try {
    await setDoc(doc(applicationsCollection, app.id), app);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `applications/${app.id}`);
  }
};

export const updateApplicationStatus = async (appId: string, currentStatus: ApplicationStatus) => {
  try {
    await updateDoc(doc(applicationsCollection, appId), { currentStatus });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `applications/${appId}`);
  }
};

export const deleteApplication = async (appId: string) => {
  try {
    await deleteDoc(doc(applicationsCollection, appId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `applications/${appId}`);
  }
};

// CRUD Operations for Likes
export const createLike = async (like: Like) => {
  try {
    await setDoc(doc(likesCollection, like.likeId), like);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `likes/${like.likeId}`);
  }
};

export const removeLike = async (likeId: string) => {
  try {
    await deleteDoc(doc(likesCollection, likeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `likes/${likeId}`);
  }
};

// CRUD Operations for Users
export const createUserProfile = async (user: User) => {
  try {
    await setDoc(doc(usersCollection, user.userId), user);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, `users/${user.userId}`);
  }
};

export const updateUserProfile = async (userId: string, data: Partial<User>) => {
  try {
    await updateDoc(doc(usersCollection, userId), data);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${userId}`);
  }
};
