import { AdoptionApplication } from '../types';

export const INITIAL_APPLICATIONS: AdoptionApplication[] = [
  {
    id: 'FUR-2026-8942',
    petId: 'pet-2',
    petName: 'Mochi',
    petBreed: 'Calico Domestic Shorthair',
    petImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
    petType: 'Cat',
    petLocation: 'Koramangala, Bengaluru',
    applicantName: 'You',
    applicantEmail: 'you@example.com',
    applicantPhone: '+91 98201 45678',
    applicantAddress: 'Indiranagar 12th Main, Bengaluru',
    housingType: 'Apartment',
    hasOtherPets: false,
    petExperience: 'Lifelong pet parent',
    fitReason: 'I work remotely from home and have a safe, sunlit cat-proofed apartment. Looking for a sweet companion to love and care for forever.',
    dateApplied: '2026-08-22',
    currentStatus: 'Under Review',
    timelineNotes: {
      appliedAt: '2026-08-22 10:15 AM',
      reviewStartedAt: '2026-08-23 02:30 PM',
      shelterNote: 'Coordinator Priya is reviewing your home environment photos and references. Expect a quick 10-minute phone call soon!'
    }
  },
  {
    id: 'FUR-2026-7621',
    petId: 'pet-5',
    petName: 'Clover',
    petBreed: 'Holland Lop Bunny',
    petImage: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80',
    petType: 'Rabbit',
    petLocation: 'Jayanagar, Bengaluru',
    applicantName: 'You',
    applicantEmail: 'you@example.com',
    applicantPhone: '+91 99345 88712',
    applicantAddress: 'Jayanagar 4th Block, Bengaluru',
    housingType: 'House with Yard',
    hasOtherPets: true,
    petExperience: 'Experienced',
    fitReason: 'Our family has had house rabbits for over 6 years. We have a dedicated indoor temperature-controlled playpen and access to exotic veterinary care.',
    dateApplied: '2026-08-19',
    currentStatus: 'Approved',
    timelineNotes: {
      appliedAt: '2026-08-19 11:00 AM',
      reviewStartedAt: '2026-08-20 09:45 AM',
      decisionDate: '2026-08-21 04:00 PM',
      shelterNote: 'Application approved! Shelter visit & meet-and-greet scheduled for this Saturday at 11:30 AM.'
    }
  }
];
