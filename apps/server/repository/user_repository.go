package repository

import (
	"gorm.io/gorm"
	"server/model"
)

type IUserRepository interface {
	GetUserBySocialID(user *model.User, id string, provider string) error
	CreateUser(user *model.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db}
}

func (ur *userRepository) GetUserBySocialID(user *model.User, socialID, provider string) error {
	switch provider {
	case "google":
		if err := ur.db.Where("google_id = ?", socialID).First(user).Error; err != nil {
			return err
		}
	case "facebook":
		if err := ur.db.Where("facebook_id = ?", socialID).First(user).Error; err != nil {
			return err
		}
	default:
		return nil
	}
	return nil
}

func (ur *userRepository) CreateUser(user *model.User) error {
	if err := ur.db.Create(user).Error; err != nil {
		return err
	}
	return nil
}
