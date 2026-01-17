export function formatTime(isoString: string) {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}
