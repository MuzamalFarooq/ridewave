'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useSocket } from '@/contexts/SocketContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send, Paperclip, Phone, Video, MoreVertical, ArrowLeft,
  Image, Smile, Check, CheckCheck, Loader2, MessageSquare, Search
} from 'lucide-react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

function ConversationItem({ conv, isActive, onClick, currentUserId }) {
  const other = conv.participants?.find((p) => p.userId !== currentUserId);
  const lastMsg = conv.messages?.[0];
  return (
    <motion.div
      whileHover={{ x: 2 }}
      onClick={onClick}
      className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isActive ? 'bg-[rgba(99,102,241,0.1)] border border-[rgba(99,102,241,0.2)]' : 'hover:bg-[var(--bg-surface)]'}`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 rounded-full gradient-primary flex items-center justify-center text-white font-bold overflow-hidden">
          {other?.user?.image
            ? <img src={other.user.image} alt="" className="w-full h-full object-cover" />
            : other?.user?.name?.[0] || '?'}
        </div>
        {conv.unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: 'var(--danger)', fontSize: 9 }}>
            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
          </span>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold truncate">{other?.user?.name || 'Unknown'}</span>
          {lastMsg && <span className="text-xs flex-shrink-0" style={{ color: 'var(--text-muted)' }}>{format(new Date(lastMsg.createdAt), 'HH:mm')}</span>}
        </div>
        <div className="flex items-center gap-1">
          <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>
            {conv.booking?.ride ? `${conv.booking.ride.pickupAddress} → ${conv.booking.ride.destinationAddress}` : conv.lastMessage || 'No messages yet'}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function MessageBubble({ msg, isOwn }) {
  const statusIcon = isOwn ? (msg.isRead ? <CheckCheck className="w-3 h-3" style={{ color: 'var(--primary)' }} /> : <Check className="w-3 h-3" style={{ color: 'var(--text-muted)' }} />) : null;

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'} mb-2`}>
      {!isOwn && (
        <div className="w-7 h-7 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold mr-2 flex-shrink-0 overflow-hidden self-end">
          {msg.sender?.image ? <img src={msg.sender.image} alt="" className="w-full h-full object-cover" /> : msg.sender?.name?.[0]}
        </div>
      )}
      <div className={`max-w-[72%]`}>
        {msg.messageType === 'IMAGE' ? (
          <img src={msg.mediaUrl} alt="Image" className="rounded-2xl max-w-full" style={{ maxHeight: 200 }} />
        ) : (
          <div
            className="px-4 py-2.5 rounded-2xl text-sm"
            style={{
              background: isOwn ? 'var(--primary)' : 'var(--bg-surface)',
              color: isOwn ? 'white' : 'var(--text-primary)',
              borderBottomRightRadius: isOwn ? 4 : 16,
              borderBottomLeftRadius: isOwn ? 16 : 4,
            }}
          >
            {msg.content}
          </div>
        )}
        <div className={`flex items-center gap-1 mt-0.5 ${isOwn ? 'justify-end' : 'justify-start'}`}>
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{format(new Date(msg.createdAt), 'HH:mm')}</span>
          {statusIcon}
        </div>
      </div>
    </div>
  );
}

