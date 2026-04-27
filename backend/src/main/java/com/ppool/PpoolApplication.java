package com.ppool;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class PpoolApplication {
    public static void main(String[] args) {
        SpringApplication.run(PpoolApplication.class, args);
    }
}
