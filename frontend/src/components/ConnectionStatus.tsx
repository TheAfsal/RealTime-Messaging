"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Wifi, WifiOff } from "lucide-react";

interface ConnectionStatusProps {
  connected: boolean;
}

export function ConnectionStatus({ connected }: ConnectionStatusProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Badge
        variant={connected ? "default" : "destructive"}
        className={`flex items-center gap-2 px-3 py-1 ${
          connected
            ? "bg-green-500 hover:bg-green-600"
            : "bg-red-500 hover:bg-red-600"
        }  border-0`}
      >
        <motion.div
          animate={{ rotate: connected ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {connected ? (
            <Wifi className="w-4 h-4" />
          ) : (
            <WifiOff className="w-4 h-4" />
          )}
        </motion.div>
        <span className="text-xs font-medium">
          {connected ? "Connected" : "Disconnected"}
        </span>
        {connected && (
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
            className="w-2 h-2 bg-white rounded-full"
          />
        )}
      </Badge>
    </motion.div>
  );
}
