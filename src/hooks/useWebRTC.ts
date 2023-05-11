import {useEffect, useRef, useCallback } from "react";
import useStateWithCallback from "./useStateWithCallback"
import socket from "../socket"

const freeice = require('freeice')
import ACTIONS from "../socket/actions"

export const LOCAL_VIDEO = 'LOCAL_VIDEO'

interface Data {
    current: number | string;
}

export default function useWebRTC(roomID: string){
    const [clients, setClients] = useStateWithCallback([])

    const peerConnections = useRef({}) as any
    const localMediaStream = useRef(null) as any
    const peerMediaElements = useRef({
        [LOCAL_VIDEO]: null
    }) as any

    const addNewClient = useCallback((newClient: typeof clients, callback: () => void) => {
        if(!clients.includes(newClient)){
            setClients((clientsList: [typeof clients])  => [...clientsList, newClient], callback)
        }
    }, [clients, setClients]);

    useEffect(() => {
        async function handleNewPeer({ peerID, createOffer }: { peerID: string, createOffer?: () => void }) {
            if(peerID in peerConnections.current){
                return console.warn(`Already connected to peer ${peerID}`)
            }
            peerConnections.current[peerID]  = new RTCPeerConnection({
                iceServers: freeice()
            })

            peerConnections.current[peerID].onicecandidate = (event : RTCIceCandidate) => {
                if(event.candidate){
                    socket.emit(ACTIONS.RELAY_ICE, {
                        peerID,
                        iceCandidate: event.candidate
                    })
                }
            }

            let tracksNumber = 0
            peerConnections.current[peerID].ontrack = ({streams: [remoteStream]}: {streams: [MediaStream]}) => {
                tracksNumber++

                if(tracksNumber === 2){
                    addNewClient(peerID, () => {
                        peerMediaElements.current[peerID].srcObject = remoteStream
                    })
                }
            }
            localMediaStream.current.getTracks().forEach((track: MediaStreamTrack) => {
                peerConnections.current[peerID].addTrack(track, localMediaStream.current)
            })

            if(createOffer){
                const offer = await peerConnections.current[peerID].createOffer()
                await peerConnections.current[peerID].setLocalDescription(offer)
                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer
                })
            }
        }
        socket.on(ACTIONS.ADD_PEER, handleNewPeer)
    }, [])

    useEffect(() => {
        async function setRemoteMedia({peerID, sessionDescription: remoteDescription} : {peerID: string, sessionDescription: RTCSessionDescription}){
            await peerConnections.current[peerID].setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            )

            if(remoteDescription.type === 'offer'){
                const answer = await peerConnections.current[peerID].createAnswer()
                await peerConnections.current[peerID].setLocalDescription(answer)

                socket.emit(ACTIONS.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer
                })
            }
        }
        socket.on(ACTIONS.SESSION_DESCRIPTION, setRemoteMedia)
    }, [])

    useEffect(() => {
        socket.on(ACTIONS.ICE_CANDIDATE, ({peerID, iceCandidate}: {peerID: string, iceCandidate: RTCIceCandidate}) => {
          peerConnections.current[peerID].addIceCandidate(
              new RTCIceCandidate(iceCandidate)
          )
        })
    }, [])

    useEffect(() => {
        const handleRemovePeer = ({peerID} : {peerID: string}) => {
            if(peerConnections.current[peerID]){
                peerConnections.current[peerID].close()
            }
            delete peerConnections.current[peerID]
            delete peerMediaElements.current[peerID]

            setClients((list:Array<typeof clients>) => list.filter((client: typeof clients) => client !== peerID))
        }
        return() => {
            socket.on(ACTIONS.REMOVE_PEER, handleRemovePeer)
        }
    })

    useEffect(() => {
        async function startCapture() {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
                video: {
                    width: 1280,
                    height: 720
                }
            })

            addNewClient(LOCAL_VIDEO, () => {
                const localVideoElement = peerMediaElements.current[LOCAL_VIDEO]

                if(localVideoElement) {
                    localVideoElement.volume = 0;
                    localVideoElement.srcObject  = localMediaStream.current;
                }
            })
        }

        startCapture()
            .then(() => socket.emit(ACTIONS.JOIN_ROOM, { room: roomID}))
            .catch(e => console.error('Error getting user media ', e))

        return() => {
            localMediaStream.current.getTracks().forEach((track: MediaStreamTrack) => track.stop())
            socket.emit(ACTIONS.LEAVE_ROOM)
        }
    }, [roomID])

    const provideMediaRef = useCallback((id: string, node: HTMLVideoElement | null) => {
        peerMediaElements.current[id] = node
    }, [])

    return {clients, provideMediaRef}
}