package model

import (
	"gorm.io/gorm"
	"time"
)

type Price struct {
	gorm.Model
	Plan         string    `json:"plan" gorm:"not null"`
	ParkingRefer uint      `json:"parking_refer" gorm:"not null"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type PriceResponse struct {
	Plan         string    `json:"plan"`
	ParkingRefer uint      `json:"parking_refer"`
	UpdatedAt    time.Time `json:"updated_at"`
}
