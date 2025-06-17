package backend.cbt.files.Controller;

import backend.cbt.files.model.Community;
import backend.cbt.files.Service.CommunityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/communities")
public class CommunityController {
    private static final Logger logger = LoggerFactory.getLogger(CommunityController.class);

    @Autowired
    private CommunityService communityService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Community>> getCommunitiesByUserId(@PathVariable String userId) {
        logger.info("Fetching communities for user: {}", userId);
        List<Community> communities = communityService.getCommunitiesByUserId(userId);
        return ResponseEntity.ok(communities);
    }
}