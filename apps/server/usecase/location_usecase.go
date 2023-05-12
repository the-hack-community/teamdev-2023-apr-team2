package usecase

import (
	"server/model"
	"server/repository"
)

type ILocationUseCase interface {
	GetAllLocation() ([]model.LocationResponse, error)
	GetLocationById(locationId uint) (model.LocationResponse, error)
	GetLocationsByLngLat(lngMin float64, lngMax float64, latMin float64, latMax float64) ([]model.LocationResponse, error)
}

type locationUseCase struct {
	pr repository.ILocationRepository
}

func NewLocationUseCase(lr repository.ILocationRepository) ILocationUseCase {
	return &locationUseCase{lr}
}

func (lu *locationUseCase) GetAllLocation() ([]model.LocationResponse, error) {
	var locationLot []model.Location
	if err := lu.pr.GetAllLocation(&locationLot); err != nil {
		return nil, err
	}
	var resLocation []model.LocationResponse

	for _, location := range locationLot {
		lng, _ := location.Longitude.Float64()
		lat, _ := location.Latitude.Float64()
		l := model.LocationResponse{
			ParkingID: location.ParkingID,
			Longitude: lng,
			Latitude:  lat,
		}
		resLocation = append(resLocation, l)
	}
	return resLocation, nil
}

func (lu *locationUseCase) GetLocationById(locationId uint) (model.LocationResponse, error) {
	location := model.Location{}
	if err := lu.pr.GetLocationById(&location, locationId); err != nil {
		return model.LocationResponse{}, err
	}
	lng, _ := location.Longitude.Float64()
	lat, _ := location.Latitude.Float64()
	resLocation := model.LocationResponse{
		ParkingID: location.ParkingID,
		Longitude: lng,
		Latitude:  lat,
	}
	return resLocation, nil
}

func (lu *locationUseCase) GetLocationsByLngLat(lngMin float64, lngMax float64, latMin float64, latMax float64) ([]model.LocationResponse, error) {
	var locationLot []model.Location
	if err := lu.pr.GetLocationsByLngLat(&locationLot, lngMin, lngMax, latMin, latMax); err != nil {
		return nil, err
	}
	var resLocation []model.LocationResponse
	for _, location := range locationLot {
		lng, _ := location.Longitude.Float64()
		lat, _ := location.Latitude.Float64()
		l := model.LocationResponse{
			ParkingID: location.ParkingID,
			Longitude: lng,
			Latitude:  lat,
		}
		resLocation = append(resLocation, l)
	}
	return resLocation, nil
}
