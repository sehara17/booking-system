package com.example.bookingsystem.repository;

import com.example.bookingsystem.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    List<Booking> findByResourceIdAndDate(Long resourceId, LocalDate date);
}