package backend.cbt.files.Controller;

import backend.cbt.files.model.Community;
import backend.cbt.files.Service.CommunityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

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

    @GetMapping("/{communityId}/members")
    public List<String> getCommunityMembers(@PathVariable String communityId) {
        Community community = communityService.getCommunityById(communityId);
        return community.getMemberIds();
    }

    @PostMapping
    public ResponseEntity<Community> createCommunity(@RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            String name = request.get("name");
            String description = request.get("description");
            logger.info("Received request to create community: userId={}, name={}, description={}", userId, name, description);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("User ID is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Community community = communityService.createCommunity(userId, name, description);
            return ResponseEntity.status(HttpStatus.CREATED).body(community);
        } catch (IllegalArgumentException e) {
            logger.error("Invalid community creation request: {}", e.getMessage());
            return ResponseEntity.badRequest().body(null);
        } catch (Exception e) {
            logger.error("Failed to create community: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Community>> searchCommunities(@RequestParam(required = false) String name) {
        logger.info("Searching communities with name query: {}", name);
        List<Community> communities = communityService.searchCommunities(name);
        return ResponseEntity.ok(communities);
    }

    @PostMapping("/{communityId}/join")
    public ResponseEntity<Community> joinCommunity(@PathVariable String communityId, @RequestBody Map<String, String> request) {
        try {
            String userId = request.get("userId");
            logger.info("Received join request for community {} by user {}", communityId, userId);
            if (userId == null || userId.trim().isEmpty()) {
                logger.error("User ID is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
            }
            Community community = communityService.joinCommunity(communityId, userId);
            return ResponseEntity.ok(community);
        } catch (RuntimeException e) {
            logger.error("Failed to join community: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            logger.error("Error processing join request: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }
}