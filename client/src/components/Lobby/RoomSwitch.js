import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from "axios";

class RoomSwitch extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      timesRun: 0
    };
  }


  // ------------------------------------ Socket.io ------------------------------------

  componentDidMount() {
    // console.log("roomswitch component mounted");
    // when the component mounts, request an auto switch
    // IMPORTANT NOTICE ALL CODE READERS (aaron lol) THIS IS WHERE IT SWITCHES TO ALPHASOUP IN THE DATABASE
    // records the room the socket is in
    clientSocket.emit("reqSocketRoomDatabaseSwitch");
    clientSocket.on("recSocketRoomDatabaseSwitch", (room) => {
      this.setState({timesRun: this.state.timesRun + 1});
      // console.log(room);
      this.makeSwitch(room);
    });
  }

  componentWillUnmount() {
    clientSocket.off("recSocketRoom");
  }



  // ------------------------------------ Axios ------------------------------------

  // takes the room from socket and requests the data
  async makeSwitch(room) {
    // console.log("made it to the actual switch");
    try {
      await Axios.get(`http://localhost:5000/homeLobby/${room}`).then(
        res => {
          const roomInfo = res.data[0];
          // logs the info of the room
          // here we do axios.post roomInfo to the room 
          this.addRoom(roomInfo);
        }
      )
    } catch (error) {
      console.log("Could not get that room");
    }
  }

  // adds a clone of the room from homelobbies to alphasoup
  async addRoom(roomInfo) {
    // change the amount of letters left
    const userNum = roomInfo.users.length;
    const lettersLeft = userNum * 15;
    // change the amount of letters that begin on board IF players are greater than 4
    var startLetters = 4;
    if (userNum > 4) {
      startLetters = userNum;
    }
    if (this.state.timesRun <= 1) {
      try {
        // posts the data to the alphasoup database
        await Axios.post(`http://localhost:5000/alphaSoup`, { roomCode: roomInfo.roomCode, users: roomInfo.users, startLetters: startLetters, lettersLeft: lettersLeft});
        
      } catch (error) {
        console.log(error.message);
      }
    } else {
      // do nothing
    }

    clientSocket.emit("reqLettersLeft");
    
  }


  
  // ------------------------------------ Form & Button Handling ------------------------------------


  // ------------------------------------ Render ------------------------------------

  render() {
    return (
      <div> 
      </div>
    );
  }
}

export default RoomSwitch;