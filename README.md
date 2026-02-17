# Wander - Travel Listing Platform

A comprehensive web application for discovering and booking unique travel accommodations around the world. Built with Node.js, Express, MongoDB, and featuring geolocation-based search capabilities.

## 🌟 Features

- **Property Listings**: Browse, create, edit, and delete travel accommodations
- **Category-based Filtering**: Filter properties by categories (beach, mountains, iconic cities, camping, etc.)
- **Geolocation Integration**: Map-based location search using Mapbox
- **Review System**: User reviews and ratings for properties
- **User Authentication**: Secure login/signup with Passport.js
- **Image Upload**: Cloudinary integration for property images
- **Responsive Design**: Modern UI with EJS templating
- **Flash Messaging**: User-friendly notifications and feedback

## 🛠 Tech Stack

### Backend
- **Node.js** (v24.11.1) - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Passport.js** - Authentication middleware
- **Cloudinary** - Image storage and processing
- **Mapbox SDK** - Geolocation services

### Frontend
- **EJS** - Template engine with EJS-Mate
- **Bootstrap/CSS** - Styling (check public folder)
- **JavaScript** - Client-side interactions

## 🚀 Quick Start

### Prerequisites
- Node.js (v24.11.1)
- MongoDB (local installation or MongoDB Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wander
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   Configure your `.env` file with:
   ```
   NODE_ENV=development
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_KEY=your_cloudinary_key
   CLOUDINARY_SECRET=your_cloudinary_secret
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

4. **Start MongoDB**
   ```bash
   # For local MongoDB
   mongod
   ```

5. **Run the application**
   ```bash
   npm start
   ```

6. **Access the application**
   - Open your browser and navigate to `http://localhost:8080`
   - Default login credentials:
     - Username: `editor`
     - Password: `editor123`

## 📁 Project Structure

```
wander/
├── controllers/          # Route controllers
├── models/              # Mongoose models (User, Listing, Review)
├── routes/              # Express routes
├── views/               # EJS templates
│   ├── listings/        # Listing-related views
│   ├── users/           # User authentication views
│   └── reviews/         # Review-related views
├── public/              # Static assets (CSS, JS, images)
├── utils/               # Utility functions
├── middleware.js        # Custom middleware
├── app.js              # Main application file
└── package.json        # Dependencies and scripts
```

## 🏗 Database Schema

### Listing Model
- **Basic Info**: Title, description, price, location, country
- **Categories**: Beach, mountains, iconic cities, camping, etc.
- **Geolocation**: Coordinates for map integration
- **Images**: Cloudinary-hosted property images
- **Reviews**: Embedded review system
- **Owner**: User reference for property ownership

### User Model
- Authentication with Passport.js
- Role-based access (editor, admin)
- Session management

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Application environment (development/production)
- `CLOUDINARY_*`: Cloudinary configuration for image uploads
- `MAPBOX_ACCESS_TOKEN`: Mapbox token for geolocation services

### Database Configuration
- Default MongoDB connection: `mongodb://127.0.0.1:27017/wander`
- Modify `dbUrl` in `app.js` for different database configurations

## 🌐 API Endpoints

### Authentication
- `GET /login` - Login page
- `POST /login` - Authenticate user
- `GET /signup` - Registration page
- `POST /signup` - Create new user
- `GET /logout` - Logout user

### Listings
- `GET /listings` - View all listings with filters
- `GET /listings/new` - Create new listing form
- `POST /listings` - Create new listing
- `GET /listings/:id` - View specific listing
- `GET /listings/:id/edit` - Edit listing form
- `PUT /listings/:id` - Update listing
- `DELETE /listings/:id` - Delete listing

### Reviews
- `POST /listings/:id/reviews` - Add review to listing
- `DELETE /reviews/:reviewId` - Delete review

## 🎨 Features in Detail

### Property Categories
- Trending destinations
- Beach properties
- Mountain retreats
- Iconic cities
- Amazing pools
- Camping sites
- Farms stays
- Arctic adventures
- Unique domes
- Boat accommodations

### Search & Filtering
- Location-based search
- Category filtering
- Price range filtering
- Map-based browsing

### User Experience
- Responsive design for all devices
- Image galleries for properties
- Star ratings and reviews
- Flash notifications for user actions
- Secure session management

## 🔒 Security Features

- Password hashing with bcrypt
- Session-based authentication
- CSRF protection
- Input validation with Joi
- XSS protection with HTTP-only cookies
- Secure file uploads with Cloudinary

## 🚀 Deployment

### Production Setup
1. Set `NODE_ENV=production`
2. Configure production database
3. Set up production Cloudinary account
4. Configure production Mapbox token
5. Deploy to your preferred hosting platform

### Environment-specific Configurations
- Development: Local MongoDB, detailed logging
- Production: Optimized settings, error handling

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check existing documentation
- Review the code comments for detailed explanations

## 🔄 Future Enhancements

- Advanced search filters
- Booking calendar system
- Payment integration
- User profiles
- Social sharing features
- Mobile app development

---

**Built with ❤️ for travel enthusiasts**
