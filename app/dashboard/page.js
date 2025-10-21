'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Send, Plus, Menu, Search, Trash2, Smile, Settings, Paperclip, ChevronDown } from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'
import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import Link from 'next/link'
import Image from 'next/image'


export default function Dashboard() {
    const { data: session, status } = useSession()
    const router = useRouter()
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [showNewChatModal, setShowNewChatModal] = useState(false)
    const [chatType, setChatType] = useState('DM')
    const [chatTitle, setChatTitle] = useState('')
    const [selectedUsers, setSelectedUsers] = useState([])
    const [userList, setUserList] = useState([])
    const [messageSearch, setMessageSearch] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [sending, setSending] = useState(false)
    const [isAtBottom, setIsAtBottom] = useState(true)
    const messagesEndRef = useRef(null)
    const pollIntervalRef = useRef(null)

    useEffect(() => {
        if (status === 'loading') {
            const timeout = setTimeout(() => {
                setError('Session loading timed out. Please refresh.')
                setLoading(false)
            }, 10000)
            return () => clearTimeout(timeout)
        }
        if (status === 'authenticated') {
            fetchConversations()
            fetchUserList()
        } else if (status === 'unauthenticated') {
            router.push('/login')
        }
    }, [status, router, fetchConversations, fetchUserList])

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages()
            pollIntervalRef.current = setInterval(fetchMessages, 5000)
        }
        return () => clearInterval(pollIntervalRef.current)
    }, [selectedConversation, fetchMessages])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    useEffect(() => {
        if (showNewChatModal) {
            fetchUserList()
        }
    }, [showNewChatModal])

    const fetchConversations = useCallback(async () => {
        try {
            const res = await fetch('/api/conversations')
            if (res.ok) {
                const data = await res.json()
                setConversations(data)
            } else {
                setError('Failed to load conversations')
            }
        } catch (err) {
            setError('Network error: Unable to load conversations')
        } finally {
            setLoading(false)
        }
    }, [])

    const fetchUserList = useCallback(async () => {
        try {
            const res = await fetch('/api/users')
            if (res.ok) {
                const data = await res.json()
                setUserList(data)
            }
        } catch (err) {
            console.error('Failed to fetch users')
        }
    }, [])

    const fetchMessages = useCallback(async () => {
        if (!selectedConversation) return
        try {
            const res = await fetch(`/api/messages?conversationId=${selectedConversation.id}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            } else {
                setError('Failed to load messages')
            }
        } catch (err) {
            setError('Network error: Unable to load messages')
        }
    }, [selectedConversation])

    const sendMessage = async () => {
        if (!newMessage.trim() || sending) return
        setSending(true)
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newMessage, conversationId: selectedConversation.id })
            })
            if (res.ok) {
                toast.success('Message sent!')
                setNewMessage('')
                fetchMessages()
            } else {
                toast.error('Failed to send message')
            }
        } catch (err) {
            toast.error('Network error: Unable to send message')
        } finally {
            setSending(false)
        }
    }

    const createNewChat = async () => {
        if (!chatTitle.trim()) return
        try {
            const participants = [session.user.id, ...selectedUsers]
            const res = await fetch('/api/conversations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: chatTitle,
                    type: chatType,
                    participants
                })
            })
            if (res.ok) {
                toast.success('Chat created!')
                setShowNewChatModal(false)
                setChatTitle('')
                setSelectedUsers([])
                fetchConversations()
            } else {
                toast.error('Failed to create chat')
            }
        } catch (err) {
            toast.error('Network error: Unable to create chat')
        }
    }

    const deleteMessage = async (messageId) => {
        try {
            const res = await fetch(`/api/messages?messageId=${messageId}`, { method: 'DELETE' })
            if (res.ok) {
                toast.success('Message deleted!')
                fetchMessages()
            } else {
                toast.error('Failed to delete message')
            }
        } catch (err) {
            toast.error('Network error: Unable to delete message')
        }
    }

    const groupMessagesByDate = (messages) => {
        const groups = {}
        messages.forEach(msg => {
            const date = new Date(msg.createdAt).toDateString()
            if (!groups[date]) groups[date] = []
            groups[date].push(msg)
        })
        return groups
    }

    const handleScroll = (e) => {
        const { scrollTop, scrollHeight, clientHeight } = e.target
        setIsAtBottom(scrollTop + clientHeight >= scrollHeight - 10)
    }

    if (status === 'loading' || loading) {
        return (
            <main className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="rounded-full h-12 w-12 border-4 border-indigo-200 border-t-indigo-600 animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-700 font-medium">Loading your chats...</p>
                </div>
            </main>
        )
    }

    return (
        <div className="flex flex-col h-screen bg-slate-50 font-sans">
            <header className="bg-white border-b border-gray-200 p-4 shadow-sm flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <Image src={session?.user?.image || '/default-avatar.png'} alt="Profile" className="w-10 h-10 rounded-full border-2 border-indigo-200" />
                    <h1 className="text-xl font-semibold text-gray-800">{session?.user?.name || 'Signal'}</h1>
                </div>
                <div className="flex items-center space-x-2">
                    <Link href="/settings" className="p-2 text-gray-600 hover:text-indigo-600">
                        <Settings size={20} />
                    </Link>
                    <button onClick={() => signOut({ callbackUrl: '/login' })} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                        Logout
                    </button>
                </div>
            </header>
            <div className="flex flex-1 overflow-hidden">
                <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff' } }} />
            
            <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="md:hidden fixed top-20 left-4 z-50 p-3 bg-white text-indigo-600 rounded-lg shadow-lg hover:shadow-xl border border-indigo-200"
            >
                <Menu size={20} />
            </button>
        
            <div className={`w-full md:w-1/4 bg-white border-r border-gray-200 p-6 shadow-xl ${sidebarOpen ? 'block' : 'hidden'} md:block fixed md:relative z-40 h-full mt-16 md:mt-0`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-800 bg-indigo-600 bg-clip-text text-transparent">Chats</h2>
                </div>
                {loading ? (
                    <Skeleton count={5} height={60} className="mb-3 rounded-xl" />
                ) : (
                    <ul className="space-y-3">
                        {conversations.map((conversation) => (
                            <li
                                key={conversation.id}
                                onClick={() => { setSelectedConversation(conversation); setSidebarOpen(false) }}
                                className={`p-4 rounded-lg cursor-pointer hover:bg-indigo-50 border ${selectedConversation?.id === conversation.id ? 'bg-indigo-100 border-indigo-300 shadow-md' : 'border-gray-200'}`}
                            >
                                <p className="font-semibold text-gray-800">{conversation.title || 'New Chat'}</p>
                                <p className="text-sm text-gray-600 truncate mt-1">
                                    {conversation.lastMessage?.content || 'Start chatting!'}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
    
            <div className="flex-1 flex flex-col md:ml-0">
                {selectedConversation ? (
                    <>
                    
                        <div className="bg-white border-b border-gray-200 p-6 shadow-sm flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-800">{selectedConversation.title || 'Chat'}</h3>
                            <div className="flex items-center">
                                <input
                                    type="text"
                                    value={messageSearch}
                                    onChange={(e) => setMessageSearch(e.target.value)}
                                    placeholder="Search messages..."
                                    className="w-48 p-1 border border-gray-300 rounded-lg focus:outline-none text-xs"
                                />
                                <Search size={18} className="ml-2 text-gray-500" />
                            </div>
                        </div>
                
                        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-white relative" onScroll={handleScroll}>
                            {(() => {
                                const groupedMessages = groupMessagesByDate(messages.filter(msg => msg.content.toLowerCase().includes(messageSearch.toLowerCase())))
                                return Object.entries(groupedMessages).map(([date, msgs]) => (
                                    <div key={date}>
                                        <div className="text-center my-4">
                                            <span className="bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-sm">
                                                {date === new Date().toDateString() ? 'Today' : new Date(date).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {msgs.map((message) => (
                                            <div key={message.id} className={`flex items-end space-x-3 mb-4 ${message.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}>
                                                {message.senderId !== session.user.id && (
                                                    <Image src={message.sender.image || '/default-avatar.png'} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                                                )}
                                                <div className={`relative p-4 rounded-lg max-w-md shadow-lg ${message.senderId === session.user.id ? 'bg-indigo-600 text-white' : 'bg-white text-gray-900 border border-gray-200'}`}>
                                                    <p className="text-sm leading-relaxed">{message.content}</p>
                                                    <p className="text-xs opacity-70 mt-2">{new Date(message.createdAt).toLocaleTimeString()}</p>
                                                    {message.senderId === session.user.id && (
                                                        <button onClick={() => deleteMessage(message.id)} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 text-xs hover:bg-red-600 shadow-md">
                                                            <Trash2 size={12} />
                                                        </button>
                                                    )}
                                                </div>
                                                {message.senderId === session.user.id && (
                                                    <Image src={session.user.image || '/default-avatar.png'} alt="Your Avatar" className="w-10 h-10 rounded-full border-2 border-white shadow-md" />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))
                            })()}
                            <div ref={messagesEndRef} />
                        </div>
                        {!isAtBottom && (
                            <button
                                onClick={() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="absolute bottom-24 right-6 bg-indigo-600 text-white rounded-lg p-3 shadow-lg hover:bg-indigo-700"
                            >
                                <ChevronDown size={20} />
                            </button>
                        )}
                    
                        <div className="bg-white border-t border-gray-200 p-6 rounded-l-lg relative">
                        
                            <div className="flex items-center space-x-3">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type your message..."
                                    className="flex-1 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
                                    disabled={sending}
                                />
                                <button
                                    onClick={sendMessage}
                                    className="p-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg disabled:opacity-50"
                                    disabled={sending}
                                >
                                    <Send size={20} />
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-indigo-50 rounded-l-lg">
                        <div className="text-center">
                            <p className="text-gray-700 font-medium text-lg">Select a chat to start messaging</p>
                        </div>
                    </div>
                )}
            </div>
            
            <button
                onClick={() => setShowNewChatModal(true)}
                className="fixed bottom-6 left-6 bg-indigo-600 text-white rounded-lg p-5 shadow-2xl hover:shadow-3xl z-50"
            >
                <Plus size={24} />
            </button>
        
            {showNewChatModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white p-8 rounded-lg w-96 max-h-96 overflow-y-auto shadow-2xl border border-gray-200">
                        <h3 className="text-2xl font-bold mb-6 text-gray-800 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Start New Chat</h3>
                        <select value={chatType} onChange={(e) => { setChatType(e.target.value); setSelectedUsers([]) }} className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all">
                            <option value="DM">Direct Message</option>
                            <option value="GROUP">Group Chat</option>
                        </select>
                        <input type="text" value={chatTitle} onChange={(e) => setChatTitle(e.target.value)} placeholder="Chat Title" className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                        <div className="mb-6">
                            <label className="block text-sm font-medium mb-3 text-gray-700">Choose {chatType === 'DM' ? 'a friend' : 'friends'}:</label>
                            <div className="max-h-32 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
                                {userList.map((user) => (
                                        <label key={user.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                                        <input
                                            type={chatType === 'DM' ? 'radio' : 'checkbox'}
                                            name="selectedUsers"
                                            value={user.id}
                                            checked={selectedUsers.includes(user.id)}
                                            onChange={(e) => {
                                                if (chatType === 'DM') {
                                                    setSelectedUsers([e.target.value])
                                                } else {
                                                    setSelectedUsers(prev => 
                                                        e.target.checked 
                                                            ? [...prev, e.target.value] 
                                                            : prev.filter(id => id !== e.target.value)
                                                    )
                                                }
                                            }}
                                            className="form-radio text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <Image src={user.image || '/default-avatar.png'} alt="Avatar" className="w-8 h-8 rounded-full" />
                                        <span className="text-gray-800 font-medium">{user.name || user.email}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div className="flex justify-end space-x-3">
                            <button onClick={() => { setShowNewChatModal(false); setSelectedUsers([]) }} className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                                Cancel
                            </button>
                            <button onClick={createNewChat} className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-lg">
                                Create Chat
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
    )
}
