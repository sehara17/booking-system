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
@RequestMapping({"/api/bookings", "/bookings"})
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
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
        return ResponseEntity.ok(service.approveBooking(id));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<?> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
        String reason = payload.getOrDefault("reason", "");
        return ResponseEntity.ok(service.rejectBooking(id, reason));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<?> cancel(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader
    ) {
        String reason = payload == null ? "" : payload.getOrDefault("reason", "");
        Role role = parseRole(roleHeader);

        if (role == Role.ADMIN) {
            return ResponseEntity.ok(service.cancelByAdmin(id, reason));
        }

        if (role == Role.USER) {
            return ResponseEntity.ok(service.cancelApprovedBooking(id, userEmail, reason));
        }

        throw new RuntimeException("Access denied. Expected role: USER or ADMIN");
    }

    @GetMapping
    public List<Booking> getAll(
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
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
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
        return service.getPendingBookings();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(
            @PathVariable Long id,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
        service.deleteBooking(id);
        return ResponseEntity.ok(Map.of("message", "Booking deleted."));
    }

    @PutMapping("/{id}/cancel/admin")
    public ResponseEntity<?> cancelByAdmin(
            @PathVariable Long id,
            @RequestBody(required = false) Map<String, String> payload,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
        String reason = payload == null ? "" : payload.getOrDefault("reason", "");
        return ResponseEntity.ok(service.cancelByAdmin(id, reason));
    }

    @PatchMapping("/{id}")
    public ResponseEntity<?> editByAdmin(
            @PathVariable Long id,
            @RequestBody Map<String, Object> payload,
            @RequestHeader(value = "X-User-Role", required = false) String roleHeader,
            @RequestHeader(value = "X-User-Email", required = false) String userEmail
    ) {
        requireRole(roleHeader, userEmail, Role.ADMIN);
        return ResponseEntity.ok(service.editBookingByAdmin(id, payload));
    }

    private void requireRole(String roleHeader, Role expectedRole) {
        Role actualRole = parseRole(roleHeader);
        if (actualRole != expectedRole) {
            throw new RuntimeException("Access denied. Expected role: " + expectedRole.name());
        }
    }

    private void requireRole(String roleHeader, String userEmail, Role expectedRole) {
        Role actualRole = parseRole(roleHeader);
        if (actualRole == expectedRole) {
            return;
        }

        if (expectedRole == Role.ADMIN && isAdminEmail(userEmail)) {
            return;
        }

        throw new RuntimeException("Access denied. Expected role: " + expectedRole.name());
    }

    private Role parseRole(String roleHeader) {
        if (roleHeader == null || roleHeader.isBlank()) {
            return null;
        }

        String normalized = roleHeader.trim().toUpperCase();
        if (normalized.startsWith("ROLE_")) {
            normalized = normalized.substring(5);
        }

        try {
            return Role.valueOf(normalized);
        } catch (IllegalArgumentException ignored) {
            return null;
        }
    }

    private boolean isAdminEmail(String userEmail) {
        if (userEmail == null || userEmail.isBlank()) {
            return false;
        }
        String normalized = userEmail.trim().toLowerCase();
        return normalized.startsWith("admin") || normalized.contains("admin@");
    }
}