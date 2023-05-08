package usecase

import (
	"server/model"
	"server/repository"
)

type IParkingUseCase interface {
	GetAllParking() ([]model.ParkingResponse, error)
	GetParkingById(parkingId uint) (model.ParkingResponse, error)
	CreateParking(parking model.Parking) (model.ParkingResponse, error)
}

type parkingUseCase struct {
	pr repository.IParkingRepository
}

func NewParkingUseCase(pr repository.IParkingRepository) IParkingUseCase {
	return &parkingUseCase{pr}
}

func (pu *parkingUseCase) GetAllParking() ([]model.ParkingResponse, error) {
	var parkingLot []model.Parking
	if err := pu.pr.GetAllParking(&parkingLot); err != nil {
		return nil, err
	}
	var resParking []model.ParkingResponse
	for _, parking := range parkingLot {
		p := model.ParkingResponse{
			ID:        parking.ID,
			UpdatedAt: parking.UpdatedAt,
		}
		resParking = append(resParking, p)
	}
	return resParking, nil
}

func (pu *parkingUseCase) GetParkingById(parkingId uint) (model.ParkingResponse, error) {
	parking := model.Parking{}
	if err := pu.pr.GetParkingById(&parking, parkingId); err != nil {
		return model.ParkingResponse{}, err
	}
	resParking := model.ParkingResponse{
		ID:        parking.ID,
		UpdatedAt: parking.UpdatedAt,
	}
	return resParking, nil
}

func (pu *parkingUseCase) CreateParking(parking model.Parking) (model.ParkingResponse, error) {
	if err := pu.pr.CreateParking(&parking); err != nil {
		return model.ParkingResponse{}, err
	}
	resParking := model.ParkingResponse{
		ID:        parking.ID,
		UpdatedAt: parking.UpdatedAt,
	}
	return resParking, nil
}
