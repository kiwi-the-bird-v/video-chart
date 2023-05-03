import React, {useState, useEffect, useRef} from 'react';
import {useNavigate} from "react-router";
import socket from "../../socket";
import ACTIONS from "../../socket/actions";
import { v4 } from "uuid";

const Main = () => {
    const [rooms, setRooms] = useState([])
    const navigate = useNavigate()
    const rootNode = useRef() as any

    const joinRoomHandle = (roomID:number) => {
        navigate(`/room/${roomID}`)
    }

    const createRoomHandle = () => {
        navigate(`/room/${v4()}`)
    }

    useEffect(() => {
        socket.on(ACTIONS.SHARE_ROOMS, ({rooms = []} = {}) => {
            if(rootNode.current){
                setRooms(rooms)
            }
        })
    }, [])

    return (
        <div ref={rootNode}>
            <h1>Available rooms</h1>

            <ul>
                { rooms.map(roomID =>
                    <li key={roomID}>
                        <span>{roomID}</span>
                        <br/>
                        <button onClick={() => joinRoomHandle(roomID)}>JOIN ROOM</button>
                    </li>
                )}
            </ul>

            <button onClick={createRoomHandle}>Create New Room</button>
        </div>
    );
};

export default Main;