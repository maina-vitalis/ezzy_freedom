# Appointment Booking System

## Overview

A complete appointment booking system for Ezzy Freedom and Hope therapy services with user booking capabilities and admin management features.

## Features

### User Features

- **Book Appointments**: Users can schedule therapy sessions through an intuitive form
- **View Appointments**: See all personal appointments with status tracking
- **Multiple Appointment Types**:
  - General Consultation
  - Therapy Session
  - Follow-up Session
  - Counseling
  - Addiction Support
  - Couples Therapy
  - Teenage Session

### Admin Features

- **Dashboard Overview**: View all appointments with status counts
- **Status Management**: Approve, reject, or mark appointments as completed
- **Filtering**: Filter appointments by status (Pending, Approved, Rejected, etc.)
- **Admin Notes**: Add private notes to appointments
- **Delete Appointments**: Remove appointments when necessary

## Database Schema

### Enhanced Appointment Model

```prisma
model Appointment {
  id          String            @id @default(cuid())
  userId      String
  title       String
  description String?
  date        DateTime
  timeSlot    String            // e.g., "09:00-10:00", "14:00-15:00"
  status      AppointmentStatus @default(PENDING)
  type        AppointmentType   @default(CONSULTATION)
  notes       String?           // Admin notes
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt
  user        User              @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("appointments")
}

enum AppointmentStatus {
  PENDING
  APPROVED
  REJECTED
  CANCELLED
  COMPLETED
}

enum AppointmentType {
  CONSULTATION
  THERAPY
  FOLLOW_UP
  COUNSELING
  ADDICTION_SUPPORT
  COUPLES_THERAPY
  TEENAGE_SESSION
}
```

## API Endpoints

### POST /api/appointments

Create a new appointment

- **Auth Required**: Yes
- **Body**: AppointmentBookingType
- **Returns**: Created appointment with user details

### GET /api/appointments

Get appointments (filtered by user role)

- **Auth Required**: Yes
- **Returns**: Array of appointments
- **Admin**: Gets all appointments
- **User**: Gets only their own appointments

### PUT /api/appointments/[appointmentId]

Update appointment status (Admin only)

- **Auth Required**: Yes (Admin role)
- **Body**: { status, notes? }
- **Returns**: Updated appointment

### DELETE /api/appointments/[appointmentId]

Delete appointment

- **Auth Required**: Yes
- **Permissions**:
  - Users: Can delete their own appointments
  - Admins: Can delete any appointment

## Components

### AppointmentBookingForm

- Date picker with weekend/past date restrictions
- Time slot selection
- Appointment type selection
- Description field
- Form validation with Zod

### User Appointments Page

- Tabbed interface (Book | View Appointments)
- Appointment cards with status badges
- Real-time status updates

### Admin Appointments Page

- Data table with sorting/filtering
- Status overview cards
- Dropdown actions menu
- Modal for appointment details
- Bulk status updates

## Time Slots

Available appointment slots:

- 09:00-10:00
- 10:00-11:00
- 11:00-12:00
- 14:00-15:00
- 15:00-16:00
- 16:00-17:00

**Note**: Weekends are disabled for appointments

## Status Workflow

1. **PENDING**: Initial status when appointment is booked
2. **APPROVED**: Admin approves the appointment
3. **REJECTED**: Admin rejects the appointment (with optional notes)
4. **COMPLETED**: Session has been completed
5. **CANCELLED**: Appointment cancelled by user or admin

## Validation

### Appointment Booking Schema

```typescript
AppointmentBookingSchema = z.object({
  title: z.string().min(1, "Title is required").max(100, "Title too long"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  timeSlot: z.string().min(1, "Time slot is required"),
  type: z.enum([...appointmentTypes]),
});
```

## Installation & Setup

1. **Database Migration**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Environment Variables**
   Ensure your `.env` file has:

   ```
   DATABASE_URL="your_database_url"
   ```

3. **File Structure**
   ```
   src/
   ├── app/
   │   ├── api/appointments/
   │   │   ├── route.ts
   │   │   └── [appointmentId]/route.ts
   │   └── (main)/
   │       ├── admin/appointments/page.tsx
   │       └── users/[userName]/appointments/page.tsx
   ├── components/forms/
   │   └── AppointmentBookingForm.tsx
   └── util/validation.ts
   ```

## Usage

### For Users

1. Navigate to `/users/[username]/appointments`
2. Click "Book New Appointment" tab
3. Fill out the appointment form
4. Submit and wait for admin approval
5. Check status in "My Appointments" tab

### For Admins

1. Navigate to `/admin/appointments`
2. View all appointments in the data table
3. Use filters to view specific statuses
4. Click dropdown menu for actions:
   - View Details
   - Approve/Reject (for pending appointments)
   - Delete appointments
5. Add admin notes when updating status

## Security Features

- **Authentication Required**: All endpoints require valid session
- **Role-Based Access**: Admin-only endpoints are protected
- **Data Isolation**: Users can only access their own appointments
- **Input Validation**: All inputs are validated with Zod schemas
- **Conflict Prevention**: Prevents double-booking of time slots

## Error Handling

- **Time Slot Conflicts**: Prevents booking already occupied slots
- **Validation Errors**: Clear error messages for invalid inputs
- **Authentication Errors**: Proper 401/403 responses
- **Server Errors**: Graceful error handling with user-friendly messages

## Technologies Used

- **Frontend**: Next.js 15, React 19, TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: Better Auth
- **UI Components**: shadcn/ui, Radix UI
- **Forms**: React Hook Form with Zod validation
- **State Management**: TanStack Query
- **Styling**: Tailwind CSS
- **Date Handling**: date-fns

## Future Enhancements

- Email notifications for appointment status changes
- Calendar integration
- Recurring appointments
- Appointment reminders
- Video call integration
- Payment processing
- Mobile app support
