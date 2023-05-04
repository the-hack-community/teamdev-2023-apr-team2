package main

import (
	"fmt"
	"server/db"
	"server/model"
)

func main() {
	dbConn := db.NewDB()
	defer fmt.Println("Successfully Migrated")
	defer db.CloseDB(dbConn)
	err := dbConn.AutoMigrate(&model.User{})
	if err != nil {
		return
	}
}
