package com.example.bookingsystem.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long resourceId;
    private Long userId;

    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;

    private String status; // PENDING, APPROVED, REJECTED, CANCELLED
}