package repository

import (
	"gorm.io/gorm"
	"server/model"
)

type IUserRepository interface {
	GetUserByGoogleId(user *model.User, id string) error
	GetUserByFacebookId(user *model.User, id string) error
	CreateUser(user *model.User) error
}

type userRepository struct {
	db *gorm.DB
}

func NewUserRepository(db *gorm.DB) IUserRepository {
	return &userRepository{db}
}

func (ur *userRepository) GetUserByGoogleId(user *model.User, id string) error {
	if err := ur.db.Where("google_id=?", id).First(user).Error; err != nil {
		return err
	}
	return nil
}
func (ur *userRepository) GetUserByFacebookId(user *model.User, id string) error {
	if err := ur.db.Where("facebook_id=?", id).First(user).Error; err != nil {
		return err
	}
	return nil
}

func (ur *userRepository) CreateUser(user *model.User) error {
	if err := ur.db.Create(user).Error; err != nil {
		return err
	}
	return nil
}
