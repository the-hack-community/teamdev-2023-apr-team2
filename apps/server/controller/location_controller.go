package controller

import (
	"github.com/labstack/echo/v4"
	"net/http"
	"server/usecase"
	"strconv"
)

type ILocationController interface {
	GetAllLocation(c echo.Context) error
	GetLocationById(c echo.Context) error
	GetLocationsByLatLng(c echo.Context) error
}

type locationController struct {
	lu usecase.ILocationUseCase
}
type requestBody struct {
	Lat struct {
		Min float64 `json:"min"`
		Max float64 `json:"max"`
	} `json:"latitude"`
	Lng struct {
		Min float64 `json:"min"`
		Max float64 `json:"max"`
	} `json:"longitude"`
}

func NewLocationController(lu usecase.ILocationUseCase) ILocationController {
	return &locationController{lu}
}

func (lc *locationController) GetAllLocation(c echo.Context) error {
	locationRes, err := lc.lu.GetAllLocation()
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, locationRes)
}

func (lc *locationController) GetLocationById(c echo.Context) error {
	id := c.Param("locationId")
	locationId, _ := strconv.Atoi(id)
	locationRes, err := lc.lu.GetLocationById(uint(locationId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, locationRes)
}

func (lc *locationController) GetLocationsByLatLng(c echo.Context) error {
	var req requestBody
	if err := c.Bind(&req); err != nil {
		return c.String(http.StatusBadRequest, "Invalid parameters")
	}
	locationRes, err := lc.lu.GetLocationsByLatLng(req.Lat.Min, req.Lat.Max, req.Lng.Min, req.Lng.Max)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, locationRes)
}
