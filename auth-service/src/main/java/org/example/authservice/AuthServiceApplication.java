package org.example.authservice;

import org.example.authservice.entities.User;
import org.example.authservice.enums.Role;
import org.example.authservice.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.UUID;

@SpringBootApplication
public class AuthServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServiceApplication.class, args);
	}

//	@Bean
//	public CommandLineRunner insertAdmin(UserRepository userRepository, PasswordEncoder passwordEncoder) {
//		return args -> {
//			if (userRepository.count() == 0) {
//				String hashedPassword = passwordEncoder.encode("admin123"); // Hachage du mot de passe
//				User admin = User.builder()
//						.email("admin@example.com")
//						.password(hashedPassword)
//						.role(Role.ADMIN)
//						.entityId(UUID.randomUUID())
//						.build();
//				userRepository.save(admin);
//				System.out.println("Admin user inserted: " + admin);
//			}
//		};
//	}

}
