export default function useMsToHMS(ms: number) {
  let seconds: string | number = ms / 1000;
  const hours = parseInt(String(seconds / 3600)); // 3,600 seconds in 1 hour
  seconds = seconds % 3600; // seconds remaining after extracting hours
  const minutes = parseInt(String(seconds / 60)); // 60 seconds in 1 minute
  seconds = Number(seconds % 60).toFixed(3);
  console.log(hours + ":" + minutes + ":" + seconds);
}
