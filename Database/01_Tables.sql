-- =============================================
-- Run Order:
-- 1. 01_Tables.sql
-- 2. 02_SeedData.sql
-- 3. 03_StoredProcedures.sql
-- =============================================

CREATE DATABASE Neosoft_MarutiMore;
GO

USE Neosoft_MarutiMore;
GO

-- ======================
-- Country Table
-- ======================
CREATE TABLE Country (
    Row_Id INT IDENTITY(1,1) PRIMARY KEY,
    CountryName NVARCHAR(100) NOT NULL
);
GO

-- ======================
-- State Table
-- ======================
CREATE TABLE State (
    Row_Id INT IDENTITY(1,1) PRIMARY KEY,
    CountryId INT NOT NULL,
    StateName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (CountryId) REFERENCES Country(Row_Id)
);
GO

-- ======================
-- City Table
-- ======================
CREATE TABLE City (
    Row_Id INT IDENTITY(1,1) PRIMARY KEY,
    StateId INT NOT NULL,
    CityName NVARCHAR(100) NOT NULL,
    FOREIGN KEY (StateId) REFERENCES State(Row_Id)
);
GO

-- ======================
-- EmployeeMaster Table
-- ======================
CREATE TABLE EmployeeMaster (
    Row_Id INT IDENTITY(1,1) PRIMARY KEY,

    EmployeeCode VARCHAR(8) NOT NULL UNIQUE,

    FirstName NVARCHAR(50) NOT NULL,
    LastName NVARCHAR(50),

    CountryId INT,
    StateId INT,
    CityId INT,

    EmailAddress VARCHAR(100) NOT NULL UNIQUE,
    MobileNumber VARCHAR(15) NOT NULL UNIQUE,
    PanNumber VARCHAR(12) NOT NULL UNIQUE,
    PassportNumber VARCHAR(20) NOT NULL UNIQUE,

    ProfileImage NVARCHAR(200),
    Gender TINYINT,

    IsActive BIT NOT NULL DEFAULT 1,

    DateOfBirth DATE NOT NULL,
    DateOfJoinee DATE,

    CreatedDate DATETIME NOT NULL DEFAULT GETDATE(),
    UpdatedDate DATETIME,

    IsDeleted BIT NOT NULL DEFAULT 0,
    DeletedDate DATETIME,

    FOREIGN KEY (CountryId) REFERENCES Country(Row_Id),
    FOREIGN KEY (StateId) REFERENCES State(Row_Id),
    FOREIGN KEY (CityId) REFERENCES City(Row_Id)
);
GO