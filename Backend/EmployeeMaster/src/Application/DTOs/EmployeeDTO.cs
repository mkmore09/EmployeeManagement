using System.ComponentModel.DataAnnotations;

namespace EmployeeMaster.src.Application.DTOs
{
    public class EmployeeDto
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "First Name is required")]
        [StringLength(50, ErrorMessage = "First Name cannot exceed 50 characters")]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string? LastName { get; set; }

        [Required(ErrorMessage = "Country is required")]
        public int CountryId { get; set; }

        [Required(ErrorMessage = "State is required")]
        public int StateId { get; set; }

        [Required(ErrorMessage = "City is required")]
        public int CityId { get; set; }

        [Required(ErrorMessage = "Email is required")]
        [EmailAddress(ErrorMessage = "Invalid Email format")]
        public string Email { get; set; }

        [Required(ErrorMessage = "Mobile is required")]
        [RegularExpression(@"^[6-9]\d{9}$", ErrorMessage = "Invalid Mobile Number")]
        public string Mobile { get; set; }

        [Required(ErrorMessage = "PAN is required")]
        [RegularExpression(@"^[A-Z]{5}[0-9]{4}[A-Z]{1}$", ErrorMessage = "Invalid PAN format")]
        public string Pan { get; set; }

        [Required(ErrorMessage = "Passport is required")]
        [StringLength(20)]
        public string Passport { get; set; }

        public string? ProfileImage { get; set; }

        [Required(ErrorMessage = "Gender is required")]
        public int Gender { get; set; }

        [Required(ErrorMessage = "Date of Birth is required")]
        public DateTime DateOfBirth { get; set; }

        public DateTime? DateOfJoinee { get; set; }
        public bool IsActive { get; set; }
    }
}