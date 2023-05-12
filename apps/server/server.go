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

	locationRepository := repository.NewLocationRepository(cilottaDB)
	locationUseCase := usecase.NewLocationUseCase(locationRepository)
	locationController := controller.NewLocationController(locationUseCase)

	e := router.NewRouter(parkingController, locationController)

	e.Logger.Fatal(e.Start("localhost:1323"))
}
