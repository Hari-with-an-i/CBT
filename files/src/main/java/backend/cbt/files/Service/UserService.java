package backend.cbt.files.Service;

import backend.cbt.files.model.User;
import backend.cbt.files.Repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public void signup(String email, String password) {
        logger.info("Signup attempt for email: {}", email);
        Optional<User> existingUser = userRepository.findByEmail(email);
        if (existingUser.isPresent()) {
            logger.error("Email already exists: {}", email);
            throw new RuntimeException("Email already exists");
        }
        User user = new User(email, password);
        userRepository.save(user);
        logger.info("User registered successfully: {}", email);
    }

    public String login(String email, String password) {
        logger.info("Login attempt for email: {}", email);
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isEmpty()) {
            logger.error("User not found: {}", email);
            throw new RuntimeException("User not found");
        }
        User user = userOpt.get();
        if (!user.getPassword().equals(password)) {
            logger.error("Invalid password for email: {}", email);
            throw new RuntimeException("Invalid password");
        }
        String token = jwtUtil.generateToken(user.getId());
        logger.info("Login successful for email: {}", email);
        return token;
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User getUserById(String userId) {
        return userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found"));
    }
}