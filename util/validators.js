const validateLoginInput = (username, password) => {
  const errors = {};

  if (username.trim() === "") {
    errors.username = "Username must not be empty";
  }
  if (password.trim() === "") {
    errors.password = "Password must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateCustomerInput = (
  name,
  phone_number,
  brand,
  type,
  year,
  transmission,
  color,
  plate_number
) => {
  const errors = {};

  if (name.trim() === "") {
    errors.name = "nam must not be empty";
  }
  if (phone_number.trim() === "") {
    errors.phone_number = "phone_number must not be empty";
  }
  if (brand.trim() === "") {
    errors.brand = "brand must not be empty";
  }
  if (type.trim() === "") {
    errors.type = "type must not be empty";
  }
  if (year.trim() === "") {
    errors.year = "year must not be empty";
  }
  if (transmission.trim() === "") {
    errors.transmission = "transmission must not be empty";
  }
  if (color.trim() === "") {
    errors.color = "color must not be empty";
  }
  if (plate_number.trim() === "") {
    errors.plate_number = "plate_number must not be empty";
  }

  if (phone_number.trim().indexOf(" ") >= 0) {
    errors.phone_number = "Nomor telepon tidak boleh ada spasi";
  }
  if (year.trim().indexOf(" ") >= 0) {
    errors.year = "Tahun tidak boleh ada spasi";
  }
  if (color.trim().indexOf(" ") >= 0) {
    errors.color = "Warna tidak boleh ada spasi";
  }
  if (plate_number.trim().indexOf(" ") >= 0) {
    errors.plate_number = "Nomor polisi tidak boleh ada spasi";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

const validateServiceInput = (service_name, quantity, price, total) => {
  const errors = {};

  if (service_name.trim() === "") {
    errors.service_name = "Service name must not be empty";
  }
  if (quantity <= 0) {
    errors.quantity = "Quantity must not be empty";
  }
  if (price <= 0) {
    errors.price = "Price must not be empty";
  }
  if (total <= 0) {
    errors.total = "Total must not be empty";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports = {
  validateLoginInput,
  validateCustomerInput,
  validateServiceInput,
};
