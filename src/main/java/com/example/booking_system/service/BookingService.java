package com.example.bookingsystem.service;

import com.example.bookingsystem.model.Booking;
import com.example.bookingsystem.repository.BookingRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BookingService {

    private final BookingRepository repo;

    public BookingService(BookingRepository repo) {
        this.repo = repo;
    }

    public Booking createBooking(Booking booking) {

        List<Booking> existingBookings =
                repo.findByResourceIdAndDate(
                        booking.getResourceId(),
                        booking.getDate()
                );

        for (Booking b : existingBookings) {

            if (b.getStatus().equals("APPROVED")) {

                boolean conflict =
                        booking.getStartTime().isBefore(b.getEndTime()) &&
                        booking.getEndTime().isAfter(b.getStartTime());

                if (conflict) {
                    throw new RuntimeException("Time slot already booked!");
                }
            }
        }

        booking.setStatus("PENDING");
        return repo.save(booking);
    }

    public List<Booking> getAllBookings() {
        return repo.findAll();
    }

    public Booking approveBooking(Long id) {
        Booking b = repo.findById(id).orElseThrow();
        b.setStatus("APPROVED");
        return repo.save(b);
    }

    public Booking rejectBooking(Long id) {
        Booking b = repo.findById(id).orElseThrow();
        b.setStatus("REJECTED");
        return repo.save(b);
    }

    public Booking cancelBooking(Long id) {
        Booking b = repo.findById(id).orElseThrow();
        b.setStatus("CANCELLED");
        return repo.save(b);
    }
}