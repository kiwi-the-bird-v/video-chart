import React, {FC} from 'react';
import {LOCAL_VIDEO} from "../../hooks/useWebRTC";

const VideoPlayer = ({clientID, provideMediaRef}: any) => {
    return (
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
    );
};

export default VideoPlayer;