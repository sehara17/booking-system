package com.example.bookingsystem.service;

import com.example.bookingsystem.model.Booking;
import com.example.bookingsystem.model.enums.BookingStatus;
import com.example.bookingsystem.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Map;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    public Booking createBooking(Booking booking, String userEmail) {
        String effectiveUserEmail = resolveUserEmail(userEmail, booking);
        validateCreateRequest(booking, effectiveUserEmail);

        if (hasConflict(booking)) {
            throw new IllegalStateException("Conflict detected: resource is already booked in this time slot.");
        }

        booking.setUserEmail(effectiveUserEmail);
        booking.setStatus(BookingStatus.PENDING);
        booking.setRejectionReason(null);
        booking.setCancelReason(null);
        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "New booking request submitted by " + effectiveUserEmail);
        notificationService.send(effectiveUserEmail, "Your booking request #" + saved.getId() + " was submitted and is pending review.");
        return saved;
    }

    public Booking approveBooking(Long id) {
        Booking booking = findById(id);
        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);
        booking.setCancelReason(null);
        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "Booking #" + saved.getId() + " was approved.");
        notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was approved.");
        return saved;
    }

    public Booking rejectBooking(Long id, String reason) {
        if (reason == null || reason.isBlank()) {
            throw new IllegalArgumentException("Rejection reason is required.");
        }

        Booking booking = findById(id);
        booking.setStatus(BookingStatus.REJECTED);
        booking.setRejectionReason(reason.trim());
        booking.setCancelReason(null);
        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "Booking #" + saved.getId() + " was rejected.");
        notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was rejected: " + saved.getRejectionReason());
        return saved;
    }

    public Booking cancelApprovedBooking(Long id, String userEmail, String cancelReason) {
        Booking booking = findById(id);

        if (!booking.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalStateException("You can only cancel your own bookings.");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only approved bookings can be cancelled by user.");
        }

        if (cancelReason == null || cancelReason.isBlank()) {
            throw new IllegalArgumentException("Cancellation reason is required.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelReason(cancelReason.trim());
        Booking saved = bookingRepository.save(booking);
        notificationService.send(
                "admin@booking.local",
                "Booking #" + saved.getId() + " was cancelled by user " + userEmail + ". Reason: " + saved.getCancelReason()
        );
        notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was cancelled successfully.");
        return saved;
    }

    public Booking cancelByAdmin(Long id, String cancelReason) {
        Booking booking = findById(id);

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new IllegalStateException("Booking is already cancelled.");
        }

        String normalizedReason = (cancelReason == null || cancelReason.isBlank())
            ? "Cancelled by admin"
            : cancelReason.trim();

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelReason(normalizedReason);
        booking.setRejectionReason(null);

        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "Booking #" + saved.getId() + " was cancelled by admin.");
        notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was cancelled by admin: " + saved.getCancelReason());
        return saved;
    }

    public void deleteBooking(Long id) {
        Booking booking = findById(id);
        bookingRepository.delete(booking);
        notificationService.send("admin@booking.local", "Booking #" + id + " was deleted by admin.");
        if (booking.getUserEmail() != null && !booking.getUserEmail().isBlank()) {
            notificationService.send(booking.getUserEmail(), "Booking #" + id + " was removed by admin.");
        }
    }

    public Booking editBookingByAdmin(Long id, Map<String, Object> payload) {
        Booking booking = findById(id);

        if (payload == null || payload.isEmpty()) {
            throw new IllegalArgumentException("Edit payload is required.");
        }

        if (payload.containsKey("resourceName")) {
            booking.setResourceName(asTrimmed(payload.get("resourceName")));
        }

        if (payload.containsKey("purpose")) {
            booking.setPurpose(asTrimmed(payload.get("purpose")));
        }

        if (payload.containsKey("attendees")) {
            booking.setAttendees(asInt(payload.get("attendees")));
        }

        if (payload.containsKey("startTime")) {
            booking.setStartTime(asDateTime(payload.get("startTime"), "startTime"));
        }

        if (payload.containsKey("endTime")) {
            booking.setEndTime(asDateTime(payload.get("endTime"), "endTime"));
        }

        if (payload.containsKey("status")) {
            BookingStatus nextStatus = asStatus(payload.get("status"));
            booking.setStatus(nextStatus);

            if (nextStatus == BookingStatus.APPROVED) {
                booking.setRejectionReason(null);
                booking.setCancelReason(null);
            } else if (nextStatus == BookingStatus.REJECTED) {
                booking.setCancelReason(null);
            } else if (nextStatus == BookingStatus.CANCELLED) {
                booking.setRejectionReason(null);
                if (booking.getCancelReason() == null || booking.getCancelReason().isBlank()) {
                    booking.setCancelReason("Cancelled by admin");
                }
            }
        }

        if (payload.containsKey("rejectionReason")) {
            String rejectionReason = asTrimmed(payload.get("rejectionReason"));
            booking.setRejectionReason(rejectionReason);
            if (rejectionReason != null && !rejectionReason.isBlank()) {
                booking.setStatus(BookingStatus.REJECTED);
                booking.setCancelReason(null);
            }
        }

        if (payload.containsKey("cancelReason")) {
            String cancelReason = asTrimmed(payload.get("cancelReason"));
            booking.setCancelReason(cancelReason);
            if (cancelReason != null && !cancelReason.isBlank()) {
                booking.setStatus(BookingStatus.CANCELLED);
                booking.setRejectionReason(null);
            }
        }

        validateEditedBooking(booking, id);

        if (hasConflictExcludingCurrent(booking, id)) {
            throw new IllegalStateException("Conflict detected: resource is already booked in this time slot.");
        }

        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "Booking #" + saved.getId() + " was edited by admin.");
        if (saved.getUserEmail() != null && !saved.getUserEmail().isBlank()) {
            notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was updated by admin.");
        }
        return saved;
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll().stream()
                .sorted((a, b) -> b.getStartTime().compareTo(a.getStartTime()))
                .toList();
    }

    public List<Booking> getUserBookings(String email) {
        return bookingRepository.findByUserEmailOrderByStartTimeDesc(email);
    }

    public List<Booking> getPendingBookings() {
        return bookingRepository.findByStatusOrderByStartTimeDesc(BookingStatus.PENDING);
    }

    private Booking findById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("Booking not found: " + id));
    }

    private boolean hasConflict(Booking booking) {
        List<Booking> overlaps = bookingRepository.findByResourceNameAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                booking.getResourceName(),
                booking.getEndTime(),
                booking.getStartTime()
        );

        return overlaps.stream().anyMatch(existing ->
                existing.getStatus() == BookingStatus.PENDING || existing.getStatus() == BookingStatus.APPROVED
        );
    }

    private void validateCreateRequest(Booking booking, String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            throw new IllegalArgumentException("User email is required.");
        }

        if (booking.getResourceName() == null || booking.getResourceName().isBlank()) {
            throw new IllegalArgumentException("Resource name is required.");
        }

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Start and end time are required.");
        }

        if (!booking.getEndTime().isAfter(booking.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        if (booking.getStartTime().isBefore(LocalDateTime.now().minusMinutes(1))) {
            throw new IllegalArgumentException("Start time must be in the future.");
        }

        if (booking.getAttendees() <= 0) {
            throw new IllegalArgumentException("Attendees must be at least 1.");
        }
    }

    private String resolveUserEmail(String headerEmail, Booking booking) {
        if (headerEmail != null && !headerEmail.isBlank()) {
            return headerEmail.trim();
        }

        if (booking != null && booking.getUserEmail() != null && !booking.getUserEmail().isBlank()) {
            return booking.getUserEmail().trim();
        }

        return "user@booking.local";
    }

    private void validateEditedBooking(Booking booking, Long id) {
        if (booking.getResourceName() == null || booking.getResourceName().isBlank()) {
            throw new IllegalArgumentException("Resource name is required.");
        }

        if (booking.getStartTime() == null || booking.getEndTime() == null) {
            throw new IllegalArgumentException("Start and end time are required.");
        }

        if (!booking.getEndTime().isAfter(booking.getStartTime())) {
            throw new IllegalArgumentException("End time must be after start time.");
        }

        if (booking.getAttendees() <= 0) {
            throw new IllegalArgumentException("Attendees must be at least 1.");
        }

        if (booking.getStatus() == BookingStatus.REJECTED && (booking.getRejectionReason() == null || booking.getRejectionReason().isBlank())) {
            throw new IllegalArgumentException("Rejection reason is required when status is REJECTED.");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED && (booking.getCancelReason() == null || booking.getCancelReason().isBlank())) {
            throw new IllegalArgumentException("Cancellation reason is required when status is CANCELLED.");
        }

        if (booking.getStatus() == BookingStatus.APPROVED) {
            booking.setRejectionReason(null);
            booking.setCancelReason(null);
        }
    }

    private boolean hasConflictExcludingCurrent(Booking booking, Long currentId) {
        List<Booking> overlaps = bookingRepository.findByResourceNameAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
                booking.getResourceName(),
                booking.getEndTime(),
                booking.getStartTime()
        );

        return overlaps.stream()
                .filter(existing -> !existing.getId().equals(currentId))
                .anyMatch(existing -> existing.getStatus() == BookingStatus.PENDING || existing.getStatus() == BookingStatus.APPROVED);
    }

    private String asTrimmed(Object value) {
        if (value == null) return null;
        String text = String.valueOf(value).trim();
        return text.isEmpty() ? null : text;
    }

    private int asInt(Object value) {
        if (value == null) {
            throw new IllegalArgumentException("Attendees is required.");
        }

        if (value instanceof Number number) {
            return number.intValue();
        }

        try {
            return Integer.parseInt(String.valueOf(value).trim());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException("Attendees must be a valid number.");
        }
    }

    private LocalDateTime asDateTime(Object value, String fieldName) {
        if (value == null || String.valueOf(value).isBlank()) {
            throw new IllegalArgumentException(fieldName + " is required.");
        }

        try {
            return LocalDateTime.parse(String.valueOf(value));
        } catch (DateTimeParseException ex) {
            throw new IllegalArgumentException(fieldName + " must be in ISO date-time format.");
        }
    }

    private BookingStatus asStatus(Object value) {
        if (value == null || String.valueOf(value).isBlank()) {
            throw new IllegalArgumentException("Status is required.");
        }

        try {
            return BookingStatus.valueOf(String.valueOf(value).trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid status. Use PENDING, APPROVED, REJECTED, or CANCELLED.");
        }
    }
}