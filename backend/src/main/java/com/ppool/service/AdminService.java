package com.ppool.service;

import com.ppool.dto.UserDto;
import com.ppool.entity.User;
import com.ppool.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;

    public List<UserDto.Response> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto.Response::from)
                .toList();
    }

    @Transactional
    public void approveUser(String userId) {
        User user = findUser(userId);
        user.setStatus(User.UserStatus.APPROVED);
        user.setApprovedAt(LocalDateTime.now());
        userRepository.save(user);
    }

    @Transactional
    public void rejectUser(String userId) {
        User user = findUser(userId);
        user.setStatus(User.UserStatus.REJECTED);
        userRepository.save(user);
    }

    @Transactional
    public void banUser(String userId, int days) {
        User user = findUser(userId);
        user.setStatus(User.UserStatus.BANNED);
        user.setBannedUntil(LocalDateTime.now().plusDays(days > 0 ? days : 30));
        userRepository.save(user);
    }

    private User findUser(String id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }
}
