export default function debounce(func, wait = 4000) {
  const lastTypingTimestamp = new Date().getTime();
  const timeoutTime = wait;
  setTimeout(() => {
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - lastTypingTimestamp;
    if (timeDifference >= timeoutTime) {
      func();
    }
  }, timeoutTime);
}
