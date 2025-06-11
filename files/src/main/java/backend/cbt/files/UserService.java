package backend.cbt.files;

import org.springframework.stereotype.Service;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class UserService {

    private final Map<String, User> users = new ConcurrentHashMap<>();

    public User signup(String email, String password) {
        if (users.containsKey(email)) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User(email, password);
        users.put(email, user);
        return user;
    }

    public User login(String email, String password) {
        User user = users.get(email);
        if (user == null || !user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid credentials");
        }
        return user;
    }
}

