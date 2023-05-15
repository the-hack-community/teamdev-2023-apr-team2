package main

import (
	"server/controller"
	"server/db"
	"server/repository"
	"server/router"
	"server/usecase"
	"server/validator"
)

func main() {
	cilottaDB := db.NewDB()

	userValidator := validator.NewUserValidator()
	userRepository := repository.NewUserRepository(cilottaDB)
	userUseCase := usecase.NewUserUseCase(userRepository, userValidator)
	userController := controller.NewUserController(userUseCase)

	parkingRepository := repository.NewParkingRepository(cilottaDB)
	parkingUseCase := usecase.NewParkingUseCase(parkingRepository)
	parkingController := controller.NewParkingController(parkingUseCase)

	locationRepository := repository.NewLocationRepository(cilottaDB)
	locationUseCase := usecase.NewLocationUseCase(locationRepository)
	locationController := controller.NewLocationController(locationUseCase)

	e := router.NewRouter(userController, parkingController, locationController)

	e.Logger.Fatal(e.Start("localhost:1323"))
}
