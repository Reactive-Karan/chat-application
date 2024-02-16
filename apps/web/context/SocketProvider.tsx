"use client"
import React, { useCallback, useContext, useEffect, useState } from "react"
import { io, Socket } from "socket.io-client"



interface SocketProviderProps {
    children?: React.ReactNode
}

interface IMessage {
    text: string,
    sender: string
}

interface ISocketContext {
    sendMessage: (msg: string, name: string) => any
    messages: IMessage[]
}

const SocketContext = React.createContext<ISocketContext | null>(null)

export const useSocket = () => {
    const state = useContext(SocketContext)

    if (!state) throw new Error("State is not defined")

    return state
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {

    const BASE_URL = `http://localhost:8080`;


    const [socket, setSocket] = useState<Socket>()
    const [messages, setMessages] = useState<IMessage[]>([])

    const sendMessage: ISocketContext['sendMessage'] = useCallback((msg: string, name: string) => {
        if (socket) {
            socket.emit("event:message", { message: msg, name })
            // publish this message to redis
        }
        console.log("Send Message", msg)
    }, [socket])


    const onMessageReceived = useCallback((msg: string) => {
        console.log("From Server Msg Recieved", msg)
        const { message } = JSON.parse(msg) as { message: string }
        setMessages((prev) => [...prev, { text: message, sender: 'server' }])
    }
        , [])

    useEffect(() => {
        const _socket = io(BASE_URL)

        setSocket(_socket)

        _socket.on("message", onMessageReceived)

        return () => {
            _socket.disconnect()
            _socket.off("message", onMessageReceived)
            setSocket(undefined)
        }
    }, [])

    return (
        <SocketContext.Provider value={{ sendMessage, messages }}>
            {children}
        </SocketContext.Provider>
    )
}
