import ClientPanel from './components/ClientPanel';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Real-Time Messaging with RabbitMQ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ClientPanel clientId="client-a" recipient="Client B" />
        <ClientPanel clientId="client-b" recipient="Client A" />
      </div>
    </div>
  );
}

export default App;