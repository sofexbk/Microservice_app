package org.example.professorservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import java.util.Properties;

@Configuration
public class MailConfig {

    @Bean
    public JavaMailSender javaMailSender() {
        JavaMailSenderImpl mailSender = new JavaMailSenderImpl();
        mailSender.setHost("smtp.gmail.com");  // Gmail SMTP server address
        mailSender.setPort(587);  // SMTP port for TLS

        // Use your Gmail credentials here
        mailSender.setUsername("med.elaalouch@gmail.com");  // Your Gmail address
        mailSender.setPassword("gekj acsy kcyg gjlj");  // Your Gmail password or app password

        // Set the necessary mail properties for Gmail
        Properties properties = mailSender.getJavaMailProperties();
        properties.put("mail.transport.protocol", "smtp");
        properties.put("mail.smtp.auth", "true");
        properties.put("mail.smtp.starttls.enable", "true");  // Enable STARTTLS for secure connection
        properties.put("mail.smtp.ssl.trust", "smtp.gmail.com");  // Trust the Gmail SMTP server

        return mailSender;
    }
}
