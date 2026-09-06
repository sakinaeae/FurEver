import { INITIAL_PETS } from '../data/petsData';
import { petsCollection } from './db';
import { getDocs, setDoc, doc } from 'firebase/firestore';

import { auth } from './db';
export const seedDatabaseIfEmpty = async () => {
  if (!auth.currentUser) return;

  try {
    const snapshot = await getDocs(petsCollection);
    if (snapshot.empty) {
      console.log('Database empty, seeding initial pets...');
      const promises = INITIAL_PETS.map(pet => {
        const petToSeed = { ...pet, petListerId: auth.currentUser!.uid };
        return setDoc(doc(petsCollection, pet.id), petToSeed);
      });
      await Promise.all(promises);
      console.log('Seeded database successfully.');
    }
  } catch (error) {
    console.error('Failed to seed database:', error);
  }
};
