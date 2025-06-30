
/**
 * Validates the input fields
 * @param {"Phone Number"|"Email"|"Password"|"DOB"|"First Name"|"Last Name"|"Username"|"_Password"} field - The input field
 * @param {string} value - The value of the field
 */
export function validateInputField(field, value){
    switch (field) {
        case "Password":
            if (value.length < 6) {
                return "Password must be greater than 6"
            }else if (!value.match(/[!@#$%^&*(),.?":{}|<>]/g)) {
                return "Password must contain at least one special character"
            }
            else if (!value.match(/[0-9]/)) {
                return "Password must contain a digit"
            }
            else{
                return ""
            }
        case "Username":
        case "Phone Number":
            if (!Number(value)) {
                return "Please provide a valid phone number"
            }else{
                return ""
            }
        case "DOB":
            return ""
        case "Email":
            return ""
        case "First Name":
            if (value.length < 2) {
                return "Please provide a valid first name"
            }
            return ""
        case "Last Name":
            if (value.length < 2) {
                return "Please provide a valid last name"
            }
            return ""
        case "_Password":
            return ""
        default:
            return "Invalid field"
    }
}
