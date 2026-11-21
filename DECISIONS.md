# Engineering Decisions — Coffee Ninja

## 1. Inquiry Access and Ownership

**Decision:** All authenticated staff members can view and manage all customer inquiries.

**Reason:** Customer inquiries are shared business information. Allowing staff to access the same inquiry list helps team members continue handling customer requests when another staff member is unavailable.

Each inquiry stores the ID of the employee who created it through the `createdById` field. This maintains a record of who originally entered the inquiry.

The backend requires authentication before allowing access to inquiry endpoints.

## 2. Inquiry Status Transitions

**Decision:** The application uses three inquiry statuses:

- New
- In Progress
- Resolved

The allowed transitions are:

| Current status | Allowed next status |
|---|---|
| New | In Progress |
| In Progress | Resolved |
| Resolved | In Progress |

**Reason:** These transitions represent a simple inquiry-handling workflow.

A new inquiry can be started, an ongoing inquiry can be resolved, and a resolved inquiry can be reopened if further work is required.

The backend checks status transitions before updating the database. Invalid transitions are rejected instead of relying only on frontend controls.

## 3. Input Validation

**Decision:** Customer information fields must contain non-empty values.

The backend checks that customer name, contact, subject, and description are strings and are not empty after trimming whitespace.

Email and password are also validated during account registration. Passwords must contain at least eight characters.

**Reason:** Backend validation is important because API requests can be sent without using the frontend. It prevents invalid data from being stored simply because someone bypasses the form.

## 4. Duplicate Inquiry Handling

**Decision:** The system allows multiple inquiries from the same customer.

**Reason:** A customer may contact the company several times about different issues. Blocking inquiries based only on customer name or contact details could prevent legitimate requests.

Each inquiry is stored as a separate database record with its own ID.

## 5. Authentication and Security

**Decision:** JWT authentication is used to protect inquiry-related API endpoints.

Passwords are hashed using bcrypt before being saved in PostgreSQL. The backend verifies the JWT token before allowing access to protected inquiry routes.

**Reason:** Staff should be authenticated before viewing or changing customer inquiry information. Password hashing also prevents the original passwords from being stored directly in the database.

The current account registration endpoint is publicly accessible for assessment setup. For a production system, account creation should be restricted to an authorized administrator or another controlled process.

## 6. Data Persistence and Database Choice

**Decision:** PostgreSQL is used as the database, with Prisma ORM for database operations.

**Reason:** Inquiry information needs to remain available after the application is closed or restarted. PostgreSQL provides persistent relational storage, while Prisma makes database queries and schema management easier to maintain.

Database migrations are used to manage schema changes.

## 7. Stale Data Across Browser Tabs

**Decision:** The application does not use real-time synchronization between browser tabs.

**Reason:** Real-time updates would add complexity that is not necessary for the current assessment.

If an employee updates an inquiry in one tab, another tab may continue displaying the previous information until it refreshes or retrieves the data again. Users can refresh the page to obtain the latest information.

## 8. Error Handling

**Decision:** The backend returns suitable HTTP status codes and error messages for common failures.

Examples include:

- `400` — Invalid input or status transition.
- `401` — Missing or invalid authentication.
- `404` — Inquiry not found.
- `409` — Duplicate account email.
- `500` — Unexpected server error.

The frontend displays loading, error, and empty states where appropriate.

**Reason:** Clear feedback helps staff understand whether an operation succeeded or failed instead of leaving them uncertain.

## 9. Automated Testing

**Decision:** Vitest, Supertest, and React Testing Library are used for automated testing.

Two purposeful tests were implemented:

1. Backend security test: verifies that an unauthenticated request to the inquiry API receives HTTP 401.
2. Frontend interaction test: verifies that a login error is displayed and the Sign In button becomes enabled again after a failed login.

**Reason:** These tests check important security and user-interaction behaviour and help identify problems when the application changes.
