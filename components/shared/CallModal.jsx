'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, PhoneOff, Video, VideoOff, Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useSocket } from '@/contexts/SocketContext';

export default function CallModal({ targetUserId, targetUserName, targetUserImage, rideId, onClose }) {
  const { socket } = useSocket();
  const [callState, setCallState] = useState('calling'); // calling | connected | ended | rejected
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(true);
  const [isSpeakerOff, setIsSpeakerOff] = useState(false);
  const [duration, setDuration] = useState(0);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const timerRef = useRef(null);

  const rtcConfig = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ],
  };

  useEffect(() => {
    if (!socket) return;
    initCall();

    socket.on('call:answer', async ({ sdp }) => {
      if (!peerConnectionRef.current) return;
      await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
      setCallState('connected');
      timerRef.current = setInterval(() => setDuration((d) => d + 1), 1000);
    });

    socket.on('call:ice-candidate', async ({ candidate }) => {
      if (peerConnectionRef.current && candidate) {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    });

    socket.on('call:rejected', () => {
      setCallState('rejected');
      setTimeout(handleEnd, 2000);
    });

    socket.on('call:ended', () => {
      setCallState('ended');
      setTimeout(onClose, 1500);
    });

    return () => {
      socket.off('call:answer');
      socket.off('call:ice-candidate');
      socket.off('call:rejected');
      socket.off('call:ended');
    };
  }, [socket]);

  const initCall = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: !isVideoOff });
      localStreamRef.current = stream;

      if (localVideoRef.current) localVideoRef.current.srcObject = stream;

      const pc = new RTCPeerConnection(rtcConfig);
      peerConnectionRef.current = pc;

      stream.getTracks().forEach((track) => pc.addTrack(track, stream));

      pc.onicecandidate = ({ candidate }) => {
        if (candidate && socket) {
          socket.emit('call:ice-candidate', { targetUserId, candidate });
        }
      };

      pc.ontrack = (e) => {
        if (remoteVideoRef.current) remoteVideoRef.current.srcObject = e.streams[0];
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      socket?.emit('call:offer', { targetUserId, sdp: offer, callerName: 'User', rideId });
    } catch (err) {
      console.error('Call init error:', err);
      setCallState('ended');
    }
  };

  const handleEnd = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    localStreamRef.current?.getTracks().forEach((t) => t.stop());
    peerConnectionRef.current?.close();
    socket?.emit('call:end', { targetUserId });
    onClose();
  };

  const toggleMute = () => {
    localStreamRef.current?.getAudioTracks().forEach((t) => { t.enabled = !t.enabled; });
    setIsMuted((m) => !m);
  };

  const formatDuration = (s) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(16px)' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="rounded-3xl p-8 w-full max-w-sm text-center"
        style={{ background: 'linear-gradient(135deg, #1a1a2e, #0f3460)' }}
      >
        {/* Avatar */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className="w-24 h-24 rounded-full overflow-hidden gradient-primary flex items-center justify-center text-white text-3xl font-bold">
            {targetUserImage ? <img src={targetUserImage} alt="" className="w-full h-full object-cover" /> : targetUserName?.[0]}
          </div>
          {callState === 'calling' && (
            <div className="absolute inset-0 rounded-full border-4 border-[var(--primary)] animate-ping opacity-30" />
          )}
        </div>

        <h3 className="text-xl font-bold text-white mb-1">{targetUserName}</h3>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>
          {callState === 'calling' && 'Calling...'}
          {callState === 'connected' && `🟢 ${formatDuration(duration)}`}
          {callState === 'rejected' && '❌ Call rejected'}
          {callState === 'ended' && 'Call ended'}
        </p>

        {/* Video (hidden when isVideoOff) */}
        <video ref={remoteVideoRef} autoPlay playsInline className={`w-full rounded-xl mb-4 ${isVideoOff ? 'hidden' : ''}`} style={{ maxHeight: 160 }} />
        <video ref={localVideoRef} autoPlay playsInline muted className={`w-24 h-24 rounded-xl absolute bottom-24 right-4 ${isVideoOff ? 'hidden' : ''}`} />

        {/* Controls */}
        {(callState === 'calling' || callState === 'connected') && (
          <div className="flex justify-center gap-4">
            <button onClick={toggleMute}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
              style={{ background: isMuted ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.1)' }}>
              {isMuted ? <MicOff className="w-6 h-6 text-red-400" /> : <Mic className="w-6 h-6 text-white" />}
            </button>

            <button onClick={handleEnd}
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ background: '#ef4444' }}>
              <PhoneOff className="w-7 h-7 text-white" />
            </button>

            <button onClick={() => setIsSpeakerOff((s) => !s)}
              className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
              style={{ background: 'rgba(255,255,255,0.1)' }}>
              {isSpeakerOff ? <VolumeX className="w-6 h-6 text-white" /> : <Volume2 className="w-6 h-6 text-white" />}
            </button>
          </div>
        )}
      </motion.div>
    </div>
  );
}
