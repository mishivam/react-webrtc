import React, { useContext } from 'react'
import { makeStyles, IconButton,Button, TextField,Typography } from '@material-ui/core';
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import CallIcon from '@material-ui/icons/Call';
import FileCopyIcon from '@material-ui/icons/FileCopy';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

import { SocketContext} from '../SocketContext';
import { useState } from 'react';

const useStyle = makeStyles({
    room:{
        background: '#000000',
        width: '100%',
        height: '100vh',
        transition: "0.4s all"
    },
    form:{
        height: '60%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'space-between',
        position: 'absolute',
        right: '8%',
        top: '50%',
        transform: 'translateY(-50%)',
        transition: "0.4s all"
    },
    userNameForm:{
        width: '15rem',
        height: '12rem',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: '1rem',
        display:'flex',
        flexDirection:'column',
        padding: '1rem',
        alignItems: 'center',
        justifyContent:'space-between',
        transition: '0.5s all ease',
        background: 'rgba(15,15,15,1)',
    
          
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.7)',
        transform:'translateY(50%)',
      
    },
    remoteIdForm: {
        width: '15rem',
        height: '12rem',
        border: '1px solid rgba(0,0,0,0.2)',
        borderRadius: '1rem',
        display:'flex',
        flexDirection:'column',
        padding: '1rem',
        alignItems: 'center',
        justifyContent:'space-between',
        transition: '0.5s all ease',
        background: 'rgba(15,15,15,1)',
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.7)',
    },
    rightIcon: {
        width: '1.5rem',
        height: '1.5rem',
    },
    nameInput:{
        color: 'white',
    },
    callButton:{
        background: '#006400',

        '&:hover':{
            background: '#008000',
        }
    },
    copyYourCode:{
        width: '15rem',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.4)',
        borderRadius: '1rem',
        display:'flex',
        flexDirection:'column',
        padding: '1rem',
        alignItems: 'center',
        justifyContent:'space-between',
        transition: '0.5s all ease',
        background: 'rgba(15,15,15,1)',
    },
    notification: {
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '1rem',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.4)',
        borderRadius: '1rem',
        background: 'rgba(15,15,15,1)',
        transition: '0.5s all ease',
        width: 'fit-content',
        position: 'absolute',
        left: '50%',
        top:'5%',
        transform:'translateX(-50%)',
        zIndex:'10000'
    },
    answerCallButton: {
        color: '#00be00',
        transition: '0.4s all ease',
        '&:hover':{
            color: '#00de00',
        }
    },
    rejectCallButton: {
        color: '#bf0000',
        transition: '0.4s all ease',
        '&:hover':{
            color: '#ff0000',
        }
    },
    answerButton:{
        width: '10rem',
        display: 'flex',
        flexDirection:'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginLeft: '2rem',
    },
    videoWrapper:{
        width: '100%',
        height: '100vh',
        overflow: 'hidden', 
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',       
        transition: 'all 0.5s ease'
    },
   remoteUserVideoWrapper:{
        width: '100%',
        height: '100%',
        transition: 'all 0.5s ease',
   },
    localUserVideoWrapper:{
        width: '100%',
        height: '100%',
        transition: 'all 0.5s ease'
    },
    userName: {
        color: 'white',
        position: 'absolute',
        bottom: '5%',
        left: '5%',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.4)',
        borderRadius: '1rem',
        background: 'rgba(15,15,15,1)',
        padding: '1rem',
        textTransform:'capitalize',
    },
    remoteUserName: {
        color: 'rgb(63, 81, 181)',
        position: 'absolute',
        bottom: '5%',
        right: '5%',
        padding: '1rem',
        textTransform:'capitalize',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.4)',
        borderRadius: '1rem',
        background: 'rgba(15,15,15,1)',
    },
    userVideo:{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'all 0.5s ease'
    },
    callRejectedNoti:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'space-between'
    },
    callActionContainer:{
        display: 'flex',
        flexDirection: 'row',
        justifyContent:'space-around',
        alignItems:'center',
        width: 'fit-content',
        position:'absolute',
        bottom: '5%',
        left: '50%',
        transform: 'translateX(-50%)',
        border: '1px solid rgba(0,0,0,0.2)',
        boxShadow: '0 0 16px 2px rgba(0,0,0,0.4)',
        borderRadius: '1rem',
        background: 'rgba(15,15,15,1)',
    },
    activeIcon: {
        color: 'rgb(63, 81, 181)',
        transition: '0.5s all ease',
        '&:hover':{
            color: 'white',
        }
    },
    disableIcon:{
        color: 'white',
        transition: '0.5s all ease',
        '&:hover':{
            color: 'rgb(63, 81, 181)',
        }
    },
    recordIcon: {
        color: "#ff0000",
        transition: '0.5s all ease',
        '&:hover':{
            color:"#fffffff",
        }
    },
    stopRecordIcon:{
        color: "#fffffff",
        transition: '0.5s all ease',
        '&:hover':{
            color: "#ff0000",
        }
    },
    leaveIcon: {
        color: '#ee0000',
        transform: "scale(1.2)",
        transition: "0.5s all ease",
        '&:hover':{
            color: "#ff0000",
        },
    }
   

    
});

