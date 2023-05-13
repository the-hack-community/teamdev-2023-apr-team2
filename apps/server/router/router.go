package router

import (
	"github.com/labstack/echo/v4"
	"server/controller"
)

func NewRouter(pc controller.IParkingController, lc controller.ILocationController) *echo.Echo {
	e := echo.New()

	p := e.Group("/parking")
	p.GET("", pc.GetAllParking)
	p.GET("/:parkingId", pc.GetParkingById)
	p.POST("", pc.CreateParking)

	l := e.Group("/location")
	l.GET("", lc.GetAllLocation)
	l.GET("/:locationId", lc.GetLocationById)
	l.POST("", lc.GetLocationsByLatLng)

	return e
}
