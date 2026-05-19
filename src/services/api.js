export const getLessons = async () => [
  { id: 1, title: "Saludos" },
  { id: 2, title: "Números" },
];
export const getApiUrl = () => {
  // TODO: Use real environment variable for API URL
  return process.env.EXPO_PUBLIC_API_URL || "http://localhost:3001/api";
};
