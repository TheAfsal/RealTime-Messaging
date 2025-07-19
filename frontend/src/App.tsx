import { ClientPanel } from "@/components/ClientPanel"
import { motion } from "framer-motion"

export default function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-indigo-900 bg-clip-text text-transparent mb-4">
            Messenger
          </h1>
          <p className="text-xl text-slate-600 font-medium">Real-time communication powered by RabbitMQ</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          <ClientPanel clientId="client-a" recipient="Client B" accentColor="blue" />
          <ClientPanel clientId="client-b" recipient="Client A" accentColor="indigo" />
        </motion.div>
      </div>
    </div>
  )
}
