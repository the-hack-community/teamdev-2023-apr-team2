package router

import (
	"github.com/labstack/echo/v4"
	"server/controller"
)

func NewRouter(pc controller.IParkingController) *echo.Echo {
	e := echo.New()

	p := e.Group("/parking")
	p.GET("", pc.GetAllParking)
	p.GET("/:parkingId", pc.GetParkingById)
	p.POST("", pc.CreateParking)
	return e
}
