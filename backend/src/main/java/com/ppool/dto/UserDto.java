package com.ppool.dto;

import com.ppool.entity.User;
import lombok.Data;

public class UserDto {

    @Data
    public static class Response {
        private String id;
        private String name;
        private String department;
        private String phone;
        private User.Gender gender;
        private boolean isDriver;
        private boolean isAdmin;
        private User.UserStatus status;
        private int noShowCount;

        public static Response from(User user) {
            Response dto = new Response();
            dto.setId(user.getId());
            dto.setName(user.getName());
            dto.setDepartment(user.getDepartment());
            dto.setPhone(user.getPhone());
            dto.setGender(user.getGender());
            dto.setDriver(user.isDriver());
            dto.setAdmin(user.isAdmin());
            dto.setStatus(user.getStatus());
            dto.setNoShowCount(user.getNoShowCount());
            return dto;
        }
    }

    @Data
    public static class UpdateRequest {
        private String name;
        private String department;
        private String phone;
    }
}
