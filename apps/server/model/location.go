package model

import (
	"github.com/shopspring/decimal"
	"gorm.io/gorm"
	"time"
)

type Location struct {
	gorm.Model
	ParkingID uint
	Longitude decimal.Decimal `json:"longitude" gorm:"type:decimal(10,7);not null"`
	Latitude  decimal.Decimal `json:"latitude" gorm:"type:decimal(10,7);not null"`
	CreatedAt time.Time       `json:"created_at" gorm:"<-:create"`
	UpdatedAt time.Time       `json:"updated_at" gorm:"<-;not null"`
}

type LocationResponse struct {
	ParkingID uint
	Longitude float64
	Latitude  float64
}
