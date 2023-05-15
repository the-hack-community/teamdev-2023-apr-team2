package router

import (
	echojwt "github.com/labstack/echo-jwt/v4"
	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
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

	// TODO: フロント側の対応が完了後に有効化する
	//// CSRFのミドルウェアを追加
	//e.Use(middleware.CSRFWithConfig(middleware.CSRFConfig{
	//	CookiePath:   "/",
	//	CookieDomain: os.Getenv("API_DOMAIN"),
	//	//CookieHTTPOnly: true,
	//	CookieSameSite: http.SameSiteNoneMode,
	//	//CookieSameSite: http.SameSiteDefaultMode, // ローカル環境で検証するために設定
	//	//CookieMaxAge:   60,
	//}))

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
