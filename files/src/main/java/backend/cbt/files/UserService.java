package backend.cbt.files;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private MongoTemplate mongoTemplate;

    public boolean findByEmail(String email) {
        logger.info("Checking if user exists with email: {}", email);
        Query query = new Query(Criteria.where("email").is(email));
        User user = mongoTemplate.findOne(query, User.class);
        if (user != null) {
            logger.info("User found with email: {}", email);
            return true;
        } else {
            logger.info("No user found with email: {}", email);
            return false;
        }
    }
    
    public void signup(String email, String password) {
        logger.info("Signup attempt for email: {}", email);
        // Check if email already exists
        Query query = new Query(Criteria.where("email").is(email));
        User existingUser = mongoTemplate.findOne(query, User.class);
        if (existingUser != null) {
            logger.error("Email already exists: {}", email);
            throw new RuntimeException("Email already exists");
        }

        // Save new user
        User user = new User(email, password);
        try {
            User savedUser = mongoTemplate.save(user);
            if (savedUser == null) {
                logger.error("Failed to save user: {}", email);
                throw new RuntimeException("Failed to save user");
            }
            logger.info("User registered successfully: {}", email);
        } catch (Exception e) {
            logger.error("Error saving user: {}", e.getMessage());
            throw new RuntimeException("Error saving user: " + e.getMessage());
        }
    }

    public void login(String email, String password) {
        logger.info("Login attempt for email: {}", email);
        // Find user by email
        Query query = new Query(Criteria.where("email").is(email));
        User user = mongoTemplate.findOne(query, User.class);
        if (user == null) {
            logger.error("User not found: {}", email);
            throw new RuntimeException("User not found");
        }

        // Log stored and provided passwords for debugging
        logger.info("Stored password: '{}', Provided password: '{}'", user.getPassword(), password);
        if (!user.getPassword().equals(password)) {
            logger.error("Invalid password for email: {}", email);
            throw new RuntimeException("Invalid password");
        }

        logger.info("Login successful for email: {}", email);
    }
}