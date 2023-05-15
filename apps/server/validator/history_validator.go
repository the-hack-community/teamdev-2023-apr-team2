package validator

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"server/model"
)

type IHistoryValidator interface {
	HistoryValidate(history model.History) error
}

type historyValidator struct{}

func NewHistoryValidator() IHistoryValidator {
	return &historyValidator{}
}

func (hv *historyValidator) HistoryValidate(history model.History) error {
	return validation.ValidateStruct(&history)
}
