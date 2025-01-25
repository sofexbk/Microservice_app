package org.example.professorservice.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImp implements EmailService {

    @Autowired
    private JavaMailSender mailSender;



    @Override
    @Async
    public void sendPasswordEmail(String toEmail, String password) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Votre inscription sur le service de gestion de l'ENSAT");

        // Utilisation d'un bloc de texte pour le contenu de l'email
        String emailContent = """
            Bonjour,

            Votre inscription au service de gestion de l'ENSAT a été réussie !
            Voici votre mot de passe : %s

            Cordialement,
            L'équipe de gestion de l'ENSAT
            """.formatted(password);

        message.setText(emailContent);
        message.setFrom("gestion@ensat.ma");

        // Envoi du message
        mailSender.send(message);
    }
}
