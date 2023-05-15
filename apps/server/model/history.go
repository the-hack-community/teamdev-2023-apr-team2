package model

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"time"
)

type History struct {
	gorm.Model
	UserRefer     uint            `json:"user_refer" gorm:"not null"`
	FromLatitude  decimal.Decimal `json:"from_latitude" gorm:"not null"`
	FromLongitude decimal.Decimal `json:"from_longitude" gorm:"not null"`
	ToLatitude    decimal.Decimal `json:"to_latitude" gorm:"not null"`
	ToLongitude   decimal.Decimal `json:"to_longitude" gorm:"not null"`
	ParkingId     uint            `json:"parking_id" gorm:"not null"`
	CreatedAt     time.Time       `json:"created_at"`
}

type HistoryResponse struct {
	UserRefer     uint            `json:"user_refer" gorm:"not null"`
	FromLatitude  decimal.Decimal `json:"from_latitude" gorm:"not null"`
	FromLongitude decimal.Decimal `json:"from_longitude" gorm:"not null"`
	ToLatitude    decimal.Decimal `json:"to_latitude" gorm:"not null"`
	ToLongitude   decimal.Decimal `json:"to_longitude" gorm:"not null"`
	ParkingId     uint            `json:"parking_id" gorm:"not null"`
}
