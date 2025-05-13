export default function NotificationPopup({ message, onClose }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white p-4 rounded shadow-lg z-50">
      <span>{message}</span>
      <button onClick={onClose} className="ml-4">Close</button>
    </div>
  );
}
