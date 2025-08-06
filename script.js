// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth'
    });
}

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Add active class styles for mobile menu
    const style = document.createElement('style');
    style.textContent = `
        .nav-menu.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            background: white;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
        }
    `;
    document.head.appendChild(style);
    
    // Form submission handler
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleBookingSubmission();
        });
    }
    
    // Initialize calendar
    initializeCalendar();
    
    // Navigation link active state
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// USER-FRIENDLY Calendar with real-time updates
function initializeCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;
    
    // Get classes from localStorage with real-time sync
    const availableDates = getClassesFromStorage();
    const today = new Date();
    
    // Filter only future classes and sort by date
    const futureClasses = availableDates
        .filter(item => new Date(item.date) >= today)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 6); // Show next 6 classes
    
    let calendarHTML = `
        <div class="calendar-header">
            <h4 style="color: #2c5530; margin-bottom: 20px;">📅 Available Classes</h4>
            <p style="color: #666; font-size: 0.7rem; margin-bottom: 20px;">Book your seat today! Classes update in real-time.</p>
        </div>
        <div class="classes-list">
    `;
    
    if (futureClasses.length === 0) {
        calendarHTML += `
            <div class="no-classes" style="text-align: center; padding: 30px; color: #666;">
                <div style="font-size: 2rem; margin-bottom: 10px;">📝</div>
                <p>No upcoming classes scheduled.</p>
                <p style="font-size: 0.7rem;">Check back soon for new dates!</p>
            </div>
        `;
    } else {
        futureClasses.forEach((item, index) => {
            const date = new Date(item.date);
            const isToday = date.toDateString() === today.toDateString();
            const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
            const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
            const year = date.getFullYear();
            
            const seatStatus = item.seats === 0 ? 'FULL' : 
                             item.seats <= 2 ? 'ALMOST FULL' : 
                             'AVAILABLE';
            
            const seatColor = item.seats === 0 ? '#dc3545' : 
                             item.seats <= 2 ? '#fd7e14' : 
                             '#7a9a4d';
            
            const canBook = item.seats > 0;
            
            calendarHTML += `
                <div class="class-card-calendar" style="
                    background: ${canBook ? 'white' : '#f8f9fa'}; 
                    border: 2px solid ${canBook ? '#7a9a4d' : '#dee2e6'};
                    border-radius: 10px; 
                    padding: 15px; 
                    margin-bottom: 15px;
                    cursor: ${canBook ? 'pointer' : 'default'};
                    opacity: ${canBook ? '1' : '0.7'};
                    transition: all 0.3s ease;
                    position: relative;
                " ${canBook ? `onclick="quickBook('${item.class}', '${item.date}')"` : ''}>
                    
                    ${isToday ? '<div style="position: absolute; top: -5px; right: -5px; background: #dc3545; color: white; padding: 3px 8px; border-radius: 10px; font-size: 0.6rem; font-weight: bold;">TODAY</div>' : ''}
                    
                    <div class="class-date-info" style="display: flex; align-items: center; margin-bottom: 10px;">
                        <div class="date-circle" style="
                            background: ${seatColor}; 
                            color: white; 
                            width: 50px; 
                            height: 50px; 
                            border-radius: 50%; 
                            display: flex; 
                            flex-direction: column; 
                            align-items: center; 
                            justify-content: center; 
                            margin-right: 15px;
                            font-weight: bold;
                        ">
                            <div style="font-size: 0.6rem; line-height: 1;">${date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()}</div>
                            <div style="font-size: 1rem; line-height: 1;">${date.getDate()}</div>
                        </div>
                        <div>
                            <div style="font-weight: 600; color: #2c5530; font-size: 0.8rem;">${item.class}</div>
                            <div style="font-size: 0.7rem; color: #666;">${dayName}, ${monthDay} ${year}</div>
                        </div>
                    </div>
                    
                    <div class="class-availability" style="display: flex; justify-content: space-between; align-items: center;">
                        <div style="font-size: 0.7rem; color: ${seatColor}; font-weight: bold;">
                            ${item.seats === 0 ? '🚫 FULLY BOOKED' : 
                              item.seats === 1 ? '⚠️ LAST SEAT!' : 
                              item.seats <= 2 ? `⚠️ ONLY ${item.seats} SEATS LEFT` : 
                              `✅ ${item.seats} SEATS AVAILABLE`}
                        </div>
                        ${canBook ? '<div style="font-size: 0.6rem; color: #7a9a4d; font-weight: bold;">👆 CLICK TO BOOK</div>' : ''}
                    </div>
                </div>
            `;
        });
    }
    
    calendarHTML += `
        </div>
        <div style="text-align: center; margin-top: 20px; padding: 15px; background: #f8faf8; border-radius: 8px;">
            <p style="font-size: 0.7rem; color: #666; margin: 0;">💡 Classes are updated in real-time. Book quickly as seats fill up fast!</p>
        </div>
    `;
    
    calendar.innerHTML = calendarHTML;
    console.log('📅 Calendar updated with', futureClasses.length, 'available classes');
}

