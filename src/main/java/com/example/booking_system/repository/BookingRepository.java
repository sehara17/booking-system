package com.example.bookingsystem.repository;

import com.example.bookingsystem.model.Booking;
import com.example.bookingsystem.model.enums.BookingStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByResourceNameAndStartTimeLessThanEqualAndEndTimeGreaterThanEqual(
            String resourceName,
            LocalDateTime end,
            LocalDateTime start
    );

    List<Booking> findByUserEmail(String email);

    List<Booking> findByUserEmailOrderByStartTimeDesc(String email);

    List<Booking> findByStatus(BookingStatus status);

    List<Booking> findByStatusOrderByStartTimeDesc(BookingStatus status);
}