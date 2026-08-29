import { saveUsers, savePets } from "./db";
import { User, Pet } from "./types";

const sampleUsers: User[] = [
  {
    userId: "usr-1",
    name: "Sakina Ali",
    email: "sakinaeae@gmail.com",
    phone: "8618415699",
    role: "adopter",
    address: "123 Maple St",
    housingType: "House",
    petExperience: "Experienced"
  },
  {
    userId: "usr-2",
    name: "Bob Smith",
    email: "bob@example.com",
    phone: "9876543210",
    role: "owner",
    address: "456 Oak St",
    housingType: "Apartment",
    petExperience: "First-time owner"
  }
];

const samplePets: Pet[] = [
  {
    id: "pet-1",
    ownerId: "usr-2",
    name: "Buddy",
    animalType: "Dog",
    breed: "Golden Retriever",
    age: "2 years",
    ageCategory: "Young",
    gender: "Male",
    size: "Large",
    location: "City Center",
    description: "Friendly and active, loves fetch.",
    personality: ["Loving", "Athletic"],
    goodWith: ["Families", "Yard Homes"],
    medicalInfo: {
      vaccinated: true,
      spayedNeutered: true,
      microchipped: true,
      healthNotes: "Health verified by foster owner"
    },
    weight: "50lbs",
    activityLevel: "High",
    adoptionFee: "$100",
    shelterName: "City Shelter",
    status: "AVAILABLE",
    image: "/dog.svg",
    dateAdded: "2026-08-29"
  },
  {
    id: "pet-2",
    ownerId: "usr-2",
    name: "Luna",
    animalType: "Cat",
    breed: "Siamese",
    age: "1 year",
    ageCategory: "Young",
    gender: "Female",
    size: "Small",
    location: "Suburbs",
    description: "Quiet and enjoys sunny spots.",
    personality: ["Calm", "Affectionate"],
    goodWith: ["Apartments", "Other Cats"],
    medicalInfo: {
      vaccinated: true,
      spayedNeutered: true,
      microchipped: true,
      healthNotes: "Healthy"
    },
    weight: "8lbs",
    activityLevel: "Low",
    adoptionFee: "$50",
    shelterName: "Suburban Rescue",
    status: "AVAILABLE",
    image: "/cat.svg",
    dateAdded: "2026-08-29"
  }
];

saveUsers(sampleUsers);
savePets(samplePets);
console.log("Database seeded successfully!");
