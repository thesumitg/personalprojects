import React, {useState , useEffect} from 'react'
import "./Chat.css"
import {Avatar, IconButton} from "@material-ui/core"
import { AttachFile , SearchOutlined , MoreVert, InsertEmoticon } from '@material-ui/icons'
import MicIcon from "@material-ui/icons/Mic"
import {useParams} from "react-router-dom"
import firebaseApp from './firebase'
import firebase from "firebase"
import { useStateValue } from './StateProvider';


function Chat() {
    const [seed , setSeed] =  useState("")
    const [input , setInput] = useState("")
    const {roomId} = useParams()
    const [roomName , setRoomName] = useState("")
    const [messages , setMessages] = useState([]);
    const [{user} ,dispatch ] = useStateValue();

    useEffect(() => {
            if(roomId) {
            firebaseApp.firestore().collection("rooms")
                .doc(roomId)
        .onSnapshot(snapshot => (
            setRoomName(snapshot.data().name)
         ) )

         firebaseApp.firestore().collection("rooms").doc(roomId).collection("messages").orderBy('timestamp' , 'asc').onSnapshot(snapshot => (setMessages(snapshot.docs.map(doc => doc.data()))))
         }
    } , [roomId])
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    } ,[])

    const send = (e) => {
        e.preventDefault();
        console.log("You typed ", input);

        firebaseApp.firestore().collection("rooms").doc(roomId).collection('messages').add({
            message : input ,
            name : user.displayName , 
            timestamp : firebase.firestore.FieldValue.serverTimestamp()
        })
        setInput(" ");
    }

    return (
        <div className="chat" >
            <div className="chat__header" >
                <IconButton>
            <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} /> </IconButton>
            <div className="chat__headerInfo" >
            <h3>{roomName}</h3>

            <p>    Last Seen {" "} {new Date(messages[messages.length-1]?.timestamp?.toDate()).toUTCString()}</p>
            </div>
            <div className="chat__headerRight" >
                <IconButton>
                <SearchOutlined />
                </IconButton>
                <IconButton>
                  <AttachFile/>  
                </IconButton>
                <IconButton>
                    <MoreVert/>
                </IconButton>
            </div>
            </div>
            <div className="chat__body" >
                {messages.map(message => (
                    <p className={`chat__message ${message.name === user.displayName && `chat__reciever`}`} >
                    <span className="chat__name"> {message.name}</span>
                    {message.message}
                    <span className="chat__timestamp" >
                     
                        {new Date(message.timestamp?.toDate()).toUTCString()}
                    </span>
                    </p>
                ))}
                
               
            </div>
            <div>
                <div className="chat__footer" >
                    <InsertEmoticon/>
                    <form  >
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text" />
                    <button onClick={send} type="submit" >Send a message</button>
                    </form>
                    <MicIcon/>
                </div>
            </div>
        </div>
    )
}

export default Chat
