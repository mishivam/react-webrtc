import React, {createContext, useState, useEffect, useRef} from 'react';
import {io} from 'socket.io-client';
import Peer from 'simple-peer';

import {env} from './env';

const SocketContext = createContext();

const socket = io('https://react-webrtc-video-call-app.herokuapp.com/');


const ContextProvider = ({children})=>{
    const [localStream, setLocalStream] = useState(null);
    const [localUserID, setLocalUserID] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [localUserName, setlocalUserName] = useState('')
    const [showVideo, setShowVideo] = useState(true);
    const [micOn, setMicOn] = useState(false);
    const [shareScreenStart, setShareScreenStart] = useState(true);
    const [shareScreenStream, setShareScreenStream] = useState(null);
    const [recordingStart, setRecordingStart] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [callRejected, setCallRejected] = useState(false);
    const [callAUser, setCallUser] = useState(false);
    const [remoteUserId, setRemoteUserId] = useState('');
    const [userLeft, setUserLeft] = useState(false);
    const localVideo = useRef(); 
    const screenRecorder = useRef();
    const remoteVideo = useRef();
    const connectionRef = useRef();
    const recorderBlob = useRef([]);

    useEffect(()=>{

        const constraints = {
            video: {
                width: 1280,
                height: 720,
                frameRate: {
                    max: 60,
                    ideal: 30,
                    min: 15,
                },
                echoCancellation: true,
                noiseSuppression: true,
            }, 
            audio: true
        }

        navigator.mediaDevices.getUserMedia(constraints)
        .then((stream)=> {
            setLocalStream(stream);
            localVideo.current.srcObject = stream;
        });

        socket.on('me', (id)=>{
            return setLocalUserID(id);
        });

        socket.on('call-user', ({from, name: callerName, signal})=>{
            console.log('incoming-call');
            return setCall({isReceivedCall: true, from, name: callerName, signal});
        });

        socket.on('call-rejected',()=>{
            console.log('call-rejected fired!');
            setCallUser(false);
            setCallRejected(true);
        });

        socket.on('user-left', ()=>{
            console.log('user-left-> remote user left',);
            setUserLeft(true);
            
        });
    }, [])


    const getPeerConfig = (initiator, stream) => {
        return {
            initiator: initiator,
            trickle: false,
            stream: stream,
            reconnectTimer: 5000,
            config: {
               iceServers: [
                    { urls: 'stun:stun.l.google.com:19302' }, 
                    {
                        "urls":"turn:numb.viagenie.ca",
                        "username": "ADD_YOUR_VIAGENIE_USER_NAME", // make one account in viagenie
                        "password": "ADD_YOUR_TURN_SERVER_PASSWORD"
                    }
                  
                ] 
            },
            
        };
    }

    const rejectCall = () => {
        socket.emit('call-rejected', {to: call.from});
        setCall({});
    }

    const stopVideo = ()=> {
        localVideo.current.srcObject.getVideoTracks().forEach(track=> track.enabled = !track.enabled);
        setShowVideo((oldData)=>!oldData);
    }

    const turnOffMic = () => {
        localVideo.current.srcObject.getAudioTracks().forEach(track=> track.enabled = !track.enabled);
        setMicOn((oldData)=> !oldData);
        console.log('mic off :', micOn);
    }
    
    const answerCall=()=>{
        setCallAccepted(true);
        
        const peerConfig = getPeerConfig(false, localStream);
        const peer = new Peer(peerConfig);

        peer.on('signal', (data)=>{
            socket.emit('answer-call', {signal: data, to: call.from});
        });

        peer.on('stream', (remoteStream)=>{
            remoteVideo.current.srcObject = remoteStream;
        });

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const callUser = (id) => {
        setCallUser(true);

        const peerConfig = getPeerConfig(true, localStream);
        const peer = new Peer(peerConfig);

        peer.on('signal', (data)=>{
            socket.emit('call-user', {userToCall: id, signalData: data, from: localUserID, name:localUserName});
        });

        peer.on('stream', (remoteStream)=>{
            remoteVideo.current.srcObject = remoteStream;
        });

        socket.on('call-accepted', (signal)=>{
            setCallAccepted(true);
            setCallUser(false);
            peer.signal(signal);
        });

        connectionRef.current = peer;

    }

    const shareScreen = () => {
        setShareScreenStart((oldData)=> !oldData);
        console.log("localStream",);
      
        navigator.mediaDevices.getDisplayMedia({video: true}).then((shareScreenStream)=>{
            console.log('shareScreenStream:',shareScreenStream )
            connectionRef.current.replaceTrack(localStream.getVideoTracks()[0], shareScreenStream.getVideoTracks()[0], localStream);
            localVideo.current.srcObject=shareScreenStream;
            setShareScreenStream(shareScreenStream);
        })       
    }

    const stopShareScreen = () => {
        setShareScreenStart((oldData)=> !oldData);
        connectionRef.current.replaceTrack(shareScreenStream.getVideoTracks()[0], localStream.getVideoTracks()[0], localStream);
        localVideo.current.srcObject=localStream;
        setShareScreenStream(null);
    }
    
    const startRecording = () => {
        const constraints = {
            audio: {
                echoCancellation: true,
            },
            video: {
                width: 1280, 
                height: 720, 
                cursur: 'always'
            },
        };

        navigator.mediaDevices.getDisplayMedia(constraints).then((stream)=>{
            
            if(screenRecorder?.current){
                console.log('recording started!',stream);
                screenRecorder.current.srcObject = stream;
                handleRecordingStream(stream)
                setRecordingStart(true);
            }
                
        }).catch((e)=> console.log("Recording did not start: ", e));
    }

    const handleRecordingStream = (stream) => {
        console.log("recording 2 is started", stream)
        
          const possibleTypes = [
            'video/webm;codecs=vp9,opus',
            'video/webm;codecs=vp8,opus',
            'video/webm;codecs=h264,opus',
            'video/mp4;codecs=h264,aac',
            ];
            
            //select mimtype for recording
            const [selectedMimeType] = possibleTypes.filter((mimeType)=> {
                return MediaRecorder.isTypeSupported(mimeType);
            });


            //create media recorder
            console.log("Supported Mime Type: ", selectedMimeType);
            const recorder = new MediaRecorder(stream, {selectedMimeType});
            console.log("created mediaRecorder ", recorder);
            setMediaRecorder(recorder);

            //store recorded data
            recorder.ondataavailable = (e) =>{
                console.log("on data available: ", e);
                if(e.data && e.data.size>0){
                    recorderBlob.current.push(e.data);
                }else{
                    console.log('no data available in event ondataavailable', e);
                }
            };

            //start recording
            recorder.start();   
            
            console.log('MediaRecorder started', recorder);
    }

    const stopRecording = () => {
        mediaRecorder.stop();   
        console.log("recording is stoped",);
        setRecordingStart(false);
        //stop recording...
       
        
        //auto download recorded media...
    

        setTimeout(()=>{
            const blob = new Blob(recorderBlob.current,{type: 'video/webm'});
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'record.webm';
            document.body.appendChild(a);

            a.click();
            console.log('dwonload link is removed!');
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            let tracks = screenRecorder.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            screenRecorder.current.srcObject = null;
        }, 1500);

    };

    const leaveCall = () => {
        setCallEnded(true);
        if(call?.isReceivedCall){
            socket.emit('call-ended', {userID: call.from});
        }else{
            socket.emit('call-ended', {userID: remoteUserId});
        }
        // socket.emit('call-ended');
        connectionRef.current.destroy();
        if(recordingStart){
            stopRecording();
        }
        window.location.reload();       
    } 
   

    return (
        <SocketContext.Provider value={{
            localStream,
            localUserID,
            call,
            callAccepted,
            callEnded,
            answerCall,
            leaveCall,
            callUser,
            localUserName,
            setlocalUserName,
            localVideo,
            remoteVideo,
            connectionRef,
            stopVideo,
            showVideo,
            turnOffMic,
            micOn,
            shareScreen,
            shareScreenStart,
            stopShareScreen,
            startRecording,
            stopRecording,
            recordingStart,
            rejectCall,
            setCallRejected,
            callRejected,
            callAUser,
            setCallUser,
            setRemoteUserId,
            remoteUserId,
            userLeft,
            setUserLeft,
            screenRecorder
        }}>

            {children}
        </SocketContext.Provider>
    );
};

export { ContextProvider, SocketContext};