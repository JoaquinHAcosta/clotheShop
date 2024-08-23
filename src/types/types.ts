export interface UserDocument {
  email: string
  password: string
  name: string
  phone: string
  address: AddressDocument
  image: string
  createdAt: Date
  updatedAt: Date
}

export interface AddressDocument {
  city: string
  country: string
  line1: string
  line2: string
  postal_code: string
  state: string
}
