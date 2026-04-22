package com.example.bookingsystem.controller;

import com.example.bookingsystem.model.Notification;
import com.example.bookingsystem.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/my")
    public List<Notification> getMyNotifications(
            @RequestHeader(value = "X-User-Email", required = false) String email
    ) {
        return service.getUserNotifications(email);
    }

    @GetMapping("/admin")
    public List<Notification> getAdminNotifications() {
        return service.getUserNotifications("admin@booking.local");
    }

    @PutMapping("/{id}/read")
    public void markRead(@PathVariable Long id) {
        service.markAsRead(id);
    }
}