package com.ppool.dto;

import com.ppool.entity.Ride;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;

public class RideDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String origin;
        private Double originLat;
        private Double originLng;

        @NotBlank
        private String destination;
        private Double destinationLat;
        private Double destinationLng;

        @NotNull @Future
        private LocalDateTime departureTime;

        @Min(1)
        private int maxSeats;

        private Ride.GenderPreference genderPreference = Ride.GenderPreference.ANY;
        private String notice;
    }

    @Data
    public static class Response {
        private String id;
        private UserDto.Response driver;
        private String origin;
        private Double originLat;
        private Double originLng;
        private String destination;
        private Double destinationLat;
        private Double destinationLng;
        private LocalDateTime departureTime;
        private int maxSeats;
        private int farePerPerson;
        private Ride.GenderPreference genderPreference;
        private Ride.RideStatus status;
        private String notice;
        private LocalDateTime createdAt;
        private int approvedCount;

        public static Response from(Ride ride, int approvedCount) {
            Response dto = new Response();
            dto.setId(ride.getId());
            dto.setDriver(UserDto.Response.from(ride.getDriver()));
            dto.setOrigin(ride.getOrigin());
            dto.setOriginLat(ride.getOriginLat());
            dto.setOriginLng(ride.getOriginLng());
            dto.setDestination(ride.getDestination());
            dto.setDestinationLat(ride.getDestinationLat());
            dto.setDestinationLng(ride.getDestinationLng());
            dto.setDepartureTime(ride.getDepartureTime());
            dto.setMaxSeats(ride.getMaxSeats());
            dto.setFarePerPerson(ride.getFarePerPerson());
            dto.setGenderPreference(ride.getGenderPreference());
            dto.setStatus(ride.getStatus());
            dto.setNotice(ride.getNotice());
            dto.setCreatedAt(ride.getCreatedAt());
            dto.setApprovedCount(approvedCount);
            return dto;
        }
    }
}
