package com.travelplanner.repository;

import com.travelplanner.entity.Notification;
import com.travelplanner.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByScheduledForDesc(User user);
    List<Notification> findByUserAndIsReadFalseOrderByScheduledForDesc(User user);
    List<Notification> findByScheduledForBeforeAndSentAtIsNull(LocalDateTime dateTime);
    long countByUserAndIsReadFalse(User user);
}
