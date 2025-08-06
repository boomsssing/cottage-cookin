# Brian Averna Cottage Cooking Website

A simple, elegant booking website for cottage cooking classes at **brianavernacottagecooking.com**.

## Features

### Customer-Facing Website (`index.html`)
- **Modern, responsive design** with warm cottage cooking aesthetic
- **Class showcase** with three main offerings:
  - Artisan Bread Making ($85)
  - Farm-to-Table Cooking ($75) 
  - Classic Desserts ($95)
- **Interactive booking system** with calendar integration
- **Contact information** and about section
- **Mobile-friendly navigation** with hamburger menu

### Admin Panel (`admin.html`)
- **Dashboard** with key metrics (bookings, revenue, available seats)
- **Class management** - easily add new class sessions
- **Monthly calendar view** showing all scheduled classes
- **Booking management** - view and manage customer reservations
- **Monthly schedule updates** - bulk operations for recurring classes

## Getting Started

1. **Upload files** to your web hosting service
2. **Update contact information** in `index.html` (address, phone, email)
3. **Replace logo** - use your actual logo file or rename `80EEC885-72BE-48B4-8172-AD040AAE62E9.png`
4. **Access admin panel** at `yourdomain.com/admin.html`

## File Structure

```
├── index.html          # Main customer website
├── admin.html          # Admin panel for managing classes
├── styles.css          # Main website styles
├── admin-styles.css    # Admin panel specific styles
├── script.js           # Customer website functionality
├── admin.js            # Admin panel functionality
├── 80EEC885-72BE-48B4-8172-AD040AAE62E9.png  # Logo file
└── README.md           # This file
```

## Customization

### Adding New Class Types
1. Open `admin.html` and add option to the "Class Type" dropdown
2. Update the `classNames` object in `admin.js`
3. Add new class card to `index.html` if desired

### Styling Changes
- Modify `styles.css` for main website appearance
- Modify `admin-styles.css` for admin panel appearance
- Colors can be changed by updating the CSS color variables

### Calendar Integration
Currently uses a simple JavaScript calendar. For production, consider integrating with:
- Google Calendar API
- Booking platforms like Calendly
- Custom backend with database

## Next Steps for Production

### Backend Integration
- Set up database for storing classes and bookings
- Implement server-side form processing
- Add email notifications for confirmations
- Integrate payment processing (Stripe, PayPal)

### SEO Optimization
- Add meta descriptions and keywords
- Implement structured data markup
- Create sitemap and robots.txt
- Optimize images for web

### Additional Features
- Customer accounts and booking history
- Email marketing integration
- Reviews and testimonials
- Gift certificate system
- Waitlist functionality

## Cost-Effective Hosting Options

### Budget-Friendly Hosts
- **Shared hosting**: $3-10/month (Hostinger, Namecheap)
- **Static site hosting**: Free-$5/month (Netlify, Vercel)
- **WordPress hosting**: $5-15/month (for easier content management)

### Domain Setup
Your domain `brianavernacottagecooking.com` can be:
- Purchased through any domain registrar ($10-15/year)
- Pointed to your hosting provider
- Set up with email addresses (hello@brianavernacottagecooking.com)

## Support

This website is designed to be simple and easy to maintain. Basic HTML/CSS knowledge is helpful for customizations, but the admin panel allows for day-to-day class management without technical skills.

For major modifications or backend integration, consider hiring a web developer or using this as a starting point for a more robust booking system.