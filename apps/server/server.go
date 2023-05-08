package main

import (
	"server/controller"
	"server/db"
	"server/repository"
	"server/router"
	"server/usecase"
)

func main() {
	cilottaDB := db.NewDB()
	parkingRepository := repository.NewParkingRepository(cilottaDB)
	parkingUseCase := usecase.NewParkingUseCase(parkingRepository)
	parkingController := controller.NewParkingController(parkingUseCase)
	e := router.NewRouter(parkingController)

	e.Logger.Fatal(e.Start("localhost:1323"))
}
