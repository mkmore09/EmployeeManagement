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
    @DateOfJoinee DATE,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- ================= DUPLICATE CHECKS =================

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE EmailAddress = @EmailAddress
    )
    BEGIN
        SELECT 
            0 AS success,
            'email' AS field,
            'Email already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE MobileNumber = @MobileNumber
    )
    BEGIN
        SELECT 
            0 AS success,
            'mobile' AS field,
            'Mobile already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE PanNumber = @PanNumber
    )
    BEGIN
        SELECT 
            0 AS success,
            'pan' AS field,
            'PAN already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE PassportNumber = @PassportNumber
    )
    BEGIN
        SELECT 
            0 AS success,
            'passport' AS field,
            'Passport already exists' AS message;

        RETURN;
    END

    -- ================= INSERT =================

    DECLARE @NextId INT =
        ISNULL((SELECT MAX(Row_Id) FROM EmployeeMaster), 0) + 1;

    DECLARE @Code VARCHAR(10) =
        RIGHT('000' + CAST(@NextId AS VARCHAR), 3);

    INSERT INTO EmployeeMaster
    (
        EmployeeCode,
        FirstName,
        LastName,
        CountryId,
        StateId,
        CityId,
        EmailAddress,
        MobileNumber,
        PanNumber,
        PassportNumber,
        ProfileImage,
        Gender,
        DateOfBirth,
        DateOfJoinee,
        CreatedDate,
        IsActive,
        IsDeleted
    )
    VALUES
    (
        @Code,
        @FirstName,
        @LastName,
        @CountryId,
        @StateId,
        @CityId,
        @EmailAddress,
        @MobileNumber,
        UPPER(@PanNumber),
        UPPER(@PassportNumber),
        @ProfileImage,
        @Gender,
        @DateOfBirth,
        @DateOfJoinee,
        GETDATE(),
        @IsActive,
        0
    );

    SELECT 
        1 AS success,
        '' AS field,
        'Employee created successfully' AS message;

END;
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
    @DateOfJoinee DATE,
    @IsActive BIT
)
AS
BEGIN
    SET NOCOUNT ON;

    -- ================= DUPLICATE CHECKS =================

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE EmailAddress = @EmailAddress
        AND Row_Id <> @Row_Id
    )
    BEGIN
        SELECT 
            0 AS success,
            'email' AS field,
            'Email already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE MobileNumber = @MobileNumber
        AND Row_Id <> @Row_Id
    )
    BEGIN
        SELECT 
            0 AS success,
            'mobile' AS field,
            'Mobile already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE PanNumber = @PanNumber
        AND Row_Id <> @Row_Id
    )
    BEGIN
        SELECT 
            0 AS success,
            'pan' AS field,
            'PAN already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE PassportNumber = @PassportNumber
        AND Row_Id <> @Row_Id
    )
    BEGIN
        SELECT 
            0 AS success,
            'passport' AS field,
            'Passport already exists' AS message;

        RETURN;
    END

    -- ================= UPDATE =================

    UPDATE EmployeeMaster
    SET
        FirstName = @FirstName,
        LastName = @LastName,
        CountryId = @CountryId,
        StateId = @StateId,
        CityId = @CityId,
        EmailAddress = @EmailAddress,
        MobileNumber = @MobileNumber,
        PanNumber = UPPER(@PanNumber),
        PassportNumber = UPPER(@PassportNumber),
        ProfileImage = @ProfileImage,
        Gender = @Gender,
        DateOfBirth = @DateOfBirth,
        DateOfJoinee = @DateOfJoinee,
        UpdatedDate = GETDATE(),
        IsActive= @IsActive
    WHERE Row_Id = @Row_Id;

    SELECT 
        1 AS success,
        '' AS field,
        'Employee updated successfully' AS message;

END;
GO


-- =============================================
-- Get Employees Paged
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetEmployeesPaged
(
    @PageNumber INT,
    @PageSize INT,
    @Search NVARCHAR(100) = NULL
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        e.*,
        c.CountryName,
        s.StateName,
        ci.CityName
    FROM EmployeeMaster e
    LEFT JOIN Country c 
        ON e.CountryId = c.Row_Id
    LEFT JOIN State s 
        ON e.StateId = s.Row_Id
    LEFT JOIN City ci 
        ON e.CityId = ci.Row_Id
    AND (
        @Search IS NULL
        OR e.FirstName LIKE '%' + @Search + '%'
        OR e.LastName LIKE '%' + @Search + '%'
        OR e.EmailAddress LIKE '%' + @Search + '%'
    )
    WHERE e.IsDeleted=0
    ORDER BY e.Row_Id DESC
    OFFSET (@PageNumber - 1) * @PageSize ROWS
    FETCH NEXT @PageSize ROWS ONLY;
END;
GO


-- =============================================
-- Get Employee By Id
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetById
(
    @Row_Id INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM EmployeeMaster
    WHERE Row_Id = @Row_Id
    AND IsDeleted = 0;
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
        SET
            IsDeleted = 1,
            DeletedDate = GETDATE()
        WHERE Row_Id = @Row_Id;

        IF @@ROWCOUNT = 0
        BEGIN
            SELECT
                0 AS success,
                'id' AS field,
                'Employee not found' AS message;

            RETURN;
        END

        SELECT
            1 AS success,
            '' AS field,
            'Employee deleted successfully' AS message;

    END TRY

    BEGIN CATCH

        SELECT
            0 AS success,
            'server' AS field,
            ERROR_MESSAGE() AS message;

    END CATCH
END;
GO


-- =============================================
-- Duplicate Check
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
    SET NOCOUNT ON;

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE EmailAddress = @Email
    )
    BEGIN
        SELECT
            0 AS success,
            'email' AS field,
            'Email already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE MobileNumber = @Mobile
    )
    BEGIN
        SELECT
            0 AS success,
            'mobile' AS field,
            'Mobile already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE PanNumber = @Pan
    )
    BEGIN
        SELECT
            0 AS success,
            'pan' AS field,
            'PAN already exists' AS message;

        RETURN;
    END

    IF EXISTS (
        SELECT 1 
        FROM EmployeeMaster 
        WHERE PassportNumber = @Passport
    )
    BEGIN
        SELECT
            0 AS success,
            'passport' AS field,
            'Passport already exists' AS message;

        RETURN;
    END

    SELECT
        1 AS success,
        '' AS field,
        'No duplicate found' AS message;

END;
GO


-- =============================================
-- Get Countries
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetCountries
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Country
    ORDER BY CountryName;
END;
GO


-- =============================================
-- Get States By Country
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetStatesByCountry
(
    @CountryId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM State
    WHERE CountryId = @CountryId
    ORDER BY StateName;
END;
GO


-- =============================================
-- Get Cities By State
-- =============================================
CREATE OR ALTER PROCEDURE stp_Emp_GetCitiesByState
(
    @StateId INT
)
AS
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM City
    WHERE StateId = @StateId
    ORDER BY CityName;
END;
GO