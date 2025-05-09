import validator from 'validator';


export const isValidEmail = (email) => {
    return validator.isEmail(email);
}

export const isValidPassword = (password) => {
    return validator.isStrongPassword(password, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
        returnScore: false,
    });
}

export const isValidName = (name) => {
    const namePattern = /\b([A-ZÀ-ÿ][-,a-z. ']+[ ]*)+/;
    return namePattern.test(name);
}

export const isValidCompanyName = (companyName) => {
    const companyNamePattern = /^[a-zA-Z0-9s,.]+$/;
    return companyNamePattern.test(companyName);
}

export const isValidPhoneNumber = (phoneNumber) => {
    // Regular expression to match a phone number with a country code
    const phoneNumberPattern = /^[0-9]{10}$/;
    return phoneNumberPattern.test(phoneNumber);
}

export const isValidGSTINumber = (gstin) => {

    // Regular expression to match a valid GSTIN number
    const gstinPattern = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z][A-Z0-9]Z[A-Z0-9]$/;
    return gstinPattern.test(gstin);
}


export const notPastDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    return inputDate >= today;
}

export const notFutureDate = (date) => {
    const today = new Date();
    const inputDate = new Date(date);
    return inputDate <= today;
}

export const isValidPincode = (pincode) => {
    // Regular expression to match only 6 digit numbers
    const pincodePattern = /^\d{6}$/;
    return pincodePattern.test(pincode);
}

