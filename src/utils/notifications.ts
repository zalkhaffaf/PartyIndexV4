export function showNotification(message: string, type: 'success' | 'error') {
  const existingNotification = document.getElementById('notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  const notificationDiv = document.createElement('div');
  notificationDiv.id = 'notification';
  notificationDiv.className = `fixed top-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 ${
    type === 'success' ? 'bg-green-500' : 'bg-red-500'
  } text-white`;
  notificationDiv.textContent = message;

  document.body.appendChild(notificationDiv);

  setTimeout(() => {
    notificationDiv.remove();
  }, 3000);
}

export function showError(message: string) {
  showNotification(message, 'error');
}

export function showSuccess(message: string) {
  showNotification(message, 'success');
}