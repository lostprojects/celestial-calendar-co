export function formatLogObject(data: any) {
  return {
    ...data,
    timestamp: new Date().toISOString()
  };
}