// Quick booking function
function quickBook(className, date) {
    // Auto-fill the booking form
    const classSelect = document.getElementById('className');
    const dateInput = document.getElementById('classDate');
    
    if (classSelect && dateInput) {
        // Map class names to form values
        const classMap = {
            'Artisan Bread Making': 'bread',
            'Farm-to-Table Cooking': 'farm-to-table', 
            'Classic Desserts': 'desserts'
        };
        
        const classValue = Object.keys(classMap).find(key => className.includes(key.split(' ')[0]));
        if (classValue) {
            classSelect.value = classMap[classValue];
            dateInput.value = date;
            
            // Scroll to booking form smoothly
            document.querySelector('.booking-form').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
            
            // Highlight the form
            const form = document.querySelector('.booking-form');
            form.style.boxShadow = '0 0 20px rgba(122, 154, 77, 0.5)';
            form.style.transform = 'scale(1.02)';
            
            setTimeout(() => {
                form.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
                form.style.transform = 'scale(1)';
            }, 2000);
            
            // Show helpful message
            const message = document.createElement('div');
            message.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #7a9a4d; color: white; padding: 10px 15px; border-radius: 5px; z-index: 1001; font-size: 0.7rem;';
            message.textContent = `✅ ${className} selected! Complete your booking below.`;
            document.body.appendChild(message);
            
            setTimeout(() => message.remove(), 3000);
        }
    }
}

// REAL-TIME localStorage functions for calendar management
function getClassesFromStorage() {
    // Always get fresh data from localStorage
    const stored = localStorage.getItem('cottageClasses');
    if (stored) {
        const classes = JSON.parse(stored);
        console.log('📊 Loaded', classes.length, 'classes from storage');
        return classes;
    }
    
    // Default classes if none stored
    const defaultClasses = [
        { date: '2025-02-14', class: 'Artisan Bread Making', seats: 4, id: 1 },
        { date: '2025-02-17', class: 'Farm-to-Table Cooking', seats: 6, id: 2 },
        { date: '2025-02-21', class: 'Classic Desserts', seats: 3, id: 3 },
        { date: '2025-02-24', class: 'Artisan Bread Making', seats: 5, id: 4 },
        { date: '2025-02-28', class: 'Farm-to-Table Cooking', seats: 2, id: 5 }
    ];
    
    // Save defaults to localStorage
    saveClassesToStorage(defaultClasses);
    return defaultClasses;
}

function saveClassesToStorage(classes) {
    localStorage.setItem('cottageClasses', JSON.stringify(classes));
    // Trigger calendar refresh if on main page
    if (document.getElementById('calendar')) {
        initializeCalendar();
    }
}

// ENHANCED: Listen for storage changes from admin panel
window.addEventListener('storage', function(e) {
    if (e.key === 'cottageClasses' || e.key === 'cottageClassesAdmin') {
        console.log('📺 Admin updated classes - refreshing customer view...');
        initializeCalendar();
        
        // Show update notification to user
        showUpdateNotification();
    }
});

