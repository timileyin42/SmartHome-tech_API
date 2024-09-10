// src/utils/utilityFunctions.ts

export const isValidObjectId = (id: string): boolean => {
  // Example validation logic: Check if the ID is a valid MongoDB ObjectId
  const objectIdRegex = /^[a-fA-F0-9]{24}$/;
  return objectIdRegex.test(id);
};

