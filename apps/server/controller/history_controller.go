package controller

import (
	"github.com/golang-jwt/jwt/v4"
	"github.com/labstack/echo/v4"
	"net/http"
	"server/model"
	"server/usecase"
	"strconv"
)

type IHistoryController interface {
	GetAllHistory(c echo.Context) error
	GetHistoryById(c echo.Context) error
	CreateHistory(c echo.Context) error
	DeleteHistory(c echo.Context) error
}

type historyController struct {
	hu usecase.IHistoryUseCase
}

func NewHistoryController(hu usecase.IHistoryUseCase) IHistoryController {
	return &historyController{hu}
}

func (hc *historyController) GetAllHistory(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]

	historyRes, err := hc.hu.GetAllHistory(uint(userId.(float64)))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, historyRes)
}

func (hc *historyController) GetHistoryById(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]

	id := c.Param("historyId")
	historyId, _ := strconv.Atoi(id)
	historyRes, err := hc.hu.GetHistoryById(uint(userId.(float64)), uint(historyId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, historyRes)
}

func (hc *historyController) CreateHistory(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]

	history := model.History{}
	if err := c.Bind(&history); err != nil {
		return c.JSON(http.StatusBadRequest, err.Error())
	}
	history.UserRefer = uint(userId.(float64))
	historyRes, err := hc.hu.CreateHistory(history)
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.JSON(http.StatusOK, historyRes)
}

func (hc *historyController) DeleteHistory(c echo.Context) error {
	user := c.Get("user").(*jwt.Token)
	claims := user.Claims.(jwt.MapClaims)
	userId := claims["user_id"]
	id := c.Param("historyId")
	historyId, _ := strconv.Atoi(id)

	err := hc.hu.DeleteHistory(uint(userId.(float64)), uint(historyId))
	if err != nil {
		return c.JSON(http.StatusInternalServerError, err.Error())
	}
	return c.NoContent(http.StatusNoContent)
}
