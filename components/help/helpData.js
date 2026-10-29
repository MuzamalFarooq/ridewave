export const HELP_CATEGORIES = [
  {
    id: 'booking-rides',
    title: 'Booking & Rides',
    badge: 'Travelers & Trips',
    iconName: 'Car',
    description: 'Find, schedule, manage, or cancel your intercity and urban rides on RideWave.',
    topics: [
      {
        title: 'How to book a ride',
        content:
          'Search for your departure and destination cities on the RideWave homepage or Explore Rides page. Select your travel date, review available verified drivers and seat prices, choose your required number of seats, and click "Book Seat". Confirm your contact details and payment preference to finalize your reservation.',
      },
      {
        title: 'How to check booking status',
        content:
          'Log in to your account and navigate to Traveller Dashboard > My Bookings. Here you will see active, upcoming, and past journeys. Each booking displays its current real-time state: Pending (awaiting driver response), Confirmed (seat locked), Ongoing (ride in progress), or Completed.',
      },
      {
        title: 'How to cancel a ride',
        content:
          'Go to My Bookings in your dashboard, select the specific trip, and click "Cancel Booking". You will be asked to select a reason for cancellation. Cancellations made prior to the trip departure window release your reserved seat for other travelers and trigger automatic refund eligibility where applicable.',
      },
      {
        title: 'What to do if a driver does not arrive',
        content:
          'Check the driver’s live location via the Live Map tracker in your dashboard. You can also message or call your driver using RideWave in-app chat. If the driver is more than 15 minutes overdue without communicating, tap "Report Driver No-Show" or contact support below for immediate booking reassignment or full refund processing.',
      },
      {
        title: 'How to report an incorrect pickup or drop-off location',
        content:
          'If the pin on the map does not match your exact pickup point, message your driver immediately via in-app chat before departure. To permanently adjust an error after booking, submit a request via our Contact Support form with your Booking Reference ID.',
      },
      {
        title: 'What to do if a ride is marked completed incorrectly',
        content:
          'If a driver marks a journey completed but you were never picked up or the destination was not reached, go to your booking details and click "Dispute Ride Status". Our dispute audit team will review the vehicle GPS telemetry timestamps to protect your funds.',
      },
    ],
  },
  {
    id: 'payments-pricing',
    title: 'Payments & Pricing',
    badge: 'Billing & Fares',
    iconName: 'CreditCard',
    description: 'Clear fare calculation, supported payment methods, invoices, and refund guidelines.',
    topics: [
      {
        title: 'Understanding ride fares',
        content:
          'Fares on RideWave are calculated transparently per seat based on trip distance, vehicle tier, and shared fuel costs. Drivers set competitive rates within platform limits. The total displayed at checkout includes all base costs with zero surprise surcharges.',
      },
      {
        title: 'Questions about payment methods',
        content:
          'RideWave supports online credit and debit card payments powered by Stripe, regional mobile wallets (JazzCash and EasyPaisa), and direct cash payment upon journey completion where offered by the driver.',
      },
      {
        title: 'What to do if a payment fails',
        content:
          'Ensure your card has international/e-commerce transactions enabled, check that your billing address matches your bank records, or try an alternative payment method like JazzCash or cash on arrival. You will not be charged for failed checkout attempts.',
      },
      {
        title: 'How to report an incorrect fare',
        content:
          'If you were charged an amount different from your confirmed booking summary, submit your Booking ID and payment receipt via the support form below. We will investigate the transaction ledger and adjust any discrepancy.',
      },
      {
        title: 'How to resolve duplicate payment concerns',
        content:
          'Banks occasionally display temporary authorization holds as pending duplicate charges. If two finalized charges appear on your statement for a single booking, contact our billing specialists with your statement screenshot for an immediate reversal.',
      },
      {
        title: 'Refund and cancellation-charge enquiries',
        content:
          'Eligible refunds for online payments are credited back to your original payment method. Stripe card reversals typically reflect within 5 to 10 business days depending on your bank, while digital wallet reversals process faster.',
      },
    ],
  },
  {
    id: 'account-profile',
    title: 'Account & Profile',
    badge: 'Security & Identity',
    iconName: 'UserCheck',
    description: 'Account registration, profile updates, credential management, and privacy settings.',
    topics: [
      {
        title: 'How to create a RideWave account',
        content:
          'Click "Register" at the top of RideWave. You can register quickly using your Google Account or sign up with your email address and a strong password. You will receive an email verification link to activate your profile.',
      },
      {
        title: 'How to update personal information',
        content:
          'Visit your Profile page from the top navigation dropdown. Here you can edit your display name, upload a profile picture, update your phone number, and set emergency contact details for safety.',
      },
      {
        title: 'How to change or recover a password',
        content:
          'If you forgot your password, click "Forgot Password" on the Login screen and enter your registered email. A secure, time-sensitive reset link will be sent to your inbox. If logged in, you can update your password directly under Account Settings.',
      },
      {
        title: 'How to resolve login problems',
        content:
          'Verify that you are using the correct email and password. If your account was registered with Google, use the "Continue with Google" button. Ensure browser cookies and JavaScript are enabled.',
      },
      {
        title: 'How to manage account security',
        content:
          'Never share your login credentials or OTP codes with anyone. RideWave employees will never ask for your password. Review active sessions and keep your recovery email updated.',
      },
      {
        title: 'How to request account deletion',
        content:
          'To permanently delete your RideWave account and personal data in accordance with our Privacy Policy, submit an Account Deletion Request via the support form below from your registered email address.',
      },
    ],
  },
  {
    id: 'safety-security',
    title: 'Safety & Security',
    badge: 'Protection & Trust',
    iconName: 'ShieldCheck',
    description: 'Driver vetting protocols, vehicle safety checks, incident reporting, and lost item support.',
    topics: [
      {
        title: 'Ride safety recommendations',
        content:
          'Always check that the driver’s face, name, vehicle make, and license plate number match the details shown in your RideWave booking before getting in. Share your live trip link with a friend or family member for peace of mind.',
      },
      {
        title: 'How to report inappropriate driver or passenger behaviour',
        content:
          'RideWave enforces a zero-tolerance policy against harassment, reckless driving, discrimination, or abusive conduct. Report any incident immediately through the post-ride rating screen or through our support form for prompt disciplinary action.',
      },
      {
        title: 'How to report a suspicious account',
        content:
          'If you notice a profile attempting to take payments outside the platform, soliciting personal details, or using fraudulent identification, report the user profile directly or email support with their user link.',
      },
      {
        title: 'What to do if personal belongings are left in a vehicle',
        content:
          'Contact your driver immediately through the in-app chat or call feature in your booking history. If the driver is unreachable, submit a "Lost Item" inquiry with your Booking ID and description of the item so our support team can assist in coordinating return.',
      },
      {
        title: 'How to report a safety incident',
        content:
          'For non-emergency safety incidents or vehicle roadworthiness concerns, submit an incident report with date, time, vehicle registration, and photos if available. Our Trust & Safety team will review the ride logs.',
      },
      {
        title: 'Guidance for emergencies',
        content:
          'In any life-threatening situation or serious accident, call local emergency response services (15 / 911 / 1122) immediately before contacting RideWave. Your personal safety is the absolute first priority.',
      },
    ],
  },
  {
    id: 'driver-support',
    title: 'Driver Support',
    badge: 'Driver Community',
    iconName: 'Award',
    description: 'Vehicle onboarding, document verification, ride publishing, and earnings management.',
    topics: [
      {
        title: 'How to register as a driver',
        content:
          'Click "Become a Driver" from the navigation bar. Complete your profile, upload your national ID (CNIC), an active driving license, and vehicle registration documents. Our verification team reviews submissions within 24 to 48 hours.',
      },
      {
        title: 'How to add or update vehicle information',
        content:
          'Go to Driver Dashboard > Vehicles > Add Vehicle. Submit your vehicle type (Car, Van, etc.), manufacturer, model year, seating capacity, license plate number, and photos. Updates to active vehicles require quick administrative approval.',
      },
      {
        title: 'How to manage incoming ride requests',
        content:
          'When travelers book seats on your posted rides, you receive in-app and email notifications. View bookings under Driver Dashboard > Bookings. You can review passenger details, coordinate pickup points, and manage available seats.',
      },
      {
        title: 'How to resolve booking disputes',
        content:
          'If a passenger fails to arrive at the designated pickup location within the agreed waiting window, take a photo or screenshot showing your arrival time and mark the passenger as no-show in your dashboard.',
      },
      {
        title: 'How to report technical issues',
        content:
          'If you encounter GPS tracking latency, ride publishing errors, or socket disconnects in the Driver Portal, report the problem with your device model, browser version, and error screenshot.',
      },
      {
        title: 'How to contact driver support',
        content:
          'Verified drivers receive dedicated support queue priority. Select "Driver Support" in the contact form below and include your registered driver phone number for expedited review.',
      },
    ],
  },
  {
    id: 'technical-issues',
    title: 'Technical Issues',
    badge: 'App & System Health',
    iconName: 'Wrench',
    description: 'GPS accuracy, map loading, browser compatibility, and platform connectivity.',
    topics: [
      {
        title: 'GPS or location not working',
        content:
          'Ensure location services and browser permissions are granted for https://ridewave.muzamal.site/. On mobile devices, set Location Permission to "High Accuracy" or "Precise Location" to allow accurate pickup detection.',
      },
      {
        title: 'Google Maps not loading correctly',
        content:
          'Map rendering requires an active internet connection and enabled WebGL graphics. Check whether ad-blockers or privacy extensions are blocking the Google Maps JavaScript API, or reload the page.',
      },
      {
        title: 'Ride booking errors',
        content:
          'Booking errors typically occur when another traveler books the last remaining seat concurrently. Refresh the ride listing to check current seat availability, or choose an alternate departure time.',
      },
      {
        title: 'Chat or messaging problems',
        content:
          'In-app chat uses real-time WebSockets. If messages are not sending or updating, check your internet connectivity. Reconnecting or refreshing the dashboard will restore the socket connection.',
      },
      {
        title: 'Website not loading properly',
        content:
          'Clear your browser cache and cookies, or try accessing RideWave in an Incognito / Private window. Ensure your browser is updated to the latest stable release.',
      },
      {
        title: 'Browser compatibility and connectivity issues',
        content:
          'RideWave is optimized for modern versions of Google Chrome, Apple Safari, Mozilla Firefox, and Microsoft Edge on both desktop and mobile platforms.',
      },
    ],
  },
];

