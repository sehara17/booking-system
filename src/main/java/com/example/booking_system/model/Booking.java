package com.example.bookingsystem.model;

import com.example.bookingsystem.model.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String resourceName;

    private String userEmail;

    private LocalDateTime startTime;
    private LocalDateTime endTime;

    private String purpose;
    private int attendees;

    @Enumerated(EnumType.STRING)
    private BookingStatus status = BookingStatus.PENDING;

    private String rejectionReason;
}