package com.ppool.dto;

import com.ppool.entity.RideRequest;
import lombok.Data;

import java.time.LocalDateTime;

public class RideRequestDto {

    @Data
    public static class CreateRequest {
        private String pickupLocation;
        private Double pickupLat;
        private Double pickupLng;
    }

    @Data
    public static class Response {
        private String id;
        private String rideId;
        private UserDto.Response rider;
        private String pickupLocation;
        private RideRequest.RequestStatus status;
        private LocalDateTime createdAt;

        public static Response from(RideRequest req) {
            Response dto = new Response();
            dto.setId(req.getId());
            dto.setRideId(req.getRide().getId());
            dto.setRider(UserDto.Response.from(req.getRider()));
            dto.setPickupLocation(req.getPickupLocation());
            dto.setStatus(req.getStatus());
            dto.setCreatedAt(req.getCreatedAt());
            return dto;
        }
    }
}
