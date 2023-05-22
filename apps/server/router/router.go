package router

import (
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
	"net/http"
	"os"
	"server/controller"
)

func NewRouter(uc controller.IUserController, hc controller.IHistoryController, pc controller.IParkingController, lc controller.ILocationController) *echo.Echo {
	e := echo.New()

	// CORSのミドルウェアを追加
	e.Use(middleware.CORSWithConfig(middleware.CORSConfig{
		AllowOrigins: []string{"*"},
		AllowHeaders: []string{
			echo.HeaderOrigin,
			echo.HeaderContentType,
			echo.HeaderAccept,
			echo.HeaderAccessControlAllowHeaders,
			echo.HeaderXCSRFToken},
		AllowMethods:     []string{"GET", "POST", "DELETE"},
		AllowCredentials: true,
	}))

	// CSRFのミドルウェアを追加
	e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
		TokenLookup:    "header:X-Csrf-Token",
		CookiePath:     "/",
		CookieHTTPOnly: true,
		CookieSameSite: http.SameSiteNoneMode,
		//CookieSameSite: http.SameSiteDefaultMode, // ローカル環境で検証するために設定
		CookieMaxAge: 3600 * 24,
	}))

	e.POST("/signup", uc.SignUp)
	e.POST("/login", uc.LogIn)
	e.POST("/logout", uc.LogOut)
	e.GET("/csrf", uc.CsrfToken)

	h := e.Group("/history")
	h.Use(echojwt.WithConfig(echojwt.Config{
		SigningKey:  []byte(os.Getenv("API_SECRET")),
		TokenLookup: "cookie:token",
	}))

	h.GET("", hc.GetAllHistory)
	h.GET("/:historyId", hc.GetHistoryById)
	h.POST("", hc.CreateHistory)
	h.DELETE("/:historyId", hc.DeleteHistory)

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
