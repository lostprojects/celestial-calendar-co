export function logAstroUtils(data: any) {
  console.log(JSON.stringify({
    module: 'ASTRO_UTILS',
    timestamp: new Date().toISOString(),
    ...data
  }, null, 2));
}