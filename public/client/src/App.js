
import { useEffect, useCallback, useState } from 'react';
import { ChakraProvider, Button, Spinner } from '@chakra-ui/react'

import Nav from './ui-components/navbar/navbar';
import CanvasGame from './canvas-game/canvasGame';

import { userStore } from './store/store';

import './App.css';
import { GAME_TYPES } from './constants/constants';


function App() {

  const [socket, setSocket] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [loading, setLoading] = useState(false);
  const user = userStore();

  const setWebsocketConnection = useCallback(() => {
    const ws = new WebSocket("wss://c441-82-78-120-187.eu.ngrok.io/socket");
    ws.addEventListener("message", receiveMessage);
    setSocket(ws);
  })

  useEffect(() => {
    setWebsocketConnection();
    return () => {
      if (socket) {
        socket.removeEventListener('message', receiveMessage);
      }
    }
  }, [])

  const receiveMessage = (data) => {
    if (Number(data.data) % 2 === 0 && !data.data.includes(",")) {
      setLoading(false);
      setStartGame(true);
    } else if (Number(data.data) % 2 === 1 && !data.data.includes(",")) {
      setLoading(true);
    }
  }

  const startGameFunc = () => {
    socket.send(JSON.stringify({
      walletAddress: user.walletAddress,
      type: GAME_TYPES.lfg
    }))
  }

  return (
    <ChakraProvider>
      <div className="App">
        <header>
          <Nav />
        </header>
        <section className="container">
          {
            user.walletAddress &&
            <Button
              onClick={startGameFunc}
              colorScheme='teal'
              size='md'>
              Connect to Battle
            </Button>
          }
          {loading &&
            <Spinner
              thickness='4px'
              speed='0.65s'
              emptyColor='gray.200'
              color='blue.500'
              size='xl'
            />
          }
        </section>
        {
          startGame &&
          <main className="main-game-container">
            <CanvasGame ws={socket} />
          </main>
        }
      </div>
    </ChakraProvider>
  );

}

export default App;
