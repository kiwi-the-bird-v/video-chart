import React, {useState, useEffect, useRef, FC} from 'react';
import {useNavigate} from "react-router";
import socket from "../../socket";
import ACTIONS from "../../socket/actions";
import { v4 } from "uuid";
import MyButton from "../../components/button/MyButton";
import classes from "./Lobby.module.css";

const Lobby : FC = () => {
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
        <div ref={rootNode} className={classes.lobby}>
            <div className={classes.lobby_content}>
                <h1 className={classes.lobby_header}>Available rooms</h1>
                <ul>
                    { rooms.map(roomID =>
                        <li key={roomID} className={classes.lobby_room}>
                            <span>{roomID}</span>
                            <br/>
                            <MyButton onClick={() => joinRoomHandle(roomID)}>JOIN ROOM</MyButton>
                        </li>
                    )}
                </ul>
                <MyButton onClick={createRoomHandle}>Create New Room</MyButton>
            </div>
        </div>
    );
};

export default Lobby;