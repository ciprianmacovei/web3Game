package main

import (
	"encoding/json"
	"log"
	"net/http"
	"strconv"

	"github.com/gorilla/mux"
	websocket "github.com/gorilla/websocket"
)

type User struct {
	conn          *websocket.Conn
	position      [2]float64
	WalletAddress string
	nftsArray     []Nft
}

type Nft struct {
	url     string
	tokenId uint16
}

type UserPosition struct {
	position [2]int
}

type ConnectionTypeJSON struct {
	ConnectionType string `json:"type"`
	WalletAddress  string `json:"walletAddress"`
}

type ConnectionBattleChamber struct {
	ArrayOfPendingUsers []User
}

type PlayerGrabberJSON struct {
	Position      [2]float64 `json:"position"`
	WalletAddress string     `json:"walletAddress"`
	AttackAction  bool       `json:"attackAction"`
	KeysPressed   any        `json:"keysPressed"`
}

const (
	LookingForGroup string = "lfg"
	Position        string = "position"
)

var (
	wsUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
	wsConn               *websocket.Conn
	connectionBattlePool = []User{}
)

func WsEndpoints(w http.ResponseWriter, r *http.Request) {
	wsUpgrader.CheckOrigin = func(r *http.Request) bool {
		return true
	}

	wsConn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("and error popped out: %s\n", err.Error())
		return
	}

	myConnection := ConnectionTypeJSON{}
	for {
		messageType, message, err := wsConn.ReadMessage()
		if err != nil {
			log.Println("Error during message reading:", err)
			break
		}
		messageBytes := []byte(message)
		errorParseJson := json.Unmarshal(messageBytes, &myConnection)

		if errorParseJson != nil {
			log.Println("Error on parsing json")
		} else {
			log.Printf("Received: %s", myConnection)
			if myConnection.ConnectionType == LookingForGroup {
				newUserConnecting := User{wsConn, [2]float64{0, 0}, myConnection.WalletAddress, nil}
				connectionBattlePool = append(connectionBattlePool, newUserConnecting)
				numberOfConnectionsString := strconv.Itoa(len(connectionBattlePool))
				numberOfConnectionBytes := []byte(numberOfConnectionsString)
				for _, user := range connectionBattlePool {
					err := user.conn.WriteMessage(messageType, numberOfConnectionBytes)
					if err != nil {
						log.Println("Error on white message")
					} else {
						log.Println("number of connections ", len(connectionBattlePool))
					}
				}
			} else if myConnection.ConnectionType == Position {
				player := PlayerGrabberJSON{}
				errorParseJson := json.Unmarshal(messageBytes, &player)
				if errorParseJson != nil {
					log.Println("Error unwrapping position json ", errorParseJson)
				} else {
					for _, user := range connectionBattlePool {
						if user.WalletAddress != player.WalletAddress {
							// log.Println(player)
							// stringPosition := fmt.Sprintf("%f,%f,%v,%s", player.Position[0], player.Position[1], player.AttackAction, player.WalletAddress)
							// err := user.conn.WriteMessage(messageType, []byte(stringPosition))
							err := user.conn.WriteJSON(player)
							if err != nil {
								log.Println("Error on sending back the position", err)
							} else {
								log.Println("Successfully send back the position")
							}
						}
					}
				}
			}

		}

		// err = wsConn.WriteMessage(messageType, []byte("cacat"))
		// if err != nil {
		// 	log.Println("Error during message writing:", err)
		// 	break
		// }
	}

	// defer wsConn.Close()

}

func main() {
	router := mux.NewRouter()
	log.Println("Server listen on port 9100")

	router.HandleFunc("/socket", WsEndpoints)
	router.PathPrefix("/").Handler(http.FileServer(http.Dir("./public/build")))

	log.Fatal(http.ListenAndServe(":9100", router))
}
