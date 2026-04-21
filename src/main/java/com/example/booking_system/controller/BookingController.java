package com.example.bookingsystem.controller;

import com.example.bookingsystem.model.Booking;
import com.example.bookingsystem.service.BookingService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/bookings")
public class BookingController {

    private final BookingService service;

    public BookingController(BookingService service) {
        this.service = service;
    }

    
    @GetMapping("/status")
    public String home() {
        return "Booking System is running on port 8090!";
    }

    @PostMapping
    public Booking create(@RequestBody Booking booking) {
        return service.createBooking(booking);
    }

    @GetMapping
    public List<Booking> getAll() {
        return service.getAllBookings();
    }

    @PutMapping("/{id}/approve")
    public Booking approve(@PathVariable Long id) {
        return service.approveBooking(id);
    }

    @PutMapping("/{id}/reject")
    public Booking reject(@PathVariable Long id) {
        return service.rejectBooking(id);
    }

    @PutMapping("/{id}/cancel")
    public Booking cancel(@PathVariable Long id) {
        return service.cancelBooking(id);
    }
}

