CREATE TABLE Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(50) NOT NULL,
    password VARCHAR(50) NOT NULL,
    passwordHash VARCHAR(50) NOT NULL
);

CREATE TABLE UserAllowList (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    AllowedEmail VARCHAR(50),
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE Roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Name VARCHAR(50) NOT NULL
);

CREATE TABLE UserRoles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserId INT,
    Role INT,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE,
    FOREIGN KEY (Role) REFERENCES Roles(id) ON DELETE CASCADE
);

CREATE TABLE UserMeals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    MealDate DATETIME,
    UserId INT,
    FOREIGN KEY (UserId) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE MealPhotos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    MealID INT,
    PhotoURL VARCHAR(50),
    FOREIGN KEY (MealID) REFERENCES UserMeals(id) ON DELETE CASCADE
);

CREATE TABLE Goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserID INT,
    Protein INT,
    Carbohydrates INT,
    Fat INT,
    VitaminA INT,
    VitaminE INT,
    VitaminD INT,
    VitaminC INT,
    Thiamine INT,
    Riboflavin INT,
    Niacin INT,
    VitaminB6 INT,
    VitaminB12 INT,
    Choline INT,
    VitaminK INT,
    Folate INT,
    Calcium INT,
    Iron INT,
    Magnesium INT,
    Phosphorus INT,
    Potassium INT,
    Sodium INT,
    Zinc INT,
    Copper INT,
    Manganese INT,
    Selenium INT,
    FOREIGN KEY (UserID) REFERENCES Users(id) ON DELETE CASCADE
);

CREATE TABLE LogItems (
    id INT AUTO_INCREMENT PRIMARY KEY,
    UserMealID INT,
    Protein INT,
    Carbohydrates INT,
    Fat INT,
    VitaminA INT,
    VitaminE INT,
    VitaminD INT,
    VitaminC INT,
    Thiamine INT,
    Riboflavin INT,
    Niacin INT,
    VitaminB6 INT,
    VitaminB12 INT,
    Choline INT,
    VitaminK INT,
    Folate INT,
    Calcium INT,
    Iron INT,
    Magnesium INT,
    Phosphorus INT,
    Potassium INT,
    Sodium INT,
    Zinc INT,
    Copper INT,
    Manganese INT,
    Selenium INT,
    FOREIGN KEY (UserMealID) REFERENCES UserMeals(id) ON DELETE CASCADE
);

CREATE TABLE meal_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    meal_name VARCHAR(255) NOT NULL,
    date_logged DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    calories FLOAT NOT NULL DEFAULT 0,
    protein FLOAT NOT NULL DEFAULT 0,
    fat FLOAT NOT NULL DEFAULT 0,
    carbohydrates FLOAT NOT NULL DEFAULT 0
);
