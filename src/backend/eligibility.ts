import { Pet } from "./types";

export function checkEligibility(
  fitReason: string,
  housingType: string,
  petExperience: string,
  pet: Pet
): { result: string; reason: string } {
  // Rule 1: Fit reason length check (< 40 words)
  const words = fitReason.split(/\s+/).filter((w) => w.length > 0).length;
  if (words < 40) {
    return {
      result: "NOT_APPLICABLE",
      reason: "Please provide a more detailed response about why you would be a good fit for this pet. A minimum of 40 words is required.",
    };
  }

  // Rule 2: Housing suitability check
  const isLargePet = pet.activityLevel === "High";
  const requiresYard = pet.goodWith.some((g) =>
    ["Yard Homes", "Fenced Yard", "Farm Life", "Spacious Homes", "Active Runners"].includes(g)
  );

  if ((isLargePet || requiresYard) && housingType === "Apartment") {
    return {
      result: "NOT_APPLICABLE",
      reason: "This pet requires a larger living space or a house with a yard suitable for their size and energy level.",
    };
  }

  // Rule 3: Pet experience check
  const requiresExperienced =
    pet.goodWith.some((g) => ["Experienced Owners", "Experienced Handlers", "Experienced"].includes(g)) ||
    pet.personality.some((p) => ["Protective", "Genius", "Focused", "Athletic"].includes(p));

  if (requiresExperienced && petExperience === "First-time adopter") {
    return {
      result: "NOT_APPLICABLE",
      reason: "This pet requires an adopter with more experience caring for animals.",
    };
  }

  // All rules passed!
  return { result: "APPLICABLE", reason: "Application successfully verified as applicable!" };
}
