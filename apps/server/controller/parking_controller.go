package controller

import (
	"github.com/labstack/echo/v4"
	"net/http"
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
	return c.JSON(http.StatusOK, parkingRes)
}
