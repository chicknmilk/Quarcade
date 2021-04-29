import React, { Component } from 'react';
import clientSocket from '../../ClientSocket.js';
import Axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";


class EndScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      playersVotedToPlayAgain: 0,
      votedToPlayAgain: false,
      playAgainButton: true,
      returnToLobby: false
    }
  }

  componentDidMount() {
    clientSocket.on("userLeftEndScreen", () => {
      this.setState({
        playAgainButton: false
      });
    });

    clientSocket.on("reqReplayAlphaSoup", (vote) => {
      this.setState({
        playersVotedToPlayAgain: this.state.playersVotedToPlayAgain + vote
      });
    });
  }

  componentWillUnmount() {
    clientSocket.off("userLeftEndScreen");
    clientSocket.off("reqReplayAlphaSoup");
  }

  returnToLobbyScreen = () => {
    // wipe the user from the database
    this.wipeWordsOwned();
    
    // wipe the room from the database
    this.deleteAlphaSoupRoom();

    // return the user to Lobby.js
    this.setState({returnToLobby: true});
  };

  // deletes all the data from the wordsOwned array in users
  async wipeWordsOwned() {
    try {
      // wipe the wordcount array by socketid
      await Axios.patch(`http://localhost:5000/user/clear/${clientSocket.id}`);

    } catch (error) {
      console.log("could not wipe the user wordsOwned data");
    }
  }

  // removes the alphaSoup version of the room from the database
  async deleteAlphaSoupRoom() {
    try {
      await Axios.delete(`http://localhost:5000/alphaSoup/${this.props.roomCode}`);
    } catch (error) {
      console.log("could not delete the room");
    }
  }

  votePlayAgain = () => {

    // user is voting to play again
    if (!this.state.votedToPlayAgain) {

      // time to play again!
      if (this.state.playersVotedToPlayAgain == this.props.playerData.length) {
        console.log("time to play again"); 
      }
      else {
        clientSocket.emit("reqReplayAlphaSoup", (1));
      }
    }
    else {
      clientSocket.emit("reqReplayAlphaSoup", (-1));
    }

    this.setState({
      votedToPlayAgain: !this.state.votedToPlayAgain
    });
  };

  render() {
    return (
      <div>
        {
          this.props.playerData.map(player => (
            <div key={player.id}>
              <h3>#{player.rank}: {player.username} ({player.points} pts):</h3>

              <ul>
              {
                player.wordsOwned.map(word => (
                  <div>
                    <li key={word.id}>{word.word} ({word.points})</li>
                  </div>
                ))
              }
              </ul>
            </div>
          ))
        }

        <button onClick={() => this.returnToLobbyScreen()}>
          Return to Lobby
        </button>

        {
          this.state.playAgainButton ?

          (
            this.state.votedToPlayAgain ?

            <button onClick={() => this.votePlayAgain()}>
              Remove vote to play again
            </button>
            :
            <button onClick={() => this.votePlayAgain()}>
              Vote to play again!
            </button>
          )
          :
          null
        }

        {this.state.returnToLobby ? (<Redirect to="/lobby" />) : null}

      </div>
    );
  }
}

export default EndScreen;