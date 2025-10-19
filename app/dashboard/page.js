'use client'
import { useSession, signOut } from 'next-auth/react'
import { useState, useEffect, useRef } from 'react'

export default function Dashboard() {
    const { data: session, status } = useSession()
    const [conversations, setConversations] = useState([])
    const [selectedConversation, setSelectedConversation] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const messagesEndRef = useRef(null)
    const pollIntervalRef = useRef(null)

    useEffect(() => {
        if (status === 'authenticated') {
            fetchConversations()
        }
    }, [status])

    useEffect(() => {
        if (selectedConversation) {
            fetchMessages()
            pollIntervalRef.current = setInterval(fetchMessages, 5000)
            return () => clearInterval(pollIntervalRef.current)
        }
    }, [selectedConversation])

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/conversations')
            if (res.ok) {
                const data = await res.json()
                setConversations(data)
            } else {
                setError('Failed to load conversations')
            }
        } catch (err) {
            setError('Network error')
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async () => {
        if (!selectedConversation) return
        try {
            const res = await fetch(`/api/messages?conversationId=${selectedConversation.id}`)
            if (res.ok) {
                const data = await res.json()
                setMessages(data)
            }
        } catch (err) {
            console.error('Failed to fetch messages')
        }
    }

    const sendMessage = async () => {
        if (!newMessage.trim()) return
        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: newMessage,
                    conversationId: selectedConversation.id
                })
            })
            if (res.ok) {
                setNewMessage('')
                fetchMessages()
            }
        } catch (err) {
            console.error('Failed to send message')
        }
    }

    if (status === 'loading' || loading) {
        return (
           
                <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                        <p className="mt-4 text-gray-600">Loading dashboard...</p>
                    </div>
                </main>
            
        )
    }


    return (
        
            <main className="min-h-screen bg-gray-50 flex">
            <div className="w-1/4 bg-white border-r border-gray-200 p-4">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold">Conversations</h2>
                    <button
                        onClick={() => signOut()}
                        className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                    >
                        Logout
                    </button>
                </div>
                {error && <p className="text-red-600 text-sm mb-4">{error}</p>}
                <ul className="space-y-2">
                    {conversations.map((conv) => (
                        <li
                            key={conv.id}
                            onClick={() => setSelectedConversation(conv)}
                            className={`p-3 rounded cursor-pointer hover:bg-gray-100 ${selectedConversation?.id === conv.id ? 'bg-indigo-100' : ''
                                }`}
                        >
                            <p className="font-medium">{conv.name || 'Unnamed Chat'}</p>
                            <p className="text-sm text-gray-600 truncate">
                                {conv.lastMessage?.content || 'No messages'}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>


            <div className="flex-1 flex flex-col">
                {selectedConversation ? (
                    <>

                        <div className="bg-white border-b border-gray-200 p-4">
                            <h3 className="text-lg font-medium">{selectedConversation.name || 'Chat'}</h3>
                        </div>


                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex ${msg.senderId === session.user.id ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === session.user.id
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-gray-200 text-gray-800'
                                            }`}
                                    >
                                        <p className="text-sm">{msg.content}</p>
                                        <p className="text-xs opacity-70 mt-1">
                                            {new Date(msg.createdAt).toLocaleTimeString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>


                        <div className="bg-white border-t border-gray-200 p-4">
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
                                />
                                <button
                                    onClick={sendMessage}
                                    className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-gray-500">Select a conversation to start chatting</p>
                    </div>
                )}
            </div>
            </main>
        
    )
}
