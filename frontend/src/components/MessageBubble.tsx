"use client"

import { motion } from "framer-motion"

interface MessageBubbleProps {
  message: string
  index: number
  accentColor: "blue" | "indigo"
}

export function MessageBubble({ message, index, accentColor }: MessageBubbleProps) {
  const colors = {
    blue: "bg-gradient-to-r from-blue-500 to-blue-600",
    indigo: "bg-gradient-to-r from-indigo-500 to-indigo-600",
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: -20, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{
        duration: 0.4,
        delay: index * 0.1,
        type: "spring",
        stiffness: 100,
      }}
      whileHover={{ scale: 1.02 }}
      className="flex justify-start"
    >
      <div className={`max-w-[80%] p-4 rounded-2xl rounded-tl-md ${colors[accentColor]} shadow-lg`}>
        <p className="text-sm font-medium leading-relaxed">{message}</p>
        <div className="flex justify-end mt-2">
          <span className="text-xs ">
            {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
