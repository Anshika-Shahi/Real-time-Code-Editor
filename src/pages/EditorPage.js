import React, { useState,useEffect,useRef } from 'react';
import Client from '../components/Client'; 
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import Editor from '../components/Editor';
import { initSocket } from '../socket';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
const {roomId} = useParams();

    const reactNavigator = useNavigate();
    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => handleErrors(err));
            socketRef.current.on('connect_failed', (err) => handleErrors(err));

            function handleError(e) {
                console.log('socket error', e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }


            socketRef.current.emit(ACTIONS.JOIN, {
            roomId,
            username: location.state?.username,
            });
        };
        init();
    }, []);

    const [clients, setClients] = useState([
        { socketId: 1, username: 'Rakesh K' },
        { socketId: 2, username: 'James Doe' },
        { socketId: 3, username: 'Janfh Coe' },
    ]);
    if(!location.state) {
        return <Navigate to="/"/>;
    }

    return (
        <div className="mainWrap">
            <div className="aside">
                <div className="asideInner">
                    <div className="logo">
                        <img
                            className="logoImage"
                            src="/code-sync.png"
                            alt="logo"
                        />
                    </div>
                    <h3>Connected</h3>
                    <div className="clientsList">
                        {clients.map((client) => (
                            <Client
                                key={client.socketId}
                                username={client.username}
                            />
                        ))}
                    </div>
                </div>
                <button className="btn copyBtn">Copy ROOM ID</button>
                <button className="btn leaveBtn">Leave</button>

            </div>
            <div className="editorWrap">
                <Editor />
            </div>
        </div>
    );
};

export default EditorPage;
