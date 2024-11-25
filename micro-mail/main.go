package main

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"os"

	"golang.org/x/oauth2"
	"golang.org/x/oauth2/google"
	"google.golang.org/api/gmail/v1"
)

type EmailRequest struct {
	To      string   `json:"to"`
	CC      []string `json:"cc,omitempty"`
	Subject string   `json:"subject"`
	Body    string   `json:"body"`
}

func getClient(config *oauth2.Config) *http.Client {
	tokenFile := "token.json"
	tok, err := tokenFromFile(tokenFile)
	if err != nil {
		tok = getTokenFromWeb(config)
		saveToken(tokenFile, tok)
	}
	return config.Client(context.Background(), tok)
}

func tokenFromFile(file string) (*oauth2.Token, error) {
	f, err := os.Open(file)
	if err != nil {
		return nil, err
	}
	defer f.Close()
	tok := &oauth2.Token{}
	err = json.NewDecoder(f).Decode(tok)
	return tok, err
}

func getTokenFromWeb(config *oauth2.Config) *oauth2.Token {
	authURL := config.AuthCodeURL("state-token", oauth2.AccessTypeOffline)
	fmt.Printf("Visitez ce lien pour autoriser l'application :\n%v\n", authURL)

	var authCode string
	fmt.Print("Entrez le code d'autorisation ici : ")
	if _, err := fmt.Scan(&authCode); err != nil {
		log.Fatalf("Erreur lors de la lecture du code d'autorisation : %v", err)
	}

	tok, err := config.Exchange(context.Background(), authCode)
	if err != nil {
		log.Fatalf("Impossible de récupérer le token depuis le web : %v", err)
	}
	return tok
}

func saveToken(path string, token *oauth2.Token) {
	fmt.Printf("Sauvegarde du token dans : %s\n", path)
	f, err := os.Create(path)
	if err != nil {
		log.Fatalf("Impossible de sauvegarder le token dans un fichier : %v", err)
	}
	defer f.Close()
	json.NewEncoder(f).Encode(token)
}

func sendEmail(service *gmail.Service, from, to string, cc []string, subject, body string) error {
	var message gmail.Message

	ccHeader := ""
	if len(cc) > 0 {
		ccHeader = fmt.Sprintf("Cc: %s\r\n", formatEmailList(cc))
	}
	email := fmt.Sprintf("From: %s\r\nTo: %s\r\n%sSubject: %s\r\n\r\n%s",
		from, to, ccHeader, subject, body)
	message.Raw = base64.URLEncoding.EncodeToString([]byte(email))

	_, err := service.Users.Messages.Send("me", &message).Do()
	if err != nil {
		return fmt.Errorf("Erreur lors de l'envoi de l'email : %v", err)
	}

	fmt.Println("Email envoyé avec succès !")
	return nil
}

func formatEmailList(emails []string) string {
	return fmt.Sprintf("%s", joinStrings(emails, ", "))
}

func joinStrings(items []string, separator string) string {
	result := ""
	for i, item := range items {
		if i > 0 {
			result += separator
		}
		result += item
	}
	return result
}

func handleSendEmail(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	var req EmailRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Erreur de lecture du corps de la requête", http.StatusBadRequest)
		return
	}

	b, err := ioutil.ReadFile("credentials.json")
	if err != nil {
		http.Error(w, "Impossible de lire le fichier credentials.json", http.StatusInternalServerError)
		return
	}

	config, err := google.ConfigFromJSON(b, gmail.GmailSendScope)
	if err != nil {
		http.Error(w, "Erreur lors de la création de la configuration OAuth", http.StatusInternalServerError)
		return
	}

	client := getClient(config)

	service, err := gmail.New(client)
	if err != nil {
		http.Error(w, "Erreur lors de la création du service Gmail", http.StatusInternalServerError)
		return
	}

	err = sendEmail(service, "tristan.goncalves25@gmail.com", req.To, req.CC, req.Subject, req.Body)
	if err != nil {
		http.Error(w, fmt.Sprintf("Erreur lors de l'envoi de l'email : %v", err), http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte("Email envoyé avec succès"))
}

func main() {
	http.HandleFunc("/send-email", handleSendEmail)

	fmt.Println("Serveur en cours d'exécution sur le port 8080...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
