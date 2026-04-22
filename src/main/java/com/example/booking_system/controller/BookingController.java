package com.example.bookingsystem.controller;

import com.example.bookingsystem.model.Booking;
import com.example.bookingsystem.model.enums.Role;
import com.example.bookingsystem.service.BookingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<?> create(
            @RequestBody Booking booking,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.USER);
        return ResponseEntity.ok(service.createBooking(booking, userEmail));
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<?> approve(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.ADMIN);
        return ResponseEntity.ok(service.approveBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.ADMIN);
        String reason = payload.getOrDefault("reason", "");
        return ResponseEntity.ok(service.rejectBooking(id, reason));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.USER);
        return ResponseEntity.ok(service.cancelApprovedBooking(id, userEmail));
    }

    @GetMapping
    public List<Booking> getAll(
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.ADMIN);
        return service.getAllBookings();
    }

    @GetMapping("/my")
    public List<Booking> getMyBookings(
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.USER);
        return service.getUserBookings(userEmail);
    }

    @GetMapping("/pending")
    public List<Booking> getPending(
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        requireRole(roleHeader, Role.ADMIN);
        return service.getPendingBookings();
    }

    private void requireRole(String roleHeader, Role expectedRole) {
        if (roleHeader == null || !roleHeader.equalsIgnoreCase(expectedRole.name())) {
            throw new IllegalStateException("Access denied. Expected role: " + expectedRole.name());
        }
    }
}