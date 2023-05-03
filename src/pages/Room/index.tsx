import React from 'react';
import { useParams } from "react-router";
import useWebRTC from "../../hooks/useWebRTC";
import {LOCAL_VIDEO} from "../../hooks/useWebRTC";

type pairsType =  [[number] | []]

const Room = () => {
    const { id: roomID } = useParams()
    const {clients, provideMediaRef} = useWebRTC(roomID as string)
    const videoLayout = layout(clients.length)

    function layout(clientsNumber: number = 1) {
        const pairs = Array.from<pairsType>({ length: clientsNumber})
            .reduce((acc: Array<any>, next, index, arr) => {
            if( index % 2 === 0){
                acc.push(arr.slice(index, index+2))
            }
            return acc;
        }, [])

        const rowsNumber = pairs.length;
        const height = `${100 / rowsNumber}%`

        return pairs.map((row, index,arr) =>{
            if(index === arr.length - 1 && row.length === 1){
                return [{
                    width: '100%',
                    height
                }]
            }

            return row.map(() => ({
                width: '50%',
                height
            }))
        }).flat()
    }

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexWrap: 'wrap',
            height: '100vh'
        }}>
            { clients.map((clientID: string, index:number) => {
                return (
                    <div key={clientID} style={videoLayout[index]}>
                        <video
                            ref={instance => {
                                provideMediaRef(clientID, instance)
                            }}
                            width='100%'
                            height='100%'
                            autoPlay
                            playsInline
                            muted={clientID === LOCAL_VIDEO}
                        />
                    </div>
                )
            })}
        </div>
    );
};

export default Room;