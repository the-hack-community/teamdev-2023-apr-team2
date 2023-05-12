package repository

import (
	"gorm.io/gorm"
	"server/model"
)

type ILocationRepository interface {
	GetAllLocation(location *[]model.Location) error
	GetLocationById(location *model.Location, locationId uint) error
	GetLocationsByLngLat(location *[]model.Location, lngMin float64, lngMax float64, latMin float64, latMax float64) error
}

type locationRepository struct {
	db *gorm.DB
}

func NewLocationRepository(db *gorm.DB) ILocationRepository {
	return &locationRepository{db}
}

func (pr *locationRepository) GetAllLocation(location *[]model.Location) error {
	if err := pr.db.Order("created_at").Find(location).Error; err != nil {
		return err
	}
	return nil
}

func (pr *locationRepository) GetLocationById(location *model.Location, locationId uint) error {
	if err := pr.db.First(location, locationId).Error; err != nil {
		return err
	}
	return nil
}

func (pr *locationRepository) GetLocationsByLngLat(locations *[]model.Location, lngMin float64, lngMax float64, latMin float64, latMax float64) error {
	if err := pr.db.Where("longitude BETWEEN ? AND ? AND latitude BETWEEN ? AND ?", lngMin, lngMax, latMin, latMax).
		Find(locations).Error; err != nil {
		return err
	}
	return nil
}
