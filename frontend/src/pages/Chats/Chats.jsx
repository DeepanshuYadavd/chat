import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  Send, 
  Info, 
  Smile, 
  Paperclip, 
  MessageSquare, 
  Sparkles, 
  Lock, 
  RefreshCw,
  Clock
} from 'lucide-react';
import { io } from 'socket.io-client';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import './Chats.css';

function Chats() {
  const { user: currentUser } = useAuth();
  const toast = useToast();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [messageText, setMessageText] = useState('');
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 1. Fetch registered users for the sidebar on mount
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/auth/get-users');
      if (response.data && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;

      if (status === 400 && message === 'No users Found') {
        setUsers([]);
      } else {
        const errMsg = message || 'Failed to fetch users';
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 2. Establish Socket.IO connection and set up real-time listener
  useEffect(() => {
    if (!currentUser) return;

    // Connect to WebSocket server running on port 5000 (backend port)
    const socket = io('http://localhost:5000');
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to socket server:', socket.id);
    });

    // Listen for incoming messages broadcasted from MongoDB/Sockets
    socket.on('receive_message', (newMessage) => {
      setMessages((prev) => {
        // Prevent duplicate logs
        if (prev.some((m) => m._id === newMessage._id)) return prev;
        return [...prev, newMessage];
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, [currentUser]);

  // 3. Auto-scroll to latest messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 4. Click User -> Get/Create Chat Room -> Fetch Historical Messages & Join Socket Room
  const handleSelectUser = async (userToChat) => {
    setSelectedUser(userToChat);
    setMessagesLoading(true);
    setMessages([]);
    setActiveChat(null);

    const targetUserId = userToChat._id || userToChat.id;

    try {
      // Step A: Create/Retrieve 1-on-1 private chat in the database
      const response = await api.post('/chats/create', {
        users: [targetUserId],
        isGroupChat: false
      });

      const chatRoom = response.data;
      setActiveChat(chatRoom);

      // Step B: Join the socket room for this chat session
      if (socketRef.current) {
        socketRef.current.emit('join_chat', chatRoom._id);
      }

      // Step C: Fetch existing message history from MongoDB
      const msgResponse = await api.get(`/messages/get/${chatRoom._id}`);
      if (Array.isArray(msgResponse.data)) {
        setMessages(msgResponse.data);
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
      toast.error('Failed to establish connection with user');
    } finally {
      setMessagesLoading(false);
    }
  };

  // 5. Send message via Socket (writes to database and broadcasts in real-time)
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChat || !currentUser) return;

    const currentUserId = currentUser.id || currentUser._id;

    const messagePayload = {
      sender: currentUserId,
      content: messageText.trim(),
      chatId: activeChat._id
    };

    // Emit send_message to backend socket handler
    if (socketRef.current) {
      socketRef.current.emit('send_message', messagePayload);
    }

    setMessageText('');
  };

  // Filter users list by search query
  const filteredUsers = users.filter(u => 
    u.userName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Avatar dynamic styling builder
  const getAvatarGradient = (name = 'A') => {
    const code = name.charCodeAt(0) % 5;
    const gradients = [
      'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', // Indigo to Purple
      'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)', // Cyan to Blue
      'linear-gradient(135deg, #10b981 0%, #059669 100%)', // Emerald
      'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber
      'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)', // Pink to Violet
    ];
    return gradients[code];
  };

  return (
    <div className="chats-page-wrapper">
      <div className="chats-container-card">
        {/* SIDEBAR PANEL */}
        <div className="chats-sidebar">
          <div className="sidebar-header">
            <div className="sidebar-brand">
              <Sparkles className="sparkle-icon animate-pulse-glow" size={18} />
              <h2>Conversations</h2>
            </div>
            
            {currentUser && (
              <div className="current-user-identity">
                <div 
                  className="user-avatar-circle" 
                  style={{ background: getAvatarGradient(currentUser.userName) }}
                >
                  {currentUser.userName?.charAt(0).toUpperCase()}
                </div>
                <div className="user-identity-details">
                  <span className="user-identity-name">{currentUser.userName}</span>
                  <span className="user-identity-status">Online</span>
                </div>
              </div>
            )}
          </div>

          <div className="sidebar-search">
            <Search className="search-icon" size={16} />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sidebar-users-list">
            {loading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <div key={idx} className="skeleton-user-item">
                  <div className="skeleton-avatar shunt-pulse" />
                  <div className="skeleton-details">
                    <div className="skeleton-line-title shunt-pulse" />
                    <div className="skeleton-line-sub shunt-pulse" />
                  </div>
                </div>
              ))
            ) : error ? (
              <div className="sidebar-error-state">
                <p>{error}</p>
                <button onClick={fetchUsers} className="retry-btn">
                  <RefreshCw size={14} /> Retry
                </button>
              </div>
            ) : users.length === 0 ? (
              <div className="no-users-found">
                <div className="empty-globe-icon-wrapper">
                  <MessageSquare size={32} className="empty-message-icon" />
                </div>
                <h3>No Users Exist</h3>
                <p>You are currently the first member here! Once other users register, they will instantly appear in this sidebar.</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="no-search-results">
                <p>No contacts match "{searchQuery}"</p>
              </div>
            ) : (
              filteredUsers.map((u) => {
                const userId = u._id || u.id;
                const isSelected = selectedUser && (selectedUser._id === u._id || selectedUser.id === u.id);
                return (
                  <button 
                    key={userId} 
                    onClick={() => handleSelectUser(u)}
                    className={`user-item-btn ${isSelected ? 'active' : ''}`}
                  >
                    <div 
                      className="user-avatar-circle" 
                      style={{ background: getAvatarGradient(u.userName) }}
                    >
                      {u.userName?.charAt(0).toUpperCase()}
                      <span className="online-indicator-dot" />
                    </div>
                    <div className="user-item-details">
                      <div className="user-item-header">
                        <span className="user-item-name">{u.userName}</span>
                        <span className="user-item-time"><Clock size={10} style={{marginRight: '2px'}}/> Active</span>
                      </div>
                      <span className="user-item-email">{u.email}</span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* FEED / CONVERSATION PANEL */}
        <div className="chats-feed">
          {selectedUser ? (
            <div className="feed-active-chat">
              {/* Header bar */}
              <div className="chat-header">
                <div className="chat-header-identity">
                  <div 
                    className="user-avatar-circle" 
                    style={{ background: getAvatarGradient(selectedUser.userName) }}
                  >
                    {selectedUser.userName?.charAt(0).toUpperCase()}
                  </div>
                  <div className="chat-header-details">
                    <h3>{selectedUser.userName}</h3>
                    <span className="header-status">
                      <span className="status-pulse-dot" /> Active Now
                    </span>
                  </div>
                </div>

                <div className="chat-header-actions">
                  <button className="action-btn" title="Conversation Details">
                    <Info size={18} />
                  </button>
                </div>
              </div>

              {/* Messages feed area */}
              <div className="chat-messages-container">
                {messagesLoading ? (
                  <div className="feed-messages-loading">
                    <RefreshCw className="spinner-icon animate-pulse-glow" size={24} />
                    <p>Loading message logs...</p>
                  </div>
                ) : (
                  <div className="messages-scroller">
                    {/* End-to-end encryption notification bubble */}
                    <div className="system-indicator-message">
                      <Lock size={12} className="lock-icon" />
                      <span>🔒 Messages are end-to-end encrypted. No one outside of this chat, not even OmniChat, can read them.</span>
                    </div>

                    {messages.map((msg) => {
                      const senderId = msg.sender?._id || msg.sender;
                      const currentUserId = currentUser.id || currentUser._id;
                      const isCurrentUser = senderId === currentUserId;

                      return (
                        <div 
                          key={msg._id || msg.id} 
                          className={`message-bubble-wrapper ${isCurrentUser ? 'outgoing' : 'incoming'}`}
                        >
                          <div className="bubble-content-box">
                            <p className="bubble-text">{msg.content}</p>
                            <span className="bubble-timestamp">
                              {msg.createdAt 
                                ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                : new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                              }
                            </span>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>

              {/* Input field footer */}
              <form onSubmit={handleSendMessage} className="chat-input-bar">
                <div className="input-options-group">
                  <button type="button" className="input-icon-btn" title="Attach file">
                    <Paperclip size={18} />
                  </button>
                  <button type="button" className="input-icon-btn" title="Add emoji">
                    <Smile size={18} />
                  </button>
                </div>
                
                <input 
                  type="text" 
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder={`Write your message to ${selectedUser.userName}...`}
                  className="chat-message-input"
                />
                
                <button 
                  type="submit" 
                  disabled={!messageText.trim()} 
                  className="chat-send-btn"
                  title="Send message"
                >
                  <Send size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="feed-empty-state">
              <div className="welcome-glow-orb" />
              <div className="welcome-graphic">
                <MessageSquare className="graphic-icon animate-pulse-glow" size={48} />
              </div>
              <h2>Select a Conversation</h2>
              <p>Choose an active contact from the sidebar list to start exchanging real-time secure messages. OmniChat keeps your data protected.</p>
              
              <div className="welcome-badge">
                <Lock size={12} />
                <span>End-to-End Encrypted Space</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chats;
