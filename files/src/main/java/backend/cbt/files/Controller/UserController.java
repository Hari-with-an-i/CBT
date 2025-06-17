package backend.cbt.files.Controller;

import backend.cbt.files.model.User;
import backend.cbt.files.Service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/users")
public class UserController {
    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @GetMapping("/{userId}/points")
    public ResponseEntity<Map<String, Integer>> getUserPoints(@PathVariable String userId) {
        logger.info("Fetching points for user: {}", userId);
        User user = userService.getUserById(userId);
        return ResponseEntity.ok(Map.of("totalPoints", user.getPoints()));
    }
}