import React, { useState } from 'react';
import { CustomIcon } from './CustomIcon';
import { Pet } from '../backend/types';

interface PetBudgetEstimatorProps {
  pet: Pet;
}

export const PetBudgetEstimator: React.FC<PetBudgetEstimatorProps> = ({ pet }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Realistic and accurate veterinary and pet-care monthly recurring costs in Indian Rupees (INR)
  // All budgets are realistic, grounded in Indian urban pet care, and all totals exceed ₹1,000.
  const calculateBudget = () => {
    const type = pet.animalType.toLowerCase();
    const size = (pet.weight || '').toLowerCase();
    const name = pet.name.toLowerCase();
    const breed = (pet.breed || '').toLowerCase();

    // Default base realistic costs
    let baseFood = 2500;
    let baseHealth = 1200;
    let baseGrooming = 800;
    let baseEssentials = 600;

    if (type.includes('dog') || type.includes('puppy')) {
      const numWeight = parseFloat(size) || 15;
      if (numWeight > 30 || breed.includes('mastiff') || breed.includes('dane') || breed.includes('rottweiler')) {
        // Extra Large Dogs (Mastiff, Great Dane, Saint Bernard, Rottweiler)
        baseFood = 5200; // Premium large-breed kibble + raw/cooked fresh protein
        baseHealth = 1800; // Large dose deworming, tick prevention (Nexgard/Bravecto) & vet fund
        baseGrooming = 1500; // Professional large bath, de-shedding & ear care
        baseEssentials = 900; // Heavy-duty chew toys, poop bags, bedding upkeep
      } else if (numWeight > 20 || breed.includes('labrador') || breed.includes('retriever') || breed.includes('shepherd') || breed.includes('husky')) {
        // Large Dogs (Labrador, Golden Retriever, GSD, Husky)
        baseFood = 3800;
        baseHealth = 1400;
        baseGrooming = 1200;
        baseEssentials = 800;
      } else if (numWeight > 10 || breed.includes('beagle') || breed.includes('indie') || breed.includes('cocker') || breed.includes('pariah')) {
        // Medium Dogs (Beagle, Indie / Desi Dog, Cocker Spaniel)
        baseFood = 2600;
        baseHealth = 1100;
        baseGrooming = 700;
        baseEssentials = 600;
      } else {
        // Small Dogs (Shih Tzu, Pomeranian, Pug, Chihuahua, Toy Poodle)
        baseFood = 1900;
        baseHealth = 1000;
        baseGrooming = 1100; // Small breeds with coat like Shih Tzu require frequent salon trims
        baseEssentials = 500;
      }
    } else if (type.includes('cat') || type.includes('kitten')) {
      if (name.includes('persian') || breed.includes('persian') || breed.includes('longhair') || breed.includes('ragdoll')) {
        // Longhaired / Persian cats
        baseFood = 2400; // Hairball control kibble + wet food pouches (Sheba/Royal Canin)
        baseHealth = 1100; // Deworming, spot-on flea treatment & vet checkup fund
        baseGrooming = 1300; // Clumping bentonite/tofu litter + professional de-shedding
        baseEssentials = 600; // Scratching pads, catnip & wand toys
      } else {
        // Domestic Short Hair / Indie Cats
        baseFood = 1800; // Dry food + daily wet food gravy
        baseHealth = 900; // Deworming, spot-on & annual vaccination amortized
        baseGrooming = 800; // High-absorbency cat litter & hygiene wipes
        baseEssentials = 500; // Scratching boards, balls & toys
      }
    } else if (type.includes('bird') || type.includes('parrot') || type.includes('cockatiel') || type.includes('budgie')) {
      // Birds & Parrots
      baseFood = 750; // Quality seed mix, pellets, fresh vegetables & cuttlebone
      baseHealth = 450; // Avian vitamin drops, mineral block & vet fund
      baseGrooming = 250; // Cage lining paper, misting bath care
      baseEssentials = 350; // Foraging toys, perches & cage accessories
    } else if (type.includes('rabbit') || type.includes('bunny') || type.includes('guinea')) {
      // Rabbits & Guinea Pigs
      baseFood = 1200; // Unlimited Timothy hay, leafy greens & fiber pellets
      baseHealth = 650; // Exotic vet checkup fund & digestive supplements
      baseGrooming = 450; // Wood pellet / paper bedding & nail trim
      baseEssentials = 400; // Chew toys, wood tunnels & hay racks
    }

    const total = baseFood + baseHealth + baseGrooming + baseEssentials;
    return {
      food: baseFood,
      health: baseHealth,
      grooming: baseGrooming,
      essentials: baseEssentials,
      total,
    };
  };

  const costs = calculateBudget();

  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <div className="border-2 border-[#0F5C94]/30 rounded-2xl overflow-hidden bg-[#FAF5EB] transition-all shadow-sm">
      {/* Estimator Toggle Header with Up/Down arrow indicators */}
      <button
        id="pet-budget-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-[#F6D97B]/30 transition-all cursor-pointer group"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#0F5C94] text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
            <CustomIcon name="sparkle" className="w-4 h-4" white />
          </div>
          <div>
            <h4 className="text-xs font-black text-[#0F5C94] uppercase tracking-wider">
              Pet Budget Estimator
            </h4>
            <p className="text-[11px] font-bold text-[#9A5D16]">
              {isOpen ? 'Click to hide monthly care breakdown' : 'Click to calculate monthly expenses'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Distinct Up/Down Arrow Badge */}
          <div className={`px-2.5 py-1 rounded-lg border flex items-center gap-1.5 text-xs font-black shadow-xs transition-colors ${
            isOpen 
              ? 'bg-[#0F5C94] text-white border-[#0F5C94]' 
              : 'bg-white text-[#0F5C94] border-[#0F5C94]/30'
          }`}>
            <span>{isOpen ? 'Close' : 'View'}</span>
            <span className="text-sm">{isOpen ? '▲' : '▼'}</span>
          </div>
        </div>
      </button>

      {/* Expandable Breakdown Body */}
      {isOpen && (
        <div className="px-4 pb-4 pt-1 border-t border-[#0F5C94]/15 space-y-3 animate-fadeIn">
          <div className="bg-white p-3.5 rounded-xl border border-[#0F5C94]/20 space-y-3 shadow-inner">
            
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <span className="text-[11px] font-black uppercase text-[#0F5C94]/70">
                Expense Category
              </span>
              <span className="text-[11px] font-black uppercase text-[#0F5C94]/70">
                Monthly Est.
              </span>
            </div>

            {/* Food & Treats */}
            <div className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FB4504] shadow-xs"></div>
                <div>
                  <span className="font-bold text-[#0F5C94] block">Food & Gourmet Treats</span>
                  <span className="text-[10px] text-stone-500 font-medium">Quality kibble, wet meals & nutritious treats</span>
                </div>
              </div>
              <span className="font-black text-[#0F5C94] text-sm tabular-nums">
                {formatINR(costs.food)}
              </span>
            </div>

            {/* Preventative Healthcare */}
            <div className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F942D] shadow-xs"></div>
                <div>
                  <span className="font-bold text-[#0F5C94] block">Healthcare & Vet Fund</span>
                  <span className="text-[10px] text-stone-500 font-medium">De-worming, tick/flea prevention & routine checkups</span>
                </div>
              </div>
              <span className="font-black text-[#0F5C94] text-sm tabular-nums">
                {formatINR(costs.health)}
              </span>
            </div>

            {/* Grooming & Hygiene */}
            <div className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0F5C94] shadow-xs"></div>
                <div>
                  <span className="font-bold text-[#0F5C94] block">Grooming & Hygiene</span>
                  <span className="text-[10px] text-stone-500 font-medium">Litter / bath shampoo, dental sticks & paw care</span>
                </div>
              </div>
              <span className="font-black text-[#0F5C94] text-sm tabular-nums">
                {formatINR(costs.grooming)}
              </span>
            </div>

            {/* Essentials & Toys */}
            <div className="flex items-center justify-between text-xs group">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#9A5D16] shadow-xs"></div>
                <div>
                  <span className="font-bold text-[#0F5C94] block">Toys & Essentials</span>
                  <span className="text-[10px] text-stone-500 font-medium">Chew toys, waste bags & bedding upkeep</span>
                </div>
              </div>
              <span className="font-black text-[#0F5C94] text-sm tabular-nums">
                {formatINR(costs.essentials)}
              </span>
            </div>

            {/* Total Highlight Bar with subtle micro-pop */}
            <div className="pt-3 border-t-2 border-dashed border-[#0F5C94]/20 flex items-center justify-between bg-[#FAF5EB] -mx-3.5 -mb-3.5 p-3 rounded-b-xl">
              <style dangerouslySetInnerHTML={{__html: `
                @keyframes subtleBob {
                  0%, 100% { transform: translateY(0); }
                  50% { transform: translateY(-3px); }
                }
                .animate-subtle-bob {
                  animation: subtleBob 2.2s ease-in-out infinite;
                }
              `}} />
              <div>
                <span className="text-xs font-black uppercase text-[#0F5C94] block">
                  Estimated Monthly Total
                </span>
                <span className="text-[10px] text-[#9A5D16] font-bold">
                  Tailored to {pet.name}'s specific breed & size
                </span>
              </div>
              <div className="overflow-hidden py-1 px-1">
                <span className="text-base font-black text-white bg-[#FB4504] px-4 py-1.5 rounded-xl shadow-md tabular-nums tracking-wide inline-block animate-subtle-bob hover:scale-105 transition-transform duration-200 cursor-default">
                  {formatINR(costs.total)}/mo
                </span>
              </div>
            </div>

          </div>

          <p className="text-[10px] text-[#0F5C94]/70 text-center font-medium pt-1">
            * Estimated monthly upkeep for a {pet.animalType} ({pet.breed || pet.weight || 'Standard'}).
          </p>
        </div>
      )}
    </div>
  );
};
