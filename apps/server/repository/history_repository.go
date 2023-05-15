package repository

import (
	"fmt"
	"gorm.io/gorm"
	"server/model"
)

type IHistoryRepository interface {
	GetAllHistory(history *[]model.History, userId uint) error
	GetHistoryById(history *model.History, userId uint, historyId uint) error
	CreateHistory(history *model.History) error
	DeleteHistory(userId uint, historyId uint) error
}

type historyRepository struct {
	db *gorm.DB
}

func NewHistoryRepository(db *gorm.DB) IHistoryRepository {
	return &historyRepository{db}
}

func (hr *historyRepository) GetAllHistory(history *[]model.History, userId uint) error {
	if err := hr.db.Joins("User").Where("user_id=?", userId).Order("created_at").Find(history).Error; err != nil {
		return err
	}
	return nil
}

func (hr *historyRepository) GetHistoryById(history *model.History, userId uint, historyId uint) error {
	if err := hr.db.Joins("JOIN users ON users.id = histories.user_refer").Where("histories.user_refer = ?", userId).First(history, historyId).Error; err != nil {
		return err
	}
	return nil
}

func (hr *historyRepository) CreateHistory(history *model.History) error {
	if err := hr.db.Create(history).Error; err != nil {
		return err
	}
	return nil
}

func (hr *historyRepository) DeleteHistory(userId uint, historyId uint) error {
	result := hr.db.Where("id=? AND user_id=?", historyId, userId).Delete(model.History{})
	if result != nil {
		return result.Error
	}
	// 削除対象が1以下ならエラー
	if result.RowsAffected < 1 {
		return fmt.Errorf("no rows affected")
	}
	return nil
}
