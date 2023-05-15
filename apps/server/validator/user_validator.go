package validator

import (
	validation "github.com/go-ozzo/ozzo-validation/v4"
	"server/model"
)

type IUserValidator interface {
	UserValidate(user model.User) error
}

type userValidator struct{}

func NewUserValidator() IUserValidator {
	return &userValidator{}
}

func (uv *userValidator) UserValidate(user model.User) error {
	return validation.ValidateStruct(&user,
		validation.Field(
			&user.GoogleID,
			validation.When(user.FacebookID == "" && user.GoogleID != "",
				validation.Required.Error("GoogleID is required"),
				validation.Length(21, 21).Error("invalid google id")),
			validation.When(user.FacebookID != "",
				validation.Length(0, 0).Error("invalid")),
		),
		validation.Field(
			&user.FacebookID,
			validation.When(user.GoogleID == "" && user.FacebookID != "",
				validation.Required.Error("FacebookID is required"),
				validation.Length(16, 16).Error("invalid facebook id")),
			validation.When(user.GoogleID != "",
				validation.Length(0, 0).Error("invalid")),
		),
	)
}
