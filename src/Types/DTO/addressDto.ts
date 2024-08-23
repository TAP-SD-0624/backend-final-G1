export type AddressDTO = {
  state: string
  city: string
  street: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string
}

export type updateAddressDTO = {
  state?: string
  city?: string
  street?: string
  firstName?: string
  lastName?: string
  email?: string
  mobileNumber?: string
}
