import { useState, useEffect } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

interface ClientPanelProps {
  clientId: string;
  recipient: string;
}

const socket = io('http://localhost:3001', { transports: ['websocket'] });

const ClientPanel: React.FC<ClientPanelProps> = ({ clientId, recipient }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on(`message-to-${clientId}`, (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off(`message-to-${clientId}`);
    };
  }, [clientId]);

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      await axios.get(`http://localhost:3001/${clientId}/send`, {
        params: { message },
      });
      setMessages((prev) => [...prev, `[You]: ${message}`]);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{clientId.toUpperCase()} (to {recipient})</h2>
      <div className="mb-4 h-64 overflow-y-auto border p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">{msg}</div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Send message to ${recipient}`}
          className="flex-1 p-2 border rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ClientPanel;