export default function MessagesPage() {
  const { data: session } = useSession();
  const { socket } = useSocket();
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherUser = activeConv?.participants?.find((p) => p.userId !== session?.user?.id)?.user;

  useEffect(() => {
    fetch('/api/conversations')
      .then((r) => r.json())
      .then((d) => setConversations(d.conversations || []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeConvId) return;
    fetch(`/api/conversations/${activeConvId}/messages`)
      .then((r) => r.json())
      .then((d) => setMessages(d.messages || []));

    // Mark as read
    setConversations((prev) => prev.map((c) => c.id === activeConvId ? { ...c, unreadCount: 0 } : c));
  }, [activeConvId]);

  useEffect(() => {
    if (!socket || !activeConvId) return;
    socket.emit('join:conversation', activeConvId);

    socket.on('message:received', (msg) => {
      if (msg.conversationId === activeConvId) {
        setMessages((prev) => [...prev, msg]);
        setIsTyping(false);
      }
      setConversations((prev) => prev.map((c) =>
        c.id === msg.conversationId
          ? { ...c, lastMessage: msg.content, lastMessageAt: msg.createdAt, unreadCount: c.id === activeConvId ? 0 : (c.unreadCount || 0) + 1 }
          : c
      ));
    });

    socket.on('user:typing', ({ userId, conversationId }) => {
      if (conversationId === activeConvId && userId !== session?.user?.id) {
        setIsTyping(true);
        clearTimeout(typingTimeout);
        setTypingTimeout(setTimeout(() => setIsTyping(false), 3000));
      }
    });

    return () => {
      socket.emit('leave:conversation', activeConvId);
      socket.off('message:received');
      socket.off('user:typing');
    };
  }, [socket, activeConvId]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !activeConvId || sending) return;
    const content = input.trim();
    setInput('');
    setSending(true);

    // Optimistic update
    const tempMsg = {
      id: `temp-${Date.now()}`,
      conversationId: activeConvId,
      senderId: session?.user?.id,
      content,
      messageType: 'TEXT',
      createdAt: new Date().toISOString(),
      sender: { id: session?.user?.id, name: session?.user?.name, image: session?.user?.image },
    };
    setMessages((prev) => [...prev, tempMsg]);

    try {
      const res = await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, messageType: 'TEXT' }),
      });
      if (!res.ok) throw new Error('Send failed');
    } catch {
      toast.error('Failed to send message');
      setMessages((prev) => prev.filter((m) => m.id !== tempMsg.id));
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const handleTyping = (e) => {
    setInput(e.target.value);
    if (socket && activeConvId) {
      socket.emit('user:typing', { conversationId: activeConvId });
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeConvId) return;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'ridewave/chat');
    setSending(true);
    try {
      const uploadRes = await fetch('/api/upload', { method: 'POST', body: formData });
      const { url } = await uploadRes.json();
      await fetch(`/api/conversations/${activeConvId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: '', messageType: 'IMAGE', mediaUrl: url }),
      });
    } catch {
      toast.error('Upload failed');
    } finally {
      setSending(false);
    }
  };

  const filteredConvs = conversations.filter((c) => {
    const other = c.participants?.find((p) => p.userId !== session?.user?.id);
    return other?.user?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="h-screen flex" style={{ background: 'var(--bg-base)' }}>
      {/* Conversations List */}
      <div className={`w-full sm:w-80 flex-shrink-0 border-r flex flex-col ${activeConvId ? 'hidden sm:flex' : 'flex'}`} style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-bold text-lg mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search conversations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-sm py-2"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <div className="space-y-2 p-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex gap-3 p-2">
                  <div className="skeleton w-11 h-11 rounded-full flex-shrink-0" />
                  <div className="flex-1">
                    <div className="skeleton h-4 rounded mb-2" style={{ width: '60%' }} />
                    <div className="skeleton h-3 rounded" style={{ width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredConvs.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-10 h-10 mx-auto mb-3" style={{ color: 'var(--text-muted)' }} />
              <p className="text-sm" style={{ color: 'var(--text-muted)' }}>No conversations yet.<br />Book a ride to start chatting!</p>
            </div>
          ) : filteredConvs.map((conv) => (
            <ConversationItem
              key={conv.id}
              conv={conv}
              isActive={conv.id === activeConvId}
              currentUserId={session?.user?.id}
              onClick={() => setActiveConvId(conv.id)}
            />
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className={`flex-1 flex flex-col ${!activeConvId ? 'hidden sm:flex' : 'flex'}`}>
        {!activeConvId ? (
          <div className="flex-1 flex items-center justify-center flex-col">
            <MessageSquare className="w-16 h-16 mb-4" style={{ color: 'var(--text-muted)' }} />
            <h3 className="text-lg font-semibold mb-2">Select a conversation</h3>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Choose a chat from the left to start messaging</p>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
              <button
                onClick={() => setActiveConvId(null)}
                className="sm:hidden btn-ghost w-8 h-8 p-0 rounded-full mr-1"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center text-white font-bold overflow-hidden">
                {otherUser?.image ? <img src={otherUser.image} alt="" className="w-full h-full object-cover" /> : otherUser?.name?.[0]}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-sm">{otherUser?.name || 'User'}</div>
                {isTyping ? (
                  <div className="flex items-center gap-1">
                    <div className="flex gap-0.5">
                      {[...Array(3)].map((_, i) => (
                        <motion.div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--primary)' }}
                          animate={{ y: [0, -4, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />
                      ))}
                    </div>
                    <span className="text-xs" style={{ color: 'var(--primary)' }}>typing...</span>
                  </div>
                ) : (
                  <div className="text-xs" style={{ color: 'var(--success)' }}>● Online</div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button className="btn-ghost w-9 h-9 p-0 rounded-full"><Phone className="w-4 h-4" /></button>
                <button className="btn-ghost w-9 h-9 p-0 rounded-full"><Video className="w-4 h-4" /></button>
                <button className="btn-ghost w-9 h-9 p-0 rounded-full"><MoreVertical className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4" style={{ background: 'var(--bg-base)' }}>
              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <MessageBubble msg={msg} isOwn={msg.senderId === session?.user?.id} />
                  </motion.div>
                ))}
              </AnimatePresence>
              {isTyping && (
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1 px-4 py-2.5 rounded-2xl" style={{ background: 'var(--bg-surface)' }}>
                    {[...Array(3)].map((_, i) => (
                      <motion.div key={i} className="w-2 h-2 rounded-full" style={{ background: 'var(--text-muted)' }}
                        animate={{ y: [0, -4, 0] }} transition={{ delay: i * 0.15, repeat: Infinity, duration: 0.6 }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-elevated)' }}>
              <div className="flex items-end gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-ghost w-9 h-9 p-0 rounded-full flex-shrink-0"
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                <div className="flex-1 relative">
                  <textarea
                    value={input}
                    onChange={handleTyping}
                    onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                    placeholder="Type a message..."
                    rows={1}
                    className="input-field resize-none pr-10 text-sm"
                    style={{ minHeight: 44, maxHeight: 120 }}
                  />
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center flex-shrink-0 disabled:opacity-40"
                >
                  {sending ? <Loader2 className="w-4 h-4 text-white animate-spin" /> : <Send className="w-4 h-4 text-white" />}
                </motion.button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
