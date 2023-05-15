package usecase

import (
	"server/model"
	"server/repository"
	"server/validator"
)

type IHistoryUseCase interface {
	GetAllHistory(userId uint) ([]model.HistoryResponse, error)
	GetHistoryById(userId uint, historyId uint) (model.HistoryResponse, error)
	CreateHistory(history model.History) (model.HistoryResponse, error)
	DeleteHistory(userId uint, historyId uint) error
}

type historyUseCase struct {
	hr repository.IHistoryRepository
	hv validator.IHistoryValidator
}

func NewHistoryUseCase(hr repository.IHistoryRepository, hv validator.IHistoryValidator) IHistoryUseCase {
	return &historyUseCase{hr, hv}
}

func (hu *historyUseCase) GetAllHistory(userId uint) ([]model.HistoryResponse, error) {
	histories := []model.History{}
	if err := hu.hr.GetAllHistory(&histories, userId); err != nil {
		return nil, err
	}
	resHistory := []model.HistoryResponse{}
	for _, v := range histories {
		t := model.HistoryResponse{
			UserRefer:     v.UserRefer,
			FromLatitude:  v.FromLatitude,
			FromLongitude: v.FromLongitude,
			ToLatitude:    v.ToLatitude,
			ToLongitude:   v.ToLongitude,
			ParkingId:     v.ParkingId,
		}
		resHistory = append(resHistory, t)
	}
	return resHistory, nil
}

func (hu *historyUseCase) GetHistoryById(userId uint, historyId uint) (model.HistoryResponse, error) {
	history := model.History{}
	if err := hu.hr.GetHistoryById(&history, userId, historyId); err != nil {
		return model.HistoryResponse{}, err
	}
	resHistory := model.HistoryResponse{
		UserRefer:     history.UserRefer,
		FromLatitude:  history.FromLatitude,
		FromLongitude: history.FromLongitude,
		ToLatitude:    history.ToLatitude,
		ToLongitude:   history.ToLongitude,
		ParkingId:     history.ParkingId,
	}
	return resHistory, nil
}

func (hu *historyUseCase) CreateHistory(history model.History) (model.HistoryResponse, error) {
	if err := hu.hv.HistoryValidate(history); err != nil {
		return model.HistoryResponse{}, err
	}

	if err := hu.hr.CreateHistory(&history); err != nil {
		return model.HistoryResponse{}, err
	}
	resHistory := model.HistoryResponse{
		UserRefer:     history.UserRefer,
		FromLatitude:  history.FromLatitude,
		FromLongitude: history.FromLongitude,
		ToLatitude:    history.ToLatitude,
		ToLongitude:   history.ToLongitude,
		ParkingId:     history.ParkingId,
	}
	return resHistory, nil
}

func (hu *historyUseCase) DeleteHistory(userId uint, historyId uint) error {
	if err := hu.hr.DeleteHistory(userId, historyId); err != nil {
		return err
	}
	return nil
}
