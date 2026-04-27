package com.ppool.service;

import com.ppool.dto.UserDto;
import com.ppool.dto.VehicleDto;
import com.ppool.entity.User;
import com.ppool.entity.Vehicle;
import com.ppool.repository.UserRepository;
import com.ppool.repository.VehicleRepository;
import com.ppool.util.EncryptUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final VehicleRepository vehicleRepository;
    private final EncryptUtil encryptUtil;

    @Transactional
    public UserDto.Response updateMe(User user, UserDto.UpdateRequest req) {
        if (req.getName() != null) user.setName(req.getName());
        if (req.getDepartment() != null) user.setDepartment(req.getDepartment());
        if (req.getPhone() != null) user.setPhone(req.getPhone());
        if (req.getAccountNumber() != null) {
            user.setAccountNumber(encryptUtil.encrypt(req.getAccountNumber()));
        }
        if (req.getAccountBank() != null) user.setAccountBank(req.getAccountBank());
        return UserDto.Response.from(userRepository.save(user));
    }

    @Transactional
    public VehicleDto.Response addVehicle(User user, VehicleDto.CreateRequest req) {
        if (!req.isInsuranceVerified() || !req.isLicenseVerified() || !req.isNonCommercialConfirmed()) {
            throw new IllegalArgumentException("운전자 등록 요건을 모두 확인해주세요.");
        }

        Vehicle vehicle = vehicleRepository.findByUser(user).orElse(new Vehicle());
        vehicle.setUser(user);
        vehicle.setPlateNumber(req.getPlateNumber());
        vehicle.setCarModel(req.getCarModel());
        vehicle.setMaxSeats(req.getMaxSeats());
        vehicle.setInsuranceVerified(req.isInsuranceVerified());
        vehicle.setLicenseVerified(req.isLicenseVerified());
        vehicle.setNonCommercialConfirmed(req.isNonCommercialConfirmed());

        user.setDriver(true);
        userRepository.save(user);

        return VehicleDto.Response.from(vehicleRepository.save(vehicle));
    }
}
