import type React from "react";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { ConnectionStatus } from "./ConnectionStatus";
import API from "../services/api";
import io from "socket.io-client";

interface ClientPanelProps {
  clientId: string;
  recipient: string;
  accentColor: "blue" | "indigo";
}

const socket = io(
  import.meta.env.VITE_WEBSOCKET_URL || "http://localhost:3001",
  {
    transports: ["websocket"],
  }
);

export function ClientPanel({
  clientId,
  recipient,
  accentColor,
}: ClientPanelProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const accentColors = {
    blue: {
      gradient: "bg-blue-500 to-blue-600",
      ring: "ring-blue-500/20",
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200",
    },
    indigo: {
      gradient: "bg-indigo-500 to-indigo-600",
      ring: "ring-indigo-500/20",
      bg: "bg-indigo-50",
      text: "text-indigo-700",
      border: "border-indigo-200",
    },
  };

  const colors = accentColors[accentColor];

  useEffect(() => {
    socket.on("connect", () => {
      console.log(`Connected to WebSocket for ${clientId}`);
      setSocketConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(`Disconnected from WebSocket for ${clientId}`);
      setSocketConnected(false);
    });

    socket.on(`message-to-${clientId}`, (msg: string) => {
      console.log(`Received message for ${clientId}: ${msg}`);
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off(`message-to-${clientId}`);
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [clientId]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsTyping(true);

    try {
      console.log(`Sending message from ${clientId}: ${message}`);
      await API.post(`/${clientId}/send?message=${message}`);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -2 }}
      className="h-full"
    >
      <Card
        className={`h-[600px] backdrop-blur-sm p-0 bg-white/80 border-0 shadow-2xl ring-1 ${colors.ring} hover:shadow-3xl transition-all duration-300`}
      >
        <CardHeader
          className={`py-4 bg-gradient-to-r ${colors.gradient} text-white rounded-t-lg`}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className={`p-2 bg-white/20 rounded-full`}>
                <User className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-bold">
                  {clientId.toUpperCase()}
                </CardTitle>
                <p className="text-white/80 text-sm">
                  Chatting with {recipient}
                </p>
              </div>
            </div>
            <ConnectionStatus connected={socketConnected} />
          </div>
        </CardHeader>

        <CardContent className="p-0 h-full flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <AnimatePresence>
              {messages.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center h-full text-slate-400"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                      <Send className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-medium">No messages yet</p>
                    <p className="text-sm">Start a conversation!</p>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg, index) => (
                    <MessageBubble
                      key={index}
                      message={msg}
                      index={index}
                      accentColor={accentColor}
                    />
                  ))}
                </div>
              )}
            </AnimatePresence>
          </ScrollArea>

          <div
            className={`p-6 border-t ${colors.border} bg-gradient-to-r ${colors.bg}`}
          >
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Send message to ${recipient}...`}
                  className="pr-12 h-12 text-base border-2 focus:ring-2 focus:ring-offset-2 transition-all duration-200"
                  disabled={!socketConnected}
                />
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      />
                      <div
                        className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      />
                    </div>
                  </motion.div>
                )}
              </div>
              <Button
                onClick={sendMessage}
                disabled={!message.trim() || !socketConnected || isTyping}
                className={`h-12 px-6 bg-gradient-to-r ${colors.gradient} hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none`}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
