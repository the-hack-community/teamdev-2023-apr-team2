package repository

import (
	"gorm.io/gorm"
	"server/model"
)

type IParkingRepository interface {
	GetAllParking(parking *[]model.Parking) error
	GetParkingById(parking *model.Parking, parkingId uint) error
	CreateParking(parking *model.Parking) error
}

type parkingRepository struct {
	db *gorm.DB
}

func NewParkingRepository(db *gorm.DB) IParkingRepository {
	return &parkingRepository{db}
}

func (pr *parkingRepository) GetAllParking(parking *[]model.Parking) error {
	if err := pr.db.Order("created_at").Find(parking).Error; err != nil {
		return err
	}
	return nil
}

func (pr *parkingRepository) GetParkingById(parking *model.Parking, parkingId uint) error {
	if err := pr.db.First(parking, parkingId).Error; err != nil {
		return err
	}
	return nil
}

func (pr *parkingRepository) CreateParking(parking *model.Parking) error {
	if err := pr.db.Create(parking).Error; err != nil {
		return err
	}
	return nil
}
