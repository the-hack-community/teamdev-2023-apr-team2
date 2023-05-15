package model

import "time"

type User struct {
	ID         uint      `json:"id" gorm:"primaryKey"`
	GoogleID   string    `json:"google_id" gorm:"unique"`
	FacebookID string    `json:"facebook_id" gorm:"unique"`
	History    []History `gorm:"foreignKey:UserRefer"`
	CreatedAt  time.Time `json:"created_at"`
	UpdatedAt  time.Time `json:"updated_at"`
}

type UserResponse struct {
	ID         uint   `json:"id" gorm:"primaryKey"`
	GoogleID   string `json:"google_id" gorm:"unique"`
	FacebookID string `json:"facebook_id" gorm:"unique"`
}
