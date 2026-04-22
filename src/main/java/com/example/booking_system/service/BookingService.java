package com.example.bookingsystem.service;

import com.example.bookingsystem.model.Booking;
import com.example.bookingsystem.model.enums.BookingStatus;
import com.example.bookingsystem.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final NotificationService notificationService;

    public BookingService(BookingRepository bookingRepository, NotificationService notificationService) {
        this.bookingRepository = bookingRepository;
        this.notificationService = notificationService;
    }

    public Booking createBooking(Booking booking, String userEmail) {
        validateCreateRequest(booking, userEmail);

        if (hasConflict(booking)) {
            throw new IllegalStateException("Conflict detected: resource is already booked in this time slot.");
        }

        booking.setUserEmail(userEmail);
        booking.setStatus(BookingStatus.PENDING);
        booking.setRejectionReason(null);
        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "New booking request submitted by " + userEmail);
        notificationService.send(userEmail, "Your booking request #" + saved.getId() + " was submitted and is pending review.");
        return saved;
    }

    public Booking approveBooking(Long id) {
        Booking booking = findById(id);
        booking.setStatus(BookingStatus.APPROVED);
        booking.setRejectionReason(null);
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
        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "Booking #" + saved.getId() + " was rejected.");
        notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was rejected: " + saved.getRejectionReason());
        return saved;
    }

    public Booking cancelApprovedBooking(Long id, String userEmail) {
        Booking booking = findById(id);

        if (!booking.getUserEmail().equalsIgnoreCase(userEmail)) {
            throw new IllegalStateException("You can only cancel your own bookings.");
        }

        if (booking.getStatus() != BookingStatus.APPROVED) {
            throw new IllegalStateException("Only approved bookings can be cancelled by user.");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        Booking saved = bookingRepository.save(booking);
        notificationService.send("admin@booking.local", "Booking #" + saved.getId() + " was cancelled by user " + userEmail);
        notificationService.send(saved.getUserEmail(), "Booking #" + saved.getId() + " was cancelled successfully.");
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
}