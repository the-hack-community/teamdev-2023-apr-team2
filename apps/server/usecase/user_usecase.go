package usecase

import (
	"github.com/golang-jwt/jwt/v4"
	"os"
	"server/model"
	"server/repository"
	"server/validator"
	"time"
)

type IUserUseCase interface {
	SignUp(user model.User) (model.UserResponse, error)
	Login(user model.User) (string, error)
}

type userUseCase struct {
	ur repository.IUserRepository
	uv validator.IUserValidator
}

func NewUserUseCase(ur repository.IUserRepository, uv validator.IUserValidator) IUserUseCase {
	return &userUseCase{ur, uv}
}

func (uu *userUseCase) SignUp(user model.User) (model.UserResponse, error) {
	err := uu.uv.UserValidate(user)
	if err != nil {
		return model.UserResponse{}, err
	}
	newUser := model.User{GoogleID: user.GoogleID, FacebookID: user.FacebookID}
	if err := uu.ur.CreateUser(&newUser); err != nil {
		return model.UserResponse{}, err
	}
	resUser := model.UserResponse{
		ID:         newUser.ID,
		GoogleID:   newUser.GoogleID,
		FacebookID: newUser.FacebookID,
	}
	return resUser, nil
}

func (uu *userUseCase) Login(user model.User) (string, error) {
	if err := uu.uv.UserValidate(user); err != nil {
		return "", err
	}
	storedUser := model.User{}

	if user.FacebookID != "" {
		err := uu.ur.GetUserBySocialID(&storedUser, user.FacebookID, "facebook")
		if err != nil {
			return "", err
		}
	} else if user.GoogleID != "" {
		err := uu.ur.GetUserBySocialID(&storedUser, user.GoogleID, "google")
		if err != nil {
			return "", err
		}
	} else {
		return "", nil
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": storedUser.ID,
		"exp":     time.Now().Add(time.Hour * 12).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("API_SECRET")))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}
