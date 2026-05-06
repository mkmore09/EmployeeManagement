USE Neosoft_MarutiMore;
GO

-- ======================
-- Country Data
-- ======================
INSERT INTO Country (CountryName)
VALUES ('India');
GO

-- ======================
-- State Data
-- ======================
INSERT INTO State (CountryId, StateName)
VALUES 
(1, 'Maharashtra'),
(1, 'Gujarat');
GO

-- ======================
-- City Data
-- ======================
INSERT INTO City (StateId, CityName)
VALUES 
(1, 'Mumbai'),
(1, 'Pune'),
(2, 'Ahmedabad'),
(2, 'Surat');
GO