// Show notification when classes are updated
function showUpdateNotification() {
    // Remove existing notification
    const existing = document.getElementById('updateNotification');
    if (existing) existing.remove();
    
    const notification = document.createElement('div');
    notification.id = 'updateNotification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #7a9a4d;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1001;
        font-size: 0.7rem;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        animation: slideIn 0.3s ease;
    `;
    notification.innerHTML = '✨ Classes updated! Fresh availability shown below.';
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    document.body.appendChild(notification);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease reverse';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// REAL-TIME: Function to trigger calendar updates across tabs
function triggerCalendarUpdate() {
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new CustomEvent('classesUpdated'));
    // Trigger storage event for cross-tab updates
    localStorage.setItem('lastUpdate', Date.now().toString());
    
    // Force immediate refresh of calendar
    setTimeout(() => {
        if (document.getElementById('calendar')) {
            console.log('🔄 Triggering real-time calendar update...');
            initializeCalendar();
        }
    }, 50);
    
    // Also trigger a storage event manually for same-tab updates
    window.dispatchEvent(new StorageEvent('storage', {
        key: 'cottageClasses',
        newValue: localStorage.getItem('cottageClasses')
    }));
}

// Listen for calendar updates
window.addEventListener('classesUpdated', function() {
    if (document.getElementById('calendar')) {
        console.log('🔄 Classes updated event received - refreshing...');
        initializeCalendar();
    }
});

// Auto-refresh calendar every 30 seconds to stay in sync
setInterval(() => {
    if (document.getElementById('calendar')) {
        const lastUpdate = localStorage.getItem('lastUpdate');
        if (lastUpdate) {
            const timeSince = Date.now() - parseInt(lastUpdate);
            if (timeSince < 30000) { // If updated within last 30 seconds
                console.log('🔄 Auto-refreshing calendar for recent updates...');
                initializeCalendar();
            }
        }
    }
}, 30000);

// Handle booking form submission
function handleBookingSubmission() {
    const formData = {
        className: document.getElementById('className').value,
        classDate: document.getElementById('classDate').value,
        seats: document.getElementById('seats').value,
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        dietary: document.getElementById('dietary').value
    };
    
    // Basic validation
    if (!formData.className || !formData.classDate || !formData.seats || 
        !formData.name || !formData.email || !formData.phone) {
        alert('Please fill in all required fields.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // REAL UPDATE: Update seat count in localStorage AND admin system
    const classes = getClassesFromStorage();
    const adminClasses = JSON.parse(localStorage.getItem('cottageClassesAdmin') || '[]');
    
    // Find matching class in customer storage
    const classToUpdate = classes.find(cls => {
        const clsDate = new Date(cls.date).toISOString().split('T')[0];
        const formDate = new Date(formData.classDate).toISOString().split('T')[0];
        return clsDate === formDate && cls.class.toLowerCase().includes(getClassNameFromValue(formData.className));
    });
    
    // Find matching class in admin storage
    const adminClassToUpdate = adminClasses.find(cls => {
        const clsDate = new Date(cls.date).toISOString().split('T')[0];
        const formDate = new Date(formData.classDate).toISOString().split('T')[0];
        return clsDate === formDate && cls.name.toLowerCase().includes(getClassNameFromValue(formData.className));
    });
    
    if (classToUpdate && classToUpdate.seats >= parseInt(formData.seats)) {
        // Update customer storage
        classToUpdate.seats -= parseInt(formData.seats);
        
        // Update admin storage - increase booked seats
        if (adminClassToUpdate) {
            adminClassToUpdate.bookedSeats += parseInt(formData.seats);
            localStorage.setItem('cottageClassesAdmin', JSON.stringify(adminClasses));
        }
        
        // Save booking record
        const bookings = JSON.parse(localStorage.getItem('cottageBookings') || '[]');
        const newBooking = {
            id: Date.now(),
            date: formData.classDate,
            customerName: formData.name,
            email: formData.email,
            phone: formData.phone,
            className: formData.className,
            seats: parseInt(formData.seats),
            dietary: formData.dietary,
            status: 'confirmed',
            bookingTime: new Date().toISOString()
        };
        bookings.push(newBooking);
        localStorage.setItem('cottageBookings', JSON.stringify(bookings));
        
        saveClassesToStorage(classes);
        triggerCalendarUpdate();
        
        // Show enhanced success message
        const successMessage = `✅ BOOKING CONFIRMED!\n\nThank you, ${formData.name}!\n${formData.seats} seat(s) booked for ${getFullClassName(formData.className)}\nDate: ${new Date(formData.classDate).toLocaleDateString()}\n\nConfirmation will be sent to: ${formData.email}\n\n⚡ Calendar updated in real-time!`;
        
        alert(successMessage);
        
        // Reset form
        document.getElementById('bookingForm').reset();
        
        // Scroll back to calendar to show updated availability
        setTimeout(() => {
            document.getElementById('calendar').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }, 1000);
    } else {
        alert('❌ Sorry, not enough seats available for this class. Please try a different date or fewer seats.\n\n🔄 Check the calendar below for updated availability!');
        // Refresh calendar to show current availability
        initializeCalendar();
    }
    
    // In a real application, this would also send data to a backend server
    console.log('Booking submission:', formData);
    
    // In a real app, you would:
    // 1. Send data to your backend API
    // 2. Process payment if required
    // 3. Send confirmation email
    // 4. Update calendar availability
    // 5. Add to booking management system
}

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
    }
});

// Admin functions for updating classes (for future implementation)
const AdminPanel = {
    // These functions would be implemented when you add admin functionality
    addClass: function(classData) {
        // Add new class to calendar
        console.log('Adding class:', classData);
    },
    
    updateClass: function(classId, newData) {
        // Update existing class
        console.log('Updating class:', classId, newData);
    },
    
    removeClass: function(classId) {
        // Remove class from calendar
        console.log('Removing class:', classId);
    },
    
    updateMonthlySchedule: function(monthData) {
        // Update entire month's schedule
        console.log('Updating monthly schedule:', monthData);
    }
};

// Export admin functions for future use
// Helper functions
function getClassNameFromValue(value) {
    const mapping = {
        'bread': 'bread making',
        'farm-to-table': 'farm-to-table',
        'desserts': 'desserts'
    };
    return mapping[value] || value;
}

function getFullClassName(value) {
    const mapping = {
        'bread': 'Artisan Bread Making',
        'farm-to-table': 'Farm-to-Table Cooking',
        'desserts': 'Classic Desserts'
    };
    return mapping[value] || value;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AdminPanel };
}