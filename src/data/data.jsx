export const mockMessages = [
  {
    id: 1, order: {
      "customerDetails": {
        "fullName": "John Doe",
        "phoneNumber": "08012345678",
        "date": "01/15/1990"
      },
      "deliveryDetails": {
        "fullName": "John Doe",
        "email": "johndoe@example.com",
        "address": "45 Park Lane, Lagos",
        "direction": "Next to the central park",
        "nearestMarket": "Main Market",
        "nearestDistributors": "Distributor X, Distributor Y"
      },
      "orderDetails": {
        "orderNumber": "ORD001",
        "email": "johndoe@example.com",
        "totalAmountPaid": "₦50,000",
        "phoneNumber": "08012345678",
        "additionalPhoneNumber": "07098765432",
        "stateCity": "Lagos"
      }
    }, sender: 'user', type: 'text', text: 'Hello there!', timestamp: new Date('2024-10-13T09:00:00')
  },
  { id: 2, sender: 'other', type: 'text', text: 'Hi! How are you?', timestamp: new Date('2024-10-13T09:05:00') },
  { id: 3, sender: 'user', type: 'text', text: 'I’m doing great, thanks!', timestamp: new Date('2024-10-13T09:07:00') },
  { id: 4, sender: 'other', type: 'text', text: 'That’s good to hear.', timestamp: new Date('2024-10-13T09:10:00') },
  { id: 5, sender: 'user', type: 'image', imageUrl: 'https://via.placeholder.com/150', timestamp: new Date('2024-10-13T09:15:00') },
  { id: 6, sender: 'other', type: 'image', imageUrl: 'https://via.placeholder.com/150', timestamp: new Date('2024-10-13T09:20:00') },
  { id: 7, sender: 'user', type: 'text', text: 'Here’s an image for you!', timestamp: new Date('2024-10-13T09:25:00') },
  { id: 8, sender: 'other', type: 'text', text: 'Nice picture!', timestamp: new Date('2024-10-13T09:30:00') }
];


export const mockData = () => [
  {
    "customerDetails": {
      "fullName": "John Doe",
      "phoneNumber": "08012345678",
      "date": "01/15/1990"
    },
    "deliveryDetails": {
      "fullName": "John Doe",
      "email": "johndoe@example.com",
      "address": "45 Park Lane, Lagos",
      "direction": "Next to the central park",
      "nearestMarket": "Main Market",
      "nearestDistributors": "Distributor X, Distributor Y"
    },
    "orderDetails": {
      "orderNumber": "ORD001",
      "email": "johndoe@example.com",
      "totalAmountPaid": "₦50,000",
      "phoneNumber": "08012345678",
      "additionalPhoneNumber": "07098765432",
      "stateCity": "Lagos"
    }
  },
  {
    "customerDetails": {
      "fullName": "Jane Smith",
      "phoneNumber": "09023456789",
      "date": "03/10/1985"
    },
    "deliveryDetails": {
      "fullName": "Jane Smith",
      "email": "janesmith@example.com",
      "address": "22 Sunset Blvd, Abuja",
      "direction": "Opposite the shopping mall",
      "nearestMarket": "Wuse Market",
      "nearestDistributors": "Distributor Z"
    },
    "orderDetails": {
      "orderNumber": "ORD002",
      "email": "janesmith@example.com",
      "totalAmountPaid": "₦75,000",
      "phoneNumber": "09023456789",
      "additionalPhoneNumber": "08123456789",
      "stateCity": "Abuja"
    }
  },
  {
    "customerDetails": {
      "fullName": "Michael Johnson",
      "phoneNumber": "08134567890",
      "date": "05/22/1995"
    },
    "deliveryDetails": {
      "fullName": "Michael Johnson",
      "email": "michaelj@example.com",
      "address": "9 Pine Avenue, Port Harcourt",
      "direction": "Near the football stadium",
      "nearestMarket": "Oil Mill Market",
      "nearestDistributors": "Distributor B, Distributor C"
    },
    "orderDetails": {
      "orderNumber": "ORD003",
      "email": "michaelj@example.com",
      "totalAmountPaid": "₦32,000",
      "phoneNumber": "08134567890",
      "additionalPhoneNumber": "09087654321",
      "stateCity": "Port Harcourt"
    }
  },
  {
    "customerDetails": {
      "fullName": "Lisa Adams",
      "phoneNumber": "07098765432",
      "date": "12/05/1992"
    },
    "deliveryDetails": {
      "fullName": "Lisa Adams",
      "email": "lisaadams@example.com",
      "address": "15 Elm Street, Ibadan",
      "direction": "Near the central bus station",
      "nearestMarket": "Bodija Market",
      "nearestDistributors": "Distributor D"
    },
    "orderDetails": {
      "orderNumber": "ORD004",
      "email": "lisaadams@example.com",
      "totalAmountPaid": "₦25,000",
      "phoneNumber": "07098765432",
      "additionalPhoneNumber": "08011223344",
      "stateCity": "Ibadan"
    }
  }
]
