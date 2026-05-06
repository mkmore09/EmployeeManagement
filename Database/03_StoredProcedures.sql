USE Neosoft_MarutiMore;
GO

-- =============================================
-- Insert Employee
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_InsertEmployee
(
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @CountryId INT,
    @StateId INT,
    @CityId INT,
    @EmailAddress VARCHAR(100),
    @MobileNumber VARCHAR(15),
    @PanNumber VARCHAR(12),
    @PassportNumber VARCHAR(20),
    @ProfileImage NVARCHAR(200),
    @Gender TINYINT,
    @DateOfBirth DATE,
    @DateOfJoinee DATE
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE EmailAddress = @EmailAddress)
        SELECT 0 success, 'Email already exists' message;
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE MobileNumber = @MobileNumber)
        SELECT 0 success, 'Mobile already exists'message;
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE PanNumber = @PanNumber)
        SELECT 0 success, 'PAN already exists' message;
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE PassportNumber = @PassportNumber)
        SELECT 0 success, 'Passport already exists' message;
    ELSE
    BEGIN
        DECLARE @NextId INT = ISNULL((SELECT MAX(Row_Id) FROM EmployeeMaster),0) + 1;
        DECLARE @Code VARCHAR(10) = RIGHT('000' + CAST(@NextId AS VARCHAR),3);

        INSERT INTO EmployeeMaster
        (
            EmployeeCode, FirstName, LastName,
            CountryId, StateId, CityId,
            EmailAddress, MobileNumber, PanNumber, PassportNumber,
            ProfileImage, Gender,
            DateOfBirth, DateOfJoinee,
            CreatedDate, IsActive, IsDeleted
        )
        VALUES
        (
            @Code, @FirstName, @LastName,
            @CountryId, @StateId, @CityId,
            @EmailAddress, @MobileNumber, UPPER(@PanNumber), UPPER(@PassportNumber),
            @ProfileImage, @Gender,
            @DateOfBirth, @DateOfJoinee,
            GETDATE(), 1, 0
        );

        SELECT 
    1 AS success, 
    'Employee created successfully' AS message;
    END
END
GO

-- =============================================
-- Update Employee
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_UpdateEmployee
(
    @Row_Id INT,
    @FirstName NVARCHAR(50),
    @LastName NVARCHAR(50),
    @CountryId INT,
    @StateId INT,
    @CityId INT,
    @EmailAddress VARCHAR(100),
    @MobileNumber VARCHAR(15),
    @PanNumber VARCHAR(12),
    @PassportNumber VARCHAR(20),
    @ProfileImage NVARCHAR(200),
    @Gender TINYINT,
    @DateOfBirth DATE,
    @DateOfJoinee DATE
)
AS
BEGIN
    SET NOCOUNT ON;

    IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE EmailAddress=@EmailAddress AND Row_Id<>@Row_Id)
        SELECT 0 success,'Email already exists' message;
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE PanNumber=@PanNumber AND Row_Id<>@Row_Id)
        SELECT 0 success,'PAN already exists' message;
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE PassportNumber=@PassportNumber AND Row_Id<>@Row_Id)
        SELECT 0 success,'Passport already exists' message;
    ELSE
    BEGIN
        UPDATE EmployeeMaster
        SET FirstName=@FirstName,
            LastName=@LastName,
            CountryId=@CountryId,
            StateId=@StateId,
            CityId=@CityId,
            EmailAddress=@EmailAddress,
            MobileNumber=@MobileNumber,
            PanNumber=UPPER(@PanNumber),
            PassportNumber=UPPER(@PassportNumber),
            Gender=@Gender,
            DateOfBirth=@DateOfBirth,
            DateOfJoinee=@DateOfJoinee,
            UpdatedDate=GETDATE()
        WHERE Row_Id=@Row_Id;

        SELECT 
    1 AS success, 
    'Employee created successfully' AS message;
    END
END
GO


-- =============================================
-- Get Employees (NO CHANGE)
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetEmployeesPaged
(
    @PageNumber INT,
    @PageSize INT,
    @Search NVARCHAR(100) = NULL
)
AS
BEGIN
    SELECT 
        e.*,
        c.CountryName,
        s.StateName,
        ci.CityName
    FROM EmployeeMaster e
    LEFT JOIN Country c ON e.CountryId = c.Row_Id
    LEFT JOIN State s ON e.StateId = s.Row_Id
    LEFT JOIN City ci ON e.CityId = ci.Row_Id
    WHERE e.IsDeleted = 0
      AND (@Search IS NULL OR e.FirstName LIKE '%' + @Search + '%')
    ORDER BY e.Row_Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO


-- =============================================
-- Get Employee By Id (NO CHANGE)
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetById
(
    @Row_Id INT
)
AS
BEGIN
    SELECT * FROM EmployeeMaster WHERE Row_Id = @Row_Id;
END;
GO


-- =============================================
-- Delete Employee
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_DeleteEmployee
(
    @Row_Id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    BEGIN TRY

        UPDATE EmployeeMaster
        SET IsDeleted = 1,
            DeletedDate = GETDATE()
        WHERE Row_Id = @Row_Id;

        IF @@ROWCOUNT = 0
        BEGIN
            SELECT 0 AS success, 'Employee not found' AS message;
            RETURN;
        END

        SELECT 1 AS success, 'Employee deleted successfully' AS message;

    END TRY
    BEGIN CATCH
        SELECT 0 AS success, ERROR_MESSAGE() AS message;
    END CATCH
END;
GO


-- =============================================
-- Duplicate Check (KEEP AS IS)
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_CheckDuplicate
(
    @Email VARCHAR(100),
    @Mobile VARCHAR(15),
    @Pan VARCHAR(12),
    @Passport VARCHAR(20)
)
AS
BEGIN
    IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE EmailAddress = @Email)
        SELECT 'EmailExists' AS Result
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE MobileNumber = @Mobile)
        SELECT 'MobileExists' AS Result
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE PanNumber = @Pan)
        SELECT 'PanExists' AS Result
    ELSE IF EXISTS (SELECT 1 FROM EmployeeMaster WHERE PassportNumber = @Passport)
        SELECT 'PassportExists' AS Result
    ELSE
        SELECT 'OK'
END;
GO


-- =============================================
-- Dropdown APIs (NO CHANGE)
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetCountries
AS
BEGIN
    SELECT * FROM Country;
END;
GO

CREATE OR ALTER PROCEDURE stp_Emp_GetStatesByCountry
(
    @CountryId INT
)
AS
BEGIN
    SELECT * FROM State WHERE CountryId = @CountryId;
END;
GO

CREATE OR ALTER PROCEDURE stp_Emp_GetCitiesByState
(
    @StateId INT
)
AS
BEGIN
    SELECT * FROM City WHERE StateId = @StateId;
END;
GO