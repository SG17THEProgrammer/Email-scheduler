export function formatTime(isoString: string) {
  const date = new Date(isoString);

  return date.toLocaleString("en-US", {
    weekday: "short",     
    day: "2-digit",       
    month: "short",       
    year: "numeric",      
    hour: "2-digit",      
    minute: "2-digit",    
    second: "2-digit",    
    // hour12: true,          
    timeZone: "Asia/Kolkata", //IST
  });
}
