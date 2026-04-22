package com.example.bookingsystem.service;

import com.example.bookingsystem.model.Notification;
import com.example.bookingsystem.repository.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public Notification send(String email, String message) {
        Notification n = new Notification();
        n.setUserEmail(email);
        n.setMessage(message);
        return repo.save(n);
    }

    public List<Notification> getUserNotifications(String email) {
        return repo.findByUserEmailOrderByCreatedAtDesc(email);
    }

    public void markAsRead(Long id) {
        Notification n = repo.findById(id).orElseThrow();
        n.setReadStatus(true);
        repo.save(n);
    }
}