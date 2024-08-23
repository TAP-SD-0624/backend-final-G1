export type AddressDTO = {
  state: string
  city: string
  street: string
  firstName: string
  lastName: string
  email: string
  mobileNumber: string,
  userId?:number,
  updatedAt?: Date
  createdAt?: Date
  deletedAt?: Date
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
