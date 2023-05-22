package main

import (
	"context"
	"golang.ngrok.com/ngrok"
	"golang.ngrok.com/ngrok/config"
	"golang.org/x/sync/errgroup"
	"io"
	"log"
	"net"
	"server/controller"
	"server/db"
	"server/repository"
	"server/router"
	"server/usecase"
	"server/validator"
)

func runCilottaServer() error {
	cilottaDB := db.NewDB()

	userValidator := validator.NewUserValidator()
	userRepository := repository.NewUserRepository(cilottaDB)
	userUseCase := usecase.NewUserUseCase(userRepository, userValidator)
	userController := controller.NewUserController(userUseCase)

	historyValidator := validator.NewHistoryValidator()
	historyRepository := repository.NewHistoryRepository(cilottaDB)
	historyUseCase := usecase.NewHistoryUseCase(historyRepository, historyValidator)
	historyController := controller.NewHistoryController(historyUseCase)

	parkingRepository := repository.NewParkingRepository(cilottaDB)
	parkingUseCase := usecase.NewParkingUseCase(parkingRepository)
	parkingController := controller.NewParkingController(parkingUseCase)

	locationRepository := repository.NewLocationRepository(cilottaDB)
	locationUseCase := usecase.NewLocationUseCase(locationRepository)
	locationController := controller.NewLocationController(locationUseCase)

	e := router.NewRouter(userController, historyController, parkingController, locationController)

	err := e.Start("localhost:1323")
	if err != nil {
		return err
	}
	return err
}

func main() {

	go func() {
		err := runCilottaServer()
		if err != nil {
			log.Fatal(err)
		}
	}()

	go func() {
		if err := runNgrokServer(context.Background(), "localhost:1323"); err != nil {
			log.Fatal(err)
		}
	}()

	select {}
}

func runNgrokServer(ctx context.Context, dest string) error {
	tun, err := ngrok.Listen(ctx,
		config.HTTPEndpoint(),
		ngrok.WithAuthtokenFromEnv(),
	)
	if err != nil {
		return err
	}

	log.Println("tunnel created:", tun.URL())

	for {
		conn, err := tun.Accept()
		if err != nil {
			return err
		}

		log.Println("accepted connection from", conn.RemoteAddr())

		go func() {
			err := ngrokHandleConn(ctx, dest, conn)
			log.Println("connection closed:", err)
		}()
	}
}

func ngrokHandleConn(ctx context.Context, dest string, conn net.Conn) error {
	next, err := net.Dial("tcp", dest)
	if err != nil {
		return err
	}

	g, _ := errgroup.WithContext(ctx)

	g.Go(func() error {
		_, err := io.Copy(next, conn)
		return err
	})
	g.Go(func() error {
		_, err := io.Copy(conn, next)
		return err
	})

	return g.Wait()
}
