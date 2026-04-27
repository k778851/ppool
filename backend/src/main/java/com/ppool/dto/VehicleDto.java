package com.ppool.dto;

import com.ppool.entity.Vehicle;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class VehicleDto {

    @Data
    public static class CreateRequest {
        @NotBlank
        private String plateNumber;
        @NotBlank
        private String carModel;
        @Min(1)
        private int maxSeats;
        private boolean insuranceVerified;
        private boolean licenseVerified;
        private boolean nonCommercialConfirmed;
    }

    @Data
    public static class Response {
        private String id;
        private String plateNumber;
        private String carModel;
        private int maxSeats;
        private boolean insuranceVerified;
        private boolean licenseVerified;
        private boolean nonCommercialConfirmed;

        public static Response from(Vehicle v) {
            Response dto = new Response();
            dto.setId(v.getId());
            dto.setPlateNumber(v.getPlateNumber());
            dto.setCarModel(v.getCarModel());
            dto.setMaxSeats(v.getMaxSeats());
            dto.setInsuranceVerified(v.isInsuranceVerified());
            dto.setLicenseVerified(v.isLicenseVerified());
            dto.setNonCommercialConfirmed(v.isNonCommercialConfirmed());
            return dto;
        }
    }
}