export const FAQS = [
  {
    id: 'faq-1',
    category: 'Booking & Rides',
    question: 'How do I book a ride on RideWave?',
    answer:
      'To book a ride, go to the homepage or "Explore Rides" page. Enter your pickup origin, destination, travel date, and required seats. Browse matching trips posted by verified drivers, select your preferred vehicle and departure time, and click "Book Seat". Confirm your passenger details and payment preference. Once confirmed, you will receive an instant booking confirmation with driver contact information.',
  },
  {
    id: 'faq-2',
    category: 'Booking & Rides',
    question: 'Can I track my driver in real time?',
    answer:
      'Yes. For all confirmed and ongoing journeys, travelers have access to real-time GPS telemetry directly inside the Traveller Dashboard. On the day of travel, when your driver starts the trip, an interactive map displays vehicle movement, estimated time of arrival (ETA), and route checkpoints.',
  },
  {
    id: 'faq-3',
    category: 'Booking & Rides',
    question: 'Can I cancel a booking after confirming it?',
    answer:
      'Yes, you can cancel your booking through the Traveller Dashboard under "My Bookings". Click on the trip details and select "Cancel Booking". Cancellations made well in advance release your seat to other passengers and are eligible for refunds in accordance with our cancellation policy.',
  },
  {
    id: 'faq-4',
    category: 'Booking & Rides',
    question: 'What should I do if my driver does not arrive?',
    answer:
      'First, check the live map in your dashboard to see your driver’s current GPS location and send a quick message via in-app chat. If the driver is more than 15 minutes late without explanation and is unreachable, you can cancel the trip without penalty and file a "Driver No-Show" report to receive an immediate refund or rebooking.',
  },
  {
    id: 'faq-5',
    category: 'Booking & Rides',
    question: 'How can I contact my driver?',
    answer:
      'Once a booking is confirmed, direct in-app messaging and contact details become accessible in your Traveller Dashboard. You can exchange messages regarding exact pickup landmarks, luggage requirements, and arrival timings without sharing private credentials.',
  },
  {
    id: 'faq-6',
    category: 'Payments & Pricing',
    question: 'How are ride fares calculated?',
    answer:
      'RideWave ride fares are calculated on a transparent per-seat basis reflecting route distance, vehicle category, and shared fuel expenses. Drivers specify rates within platform-regulated boundaries to ensure affordability. The price you see during checkout is all-inclusive with zero surprise fees.',
  },
  {
    id: 'faq-7',
    category: 'Payments & Pricing',
    question: 'What should I do if my payment fails?',
    answer:
      'If your online card payment fails, check that your card supports 3D-Secure e-commerce payments and has sufficient balance. You can also switch to alternative payment options like JazzCash, EasyPaisa, or direct cash payment upon journey completion if permitted for that ride.',
  },
  {
    id: 'faq-8',
    category: 'Account & Profile',
    question: 'How can I reset my password?',
    answer:
      'Navigate to the Login page and click "Forgot password?". Enter your registered email address and submit. You will receive an automated email containing a secure, single-use password reset link valid for 1 hour. Follow the link to choose a new secure password.',
  },
  {
    id: 'faq-9',
    category: 'Driver Support',
    question: 'Can I register my vehicle as a RideWave driver?',
    answer:
      'Yes. Vehicle owners can apply through the "Become a Driver" portal. You will need to provide valid CNIC/identity documentation, an active driving license, and official vehicle registration papers. Our compliance team verifies all submitted documents before approving your driver profile.',
  },
  {
    id: 'faq-10',
    category: 'Safety & Security',
    question: 'How do I report a safety concern?',
    answer:
      'You can report a safety concern directly through the post-trip review screen or by using the support request form below with the category set to "Safety & Security Concern". For immediate physical danger or emergencies, always dial local emergency services (15 / 911 / 1122) first.',
  },
  {
    id: 'faq-11',
    category: 'Safety & Security',
    question: 'What happens if I leave something in a vehicle?',
    answer:
      'If you forgot personal belongings in a vehicle, open your trip history in the Traveller Dashboard and contact your driver immediately via in-app chat. If you cannot reach the driver, submit a support ticket with your Booking Reference ID, a detailed description of the item, and the trip date.',
  },
  {
    id: 'faq-12',
    category: 'Technical Issues',
    question: 'How can I report a technical problem?',
    answer:
      'If you experience technical issues such as GPS location errors, map loading glitches, or booking form snags, submit a report via the Contact Support form below with category "Technical Issues". Providing your device model, browser version, and a screenshot helps our engineering team resolve it rapidly.',
  },
  {
    id: 'faq-13',
    category: 'Payments & Pricing',
    question: 'What payment methods are supported on RideWave?',
    answer:
      'RideWave supports online credit and debit card payments processed securely through Stripe, domestic mobile wallets (JazzCash and EasyPaisa), and traditional cash payment directly to the driver upon destination arrival.',
  },
  {
    id: 'faq-14',
    category: 'Driver Support',
    question: 'How does RideWave verify drivers and vehicles?',
    answer:
      'Every driver on RideWave undergoes a thorough vetting process including government identity verification (CNIC), driving license background validation, and vehicle roadworthiness document inspection. Rides can only be posted by accounts with an "Approved" verification status.',
  },
  {
    id: 'faq-15',
    category: 'Booking & Rides',
    question: 'What should I do if a ride is marked completed incorrectly?',
    answer:
      'If your ride status reflects "Completed" but the journey never occurred or was terminated prematurely, immediately submit a support request with your Booking Reference ID. Our team audits real-time GPS telemetry records to verify the claim and process necessary adjustments.',
  },
  {
    id: 'faq-16',
    category: 'Account & Profile',
    question: 'How do I update my profile details or phone number?',
    answer:
      'Sign in and navigate to Profile from your dashboard dropdown. You can update your phone number, avatar, address, and emergency contact details. Keeping your contact details up to date ensures seamless trip coordination and timely booking alerts.',
  },
];

