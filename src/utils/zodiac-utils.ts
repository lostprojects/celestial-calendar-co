export function extractSignDegrees(longitude: number) {
  console.log("[DEBUG] Sign extraction input:", longitude);
  
  const normalized = ((longitude % 360) + 360) % 360;
  const signIndex = Math.floor(normalized / 30);
  
  const signs = [
    "Aries", "Taurus", "Gemini", "Cancer",
    "Leo", "Virgo", "Libra", "Scorpio",
    "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  
  const sign = signs[signIndex];
  const degreesIntoSign = normalized - signIndex * 30;
  const degWhole = Math.floor(degreesIntoSign);
  let minWhole = Math.round((degreesIntoSign - degWhole) * 60);
  
  let finalDeg = degWhole;
  if (minWhole === 60) {
    finalDeg += 1;
    minWhole = 0;
  }
  
  console.log("[DEBUG] Sign extraction result:", {
    longitude,
    normalized,
    signIndex,
    sign,
    degreesIntoSign,
    finalDeg,
    minWhole
  });
  
  return { sign, deg: finalDeg, min: minWhole };
}

export function approximateAyanamsa(year: number): number {
  // Lahiri ayanamsa calculation
  const t = (year - 285) / 1000;
  const ayanamsa = 23.15 + 0.0143 * (year - 1900);
  
  console.log("[DEBUG] Ayanamsa calculation:", {
    year,
    t,
    ayanamsa
  });
  
  return ayanamsa;
}