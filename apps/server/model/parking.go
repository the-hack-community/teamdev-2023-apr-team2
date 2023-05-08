package model

import "time"

type Parking struct {
	ID           uint    `json:"id" gorm:"primaryKey;autoIncrement"`
	Name         string  `json:"name" gorm:"not null:unique"`
	Address      string  `json:"address" gorm:"not null"`
	UsageTime    string  `json:"usage_time" gorm:"not null"`
	Capacity     uint16  `json:"capacity" gorm:"not null"`
	MultiStorey  bool    `json:"multi_storey" gorm:"not null"`
	WithRoof     bool    `json:"with_roof" gorm:"not null"`
	FreeHour     uint8   `json:"free_hour" gorm:"not null"`
	OnetimePrice uint16  `json:"onetime_price" gorm:"not null"`
	Prices       []Price `gorm:"foreignKey:ParkingRefer"`
	Location     Location
	CreatedAt    time.Time `json:"created_at" gorm:"<-:create"`
	UpdatedAt    time.Time `json:"updated_at" gorm:"<-;not null"`
}

type ParkingResponse struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	UpdatedAt time.Time `json:"updated_at"`
}
