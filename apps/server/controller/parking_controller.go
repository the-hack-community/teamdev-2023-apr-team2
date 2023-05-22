package controller

import (
	"context"
	"encoding/base64"
	firebase "firebase.google.com/go"
	"firebase.google.com/go/messaging"
	"fmt"
	"github.com/labstack/echo/v4"
	"google.golang.org/api/option"
	"log"
	"net/http"
	"os"
	"server/model"
	"server/usecase"
	"strconv"
)

type IParkingController interface {
	GetAllParking(c echo.Context) error
	GetParkingById(c echo.Context) error
	CreateParking(c echo.Context) error
}

type parkingController struct {
	pu usecase.IParkingUseCase
}

func NewParkingController(pu usecase.IParkingUseCase) IParkingController {
	return &parkingController{pu}
}

func (pc *parkingController) GetAllParking(c echo.Context) error {
	parkingRes, err := pc.pu.GetAllParking()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, parkingRes)
}

func (pc *parkingController) GetParkingById(c echo.Context) error {
	id := c.Param("parkingId")
	parkingId, _ := strconv.Atoi(id)
	parkingRes, err := pc.pu.GetParkingById(uint(parkingId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, parkingRes)
}

func (pc *parkingController) CreateParking(c echo.Context) error {
	parking := model.Parking{}
	if err := c.Bind(&parking); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	parkingRes, err := pc.pu.CreateParking(parking)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}

	// Send push notification
	ctx := context.Background()
	conf := &firebase.Config{
		ProjectID: "cilotta-386405",
	}
	base64Credential := os.Getenv("FIREBASE_KEYFILE_JSON")
	jsonCredential, err := base64.StdEncoding.DecodeString(base64Credential)
	if err != nil {
		fmt.Println(err.Error())
		return err
	}
	opt := option.WithCredentialsJSON(jsonCredential)
	app, err := firebase.NewApp(ctx, conf, opt)
	if err != nil {
		log.Fatalf("Failed to initialize Firebase app: %v\n", err)
	}
	sendToToken(app)

	return c.JSON(http.StatusOK, parkingRes)
}

func sendToToken(app *firebase.App) {
	ctx := context.Background()
	client, err := app.Messaging(ctx)
	if err != nil {
		log.Fatalf("error getting Messaging client: %v\n", err)
	}
	message := &messaging.Message{
		Notification: &messaging.Notification{
			Title: "新しい駐輪場が登録されました",
			Body:  "新しい駐輪場が登録されました",
		},
		Topic: "cilotta",
	}
	response, err := client.Send(ctx, message)
	if err != nil {
		log.Fatalln(err)
	}
	fmt.Println("Successfully sent message:", response)
}