function Room() {
    const {localUserID,
            callAccepted, 
            localUserName,
            setlocalUserName, 
            answerCall, 
            call,  
            rejectCall,
            setCallRejected,
            callRejected,
            callAUser,
            callEnded,
            leaveCall,
            recordingStart,
            stopVideo,
            remoteVideo,
            startRecording,
            stopRecording,
            shareScreenStart,
            shareScreen,
            stopShareScreen,
            micOn,
            localStream,
            localVideo,
            setRemoteUserId,
            remoteUserId,
            turnOffMic,
            showVideo,
            userLeft,
            screenRecorder,
            callUser } = useContext(SocketContext);
        const styles = useStyle();
    const [showId, setShowId] = useState(false);
    const [hideNoti, setHideNoti] = useState(false);

    const copyToClipBoard = async () => {
        return await navigator.clipboard.writeText(localUserID);
    }
    return (
        <div className={styles.room}>
            {
                call?.isReceivedCall && !callAccepted && (
                    <div className={styles.notification}>
                        <Typography variant="h6" color='primary'>{call?.name || 'unknown'} is calling you </Typography>
                        
                        <div className={styles.answerButton}>
                            <IconButton 
                            className={styles.answerCallButton}
                            onClick={answerCall}
                        >
                             <CallIcon fontSize="large"/>
                        </IconButton>
                        <IconButton 
                            className={styles.rejectCallButton}
                            onClick={rejectCall}
                        >
                             <CallEndIcon fontSize="large"/>
                        </IconButton>
                        </div>
                        
                    </div>
                )
            }
            {
                (callAUser | callRejected ) ? (
                    <div className={styles.notification}>
                  { callAUser
                    ?  (<Typography variant="h6" color='primary'>Calling your friend...</Typography>)
                    :
                    (<div className={styles.callRejectedNoti}>
                        <Typography variant="h6" color='primary'>Your call was rejected!</Typography>
                        <Button  
                            color='primary'  
                            className={styles.answerCallButton}
                            onClick={setCallRejected}
                            >ok
                        </Button>
                    </div>)}

                      
                    </div>
                ):null
            }

            {
                (userLeft && !hideNoti ) ? (
                    <div className={styles.notification}>
                  
                    (<div className={styles.callRejectedNoti}>
                        <Typography variant="h6" color='primary'>Your friend has left this meeting..</Typography>
                        <Button  
                            color='primary'  
                            className={styles.answerCallButton}
                            onClick={()=> setHideNoti(true)}
                            >ok
                        </Button>
                    </div>)

                      
                    </div>
                ):null
            }


            {/*Local User Video Screen */}
            <div className={styles.videoWrapper}>
            {
                localStream && 
                (<div className={styles.localUserVideoWrapper}>
                    <Typography variant="h5" className={styles.userName}>{localUserName || "You"}</Typography>
                    <video 
                        playsInline 
                        muted
                        ref={localVideo} 
                        disablePictureInPicture 
                        autoPlay 
                        className={styles.userVideo}>
                    </video>
                </div>)
            }
            {(callAccepted && !callEnded && !userLeft)  ? (
                    <div className={styles.remoteUserVideoWrapper} >
                        <Typography variant="h5" className={styles.remoteUserName}>{call?.name || "Remote User"}</Typography>
                        <video 
                            playsInline 
                            ref={remoteVideo} 
                            disablePictureInPicture     
                            autoPlay 
                            className={styles.userVideo}>
                        </video>
                    </div>
                ):null}
            </div>
            
            <video ref={screenRecorder} hidden ></video>
            
            {/* Form */}
            <div className={styles.form}>
                {!(callAccepted && !callEnded) ? showId && (
                <div className={styles.copyYourCode}>
                    <Button 
                        variant="contained" 
                        color='primary' 
                        startIcon={<FileCopyIcon />} 
                        type='button' 
                        fullWidth
                        onClick={copyToClipBoard}
                        >Copy your Id
                    </Button>
                </div>): null}

                <>
                    {
                        !(callAccepted && !callEnded)? !showId ? 
                (<div className={styles.userNameForm}>
                   
                    <Typography variant="h5"  color='primary'>Your Account</Typography>
                    <TextField 
                        id='name'
                        size='small'
                        label="Enter Your Name" 
                        fullWidth
                        
                        SelectProps={{className:styles.nameInput}}
                        InputLabelProps={{className:styles.nameInput}}
                        inputProps={{className:styles.nameInput}}
                        value={localUserName}
                        onChange={(e)=> setlocalUserName(e.target.value)}
                        
                    />
                    <Button 
                        variant="contained" 
                        color='primary' 
                        endIcon ={<ArrowRightAltIcon className={styles.rightIcon}/>} 
                        type='button' 
                        fullWidth
                        disabled={localUserName ? false :  true}
                        onClick={setShowId}
                        >Continue
                    </Button>
                </div>): 
                (<div className={styles.remoteIdForm}>
                    <Typography variant="h5" color='primary'>Your Friend's Code</Typography>
                    <TextField 
                        id='name'
                        size='small'
                        label="Enter Code" 
                        fullWidth
                        InputLabelProps={{className:styles.nameInput}}
                        value={remoteUserId}
                        inputProps={{className:styles.nameInput}}
                        onChange={(e)=> setRemoteUserId(e.target.value)}
                    />
                    <Button 
                        variant="contained" 
                        color='primary' 
                        startIcon ={<CallIcon className={styles.rightIcon}/>} 
                        type='button' 
                        className={styles.callButton}
                        disabled={remoteUserId  ? false :  true}
                        fullWidth
                        onClick={()=> !callAUser? callUser(remoteUserId):null}
                        >{callAUser? 'Calling...': 'Call'}
                    </Button>
                </div>): null
                    }
                </>

                
               
            </div>
            {/* call functions */}
                <div className={styles.callActionContainer}>
                   
                     <IconButton onClick={stopVideo}>
                    {showVideo ? (<VideocamIcon fontSize="large" className={styles.activeIcon}/>) : (<VideocamOffIcon fontSize="large"  className={styles.disableIcon}/>)}
                    </IconButton>
                    <IconButton onClick={turnOffMic}>
                        {!micOn ? (<MicIcon fontSize="large" className={styles.activeIcon}/>) : (<MicOffIcon fontSize="large"   className={styles.disableIcon}/>)}
                    </IconButton>
                    {
                        (callAccepted && !callEnded) &&(
                            <IconButton onClick={leaveCall}>
                                <CallEndIcon fontSize="large" className={styles.leaveIcon}/>
                            </IconButton>)
                    }
                    
                    <IconButton disabled={!(callAccepted && !callEnded) ? true: false} onClick={shareScreenStart? shareScreen : stopShareScreen}>
                        {!shareScreenStart ? (<ScreenShareIcon fontSize="large" className={styles.activeIcon}/>) : (<StopScreenShareIcon fontSize="large"   className={styles.disableIcon}/>)}
                    </IconButton>
                    <IconButton disabled={!(callAccepted && !callEnded)? true: false} onClick={!recordingStart? startRecording : stopRecording}>
                        {recordingStart ? (<FiberManualRecordIcon fontSize="large" className={styles.recordIcon}/>) : (<FiberManualRecordIcon fontSize="large"  className={styles.stopRecordIcon}/>)}
                    </IconButton>
                  
                </div>
        </div>
    )
}

export default Room
